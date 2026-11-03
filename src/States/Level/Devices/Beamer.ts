import Body from "@/utils/box2d/Body";
import {
  FixtureData,
  NormalLightProperties,
  PortalLightProperties,
  TransparentLightProperties,
} from "@/utils/Fixture";
import { b2Fixture, b2PolygonShape, b2Readonly, b2Vec2 } from "@box2d/core";
import { BitmapData, Color, Game, Graphics, PIXI } from "phaser";
import _ from "underscore";
import BoxedDevice from "./BoxedDevice";
import { type DeviceOptions, Light } from "./Device";

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
    vertices.push(new b2Vec2(0, -this.options.pusherWidth / 2 - 0.6));
    vertices.push(new b2Vec2(0, this.options.pusherWidth / 2 + 0.6));
    vertices.push(
      new b2Vec2(-this.options.pusherHeight, this.options.pusherWidth / 2),
    );
    vertices.push(
      new b2Vec2(-this.options.pusherHeight, -this.options.pusherWidth / 2),
    );
    const shape = new b2PolygonShape();
    shape.Set(vertices);
    const fixture = this.body.data.CreateFixture<never>({
      shape,
      friction: 0.7,
      restitution: 0,
      density: 0,
      filter: { categoryBits: 1, maskBits: 65535 },
    });
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
      this.mpx(points.start.point.x) + offset.x,
      this.mpx(points.start.point.y) + offset.y,
    );

    for (const beam of points.points) {
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
      this.graphics.clear();
      return;
    }
    let hit: RayCastHit | null = null;
    const rayCastCallback = (
      fixture: b2Fixture,
      point: b2Readonly<b2Vec2>,
      normal: b2Readonly<b2Vec2>,
      fraction: number,
    ) => {
      const data = FixtureData.getData(fixture)?.lightProperties ?? null;
      if (data instanceof TransparentLightProperties) return -1;
      if (data instanceof PortalLightProperties) {
        if (data.portal.state !== 1) return -1;
      }

      hit = [data, point.Clone(), normal.Clone()];

      return fraction;
    };
    const points = new Points(
      new b2Vec2(this.pxm(this.options.x), this.pxm(this.options.y)),
    );
    let source: b2Readonly<b2Vec2> = points.start.point;
    let direction: b2Readonly<b2Vec2> = new b2Vec2(-1, 0).Rotate(
      this.options.rotation || 0,
    );
    while (points.length < 12) {
      const testSource = source.Clone();
      const testDestination = source.Clone().Add(direction.Clone().Scale(50));
      hit = null;

      this.body.world.world.RayCast(
        testSource,
        testDestination,
        rayCastCallback,
      );

      if (!hit) break;
      const [data, point, normal] = hit as RayCastHit;

      if (data instanceof PortalLightProperties) {
        const newSource = data.getPoint(point, normal);
        source = newSource;
        direction = data.getOutput(direction);
        // Draw to entrance portal
        points.drawTo(point);
        // Move to exit portal
        points.moveTo(newSource);
        continue;
      }

      if (data?.illuminate) {
        data.illuminationColour = this.options.properties.color;
        data.illuminationPoint = point.Clone();
      }

      source = point.Clone();
      points.drawTo(point);

      if (data?.reflect) {
        const incident = testSource
          .Clone()
          .Subtract(testDestination)
          .SelfNormalize();
        direction = normal
          .Clone()
          .Scale(2 * normal.Dot(incident))
          .Subtract(incident);
      } else {
        break;
      }
    }
    if (!_.isEqual(this.points, points)) {
      this.graphics.clear();
      this.dirty = true;
      this.points = points;
      this.graphics.blendMode = PIXI.blendModes.LIGHTEN;
      for (const [width, alpha] of [
        // [30, 0.05],
        [10, 0.3],
        [2, 1],
      ]) {
        this.graphics.lineStyle(width, this.graphicsColor, alpha);
        this.drawBeam(this.graphics, this.points);
      }
    }
  }
}

type RayCastHit = [
  data: PortalLightProperties | NormalLightProperties | null | undefined,
  point: b2Readonly<b2Vec2>,
  normal: b2Readonly<b2Vec2>,
];
type Point = { type: "move" | "line"; point: b2Vec2 };
class Points {
  readonly start: { point: b2Vec2 };
  readonly points: Point[];

  constructor(start: b2Readonly<b2Vec2>) {
    this.start = { point: start.Clone() };
    this.points = [];
  }

  moveTo(point: b2Readonly<b2Vec2>) {
    this.points.push({ type: "move", point: point.Clone() });
  }

  drawTo(point: b2Readonly<b2Vec2>) {
    this.points.push({ type: "line", point: point.Clone() });
  }

  get length(): number {
    return 1 + this.points.length;
  }
}

export default Beamer;
