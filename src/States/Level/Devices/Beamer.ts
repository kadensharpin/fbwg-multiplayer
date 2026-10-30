import Body from "@/utils/box2d/Body";
import { Fixture } from "@/utils/util";
import box2d from "@box2d/core";
import { BitmapData, Color, Game, Graphics, PIXI } from "phaser";
import _ from "underscore";
import BoxedDevice from "./BoxedDevice";
import Device, { type DeviceOptions, Light } from "./Device";

type BeamerOptions = {
  pusherWidth: number;
  pusherHeight: number;

  properties: {
    color?: "red" | "blue" | "yellow";
  };
} & DeviceOptions;

class Beamer extends BoxedDevice<BeamerOptions> {
  private readonly graphics: Graphics;
  private readonly graphicsColor: number;
  state = 1;
  dirty: boolean = false;
  points: Points | null = null;
  declare body: Body;

  constructor(game: Game, options: BeamerOptions) {
    options.pusherWidth ??= 0.8;
    options.pusherHeight ??= 0.4;
    options.atlasName ??= "MechAssets";
    options.frameName ??= "beamer0000";
    options.layer ??= "overGround";

    super(game, options);

    this.drawDarkMask = this.drawDarkMask.bind(this);
    this.drawBeam = this.drawBeam.bind(this);
    this.update = this.update.bind(this);
    this.getColor = this.getColor.bind(this);

    this.body.mass = 0;
    const vertices = [];
    vertices.push(new box2d.b2Vec2(0, -this.options.pusherWidth / 2 - 0.6));
    vertices.push(new box2d.b2Vec2(0, this.options.pusherWidth / 2 + 0.6));
    vertices.push(
      new box2d.b2Vec2(
        -this.options.pusherHeight,
        this.options.pusherWidth / 2,
      ),
    );
    vertices.push(
      new box2d.b2Vec2(
        -this.options.pusherHeight,
        -this.options.pusherWidth / 2,
      ),
    );
    const shape = new box2d.b2PolygonShape();
    shape.Set(vertices);
    const fixtureDef = {} as box2d.b2FixtureDef;
    fixtureDef.shape = shape;
    fixtureDef.friction = 0.7;
    fixtureDef.restitution = 0;
    fixtureDef.density = 0;
    fixtureDef.filter = { categoryBits: 1, maskBits: 65535 };
    const fixture = this.body.data.CreateFixture(fixtureDef);
    fixture.id = this.body.world.getNextFixtureId();
    const light = this.game.make.sprite(
      0,
      0,
      "MechAssets",
      "beamer_light_off0000",
    ) as Light;
    light.anchor.set(0.5);
    this.sprite!.addChild(light);
    light.offFrameName = "beamer_light_off0000";
    light.onFrameName = "beamer_light_on0000";
    this.lights.push(light);
    this.registerDevice();
    this.graphics = this.game.make.graphics(0, 0);
    this.game.layers.lights.addChild(this.graphics);
    this.game.layers.dust.sources.push(this);
    this.graphicsColor = Color.hexToColor(this.getColor()).color;
  }

  drawDarkMask(bitmapData: BitmapData & { offset: { x: number; y: number } }) {
    if (this.state !== 1 || this.points == null) return;
    bitmapData.ctx.globalCompositeOperation = "lighter";
    bitmapData.ctx.beginPath();
    bitmapData.ctx.lineCap = "round";
    bitmapData.ctx.strokeStyle = "rgba(255,255,255,0.8)";
    bitmapData.ctx.lineWidth = 25;
    this.drawBeam(bitmapData.ctx, this.points, bitmapData.offset);
    bitmapData.ctx.stroke();
    bitmapData.ctx.closePath();
    const pos = {
      x: this.sprite!.x + bitmapData.offset.x,
      y: this.sprite!.y + bitmapData.offset.y,
    };
    const gradient = bitmapData.ctx.createRadialGradient(
      pos.x,
      pos.y,
      30,
      pos.x,
      pos.y,
      90,
    );
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.5, "rgba(255,255,255,0.3)");
    gradient.addColorStop(1, "transparent");
    bitmapData.circle(pos.x, pos.y, 90, gradient);
  }

  drawBeam(
    graphics: Graphics | CanvasRenderingContext2D,
    points: Points,
    offset?: { x: number; y: number },
  ) {
    offset ??= { x: 0, y: 0 };
    graphics.moveTo(
      this.mpx(points[0]!.point.x) + offset.x,
      this.mpx(points[0]!.point.y) + offset.y,
    );

    for (const beam of points.slice(1) as Point[]) {
      if (beam.type === "line") {
        graphics.lineTo(
          this.mpx(beam.point.x) + offset.x,
          this.mpx(beam.point.y) + offset.y,
        );
        graphics.moveTo(
          this.mpx(beam.point.x) + offset.x,
          this.mpx(beam.point.y) + offset.y,
        );
      } else if (beam.type === "move") {
        graphics.moveTo(
          this.mpx(beam.point.x) + offset.x,
          this.mpx(beam.point.y) + offset.y,
        );
      }
    }
  }

  getColor() {
    switch (this.options.properties.color) {
      case "blue":
        return "#AAEAFF";
      case "red":
        return "#FF4D00";
      default:
        return "#ffff88";
    }
  }

  update() {
    this.dirty = false;
    if (this.state !== 1) {
      if (this.points !== null) this.dirty = true;
      this.points = null;
      return this.graphics.clear();
    }
    const callback = ((fixture, point, normal, fraction) => {
      const fixtureData = fixture.GetUserData() as {
        device?: Device<DeviceOptions>;
        lightProperties?:
          | {
              type: "transparent" | "normal" | "mirror";
              sensor?: box2d.b2Fixture;
              iluminated?: "red" | "blue" | "yellow";
              lightAt?: box2d.b2Vec2;
            }
          | {
              type: "portal";
              getOutput: (input: box2d.b2Vec2) => box2d.b2Vec2;
              getPoint: (
                point: box2d.b2Readonly<box2d.b2Vec2>,
                normal: box2d.b2Readonly<box2d.b2Vec2>,
              ) => box2d.b2Vec2;
            };
      } | null;
      if (fixtureData?.lightProperties == null) {
        callback.contact = { point: point.Clone(), normal: null };
        return fraction;
      }
      if (fixtureData.lightProperties.type === "transparent") {
        return 0;
      }
      if ("normal" === fixtureData.lightProperties.type) {
        callback.contact = { point: point.Clone(), normal: null };
        if (fixtureData.lightProperties.sensor) {
          callback.contact.sensor = fixture as any;
        }
        return fraction;
      }
      if ("mirror" === fixtureData.lightProperties.type) {
        callback.contact = {
          point: point.Clone(),
          normal: normal.Clone(),
        };
        if (fixtureData.lightProperties.sensor) {
          callback.contact.sensor = fixture as any;
        }
        return fraction;
      }
      if ("portal" === fixtureData.lightProperties.type) {
        if (fixtureData.device?.state !== 1) return 0;
        callback.contact = {
          point: fixtureData.lightProperties.getPoint(point, normal),
          output: fixtureData.lightProperties.getOutput,
          skipPoint: point.Clone(),
        };
        return fraction;
      }
      if (fixtureData.lightProperties.sensor && callback.contact) {
        callback.contact.sensor = fixture as any;
      }
      return 0;
    }) as box2d.b2RayCastCallback & {
      dir?: null | undefined | box2d.b2Vec2;
      point?: null | undefined | box2d.b2Vec2;
      contact?:
        | null
        | undefined
        | {
            point: box2d.b2Vec2;
            normal?: box2d.b2Vec2 | null;
            sensor?: Fixture<{
              lightProperties: {
                iluminated?: "red" | "blue" | "yellow";
                lightAt?: box2d.b2Vec2;
              };
            }>;
            output?: (v: box2d.b2Vec2) => box2d.b2Vec2;
            skipPoint?: box2d.b2Vec2;
          };
    };
    callback.point = new box2d.b2Vec2(
      this.pxm(this.options.x),
      this.pxm(this.options.y),
    );
    callback.dir = new box2d.b2Vec2(-1, 0).Rotate(this.options.rotation || 0);
    const points: Points = [{ point: callback.point.Clone() }];
    while (callback.dir != null && points.length < 12) {
      const point1 = callback.point.Clone();
      const point2 = callback.point.Clone().Add(callback.dir.Clone().Scale(50));
      callback.contact = null;
      this.body.world.world.RayCast(point1, point2, callback);
      callback.contact = (callback as typeof callback).contact;
      if (callback.contact == null) continue;
      callback.point = callback.contact.point;
      if (callback.contact.sensor != null) {
        callback.contact.sensor.m_userData.lightProperties.iluminated =
          this.options.properties.color;
        callback.contact.sensor.m_userData.lightProperties.lightAt =
          callback.contact.point;
      }
      if (callback.contact.skipPoint) {
        points.push({
          type: "line",
          point: callback.contact.skipPoint.Clone(),
        });
        points.push({ type: "move", point: callback.point.Clone() });
      } else {
        points.push({ type: "line", point: callback.point.Clone() });
      }
      if (callback.contact.output != null && callback.dir) {
        callback.dir = callback.contact.output(callback.dir);
      } else if (callback.contact.normal != null) {
        const normal1 = point1.Clone().Subtract(point2);
        normal1.Normalize();
        const normal2 = new box2d.b2Vec2(
          callback.contact.normal.y,
          -callback.contact.normal.x,
        );
        callback.dir = normal1
          .Clone()
          .Subtract(normal2.Clone().Scale(2 * normal1.Clone().Dot(normal2)));
      } else {
        callback.dir = null;
      }
    }
    if (!_.isEqual(this.points, points)) {
      this.graphics.clear();
      this.dirty = true;
      this.points = points;
      this.graphics.blendMode = PIXI.blendModes.LIGHTEN;
      for (const [width, alpha] of [
        [30, 0.05],
        [10, 0.3],
        [2, 1],
      ]) {
        this.graphics.lineStyle(width, this.graphicsColor, alpha);
        this.drawBeam(this.graphics, this.points);
      }
    }
  }
}

type Point = { type: "move" | "line"; point: box2d.b2Vec2 };
type Points = [{ point: box2d.b2Vec2 }, ...Point[]];

export default Beamer;
