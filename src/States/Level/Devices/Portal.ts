import {
  Animation,
  BitmapData,
  Game,
  Graphics,
  Physics,
  Sound,
  Sprite,
  Tile,
} from "phaser";
import * as box2d from "phaser-box2d";
import BoxedDevice, { BoxedDeviceOptions } from "./BoxedDevice";
import { Light } from "./Device";

type PortalOptions = {
  rotation: number;
  sensorWidth: number;
  sensorHeigh: number;
  lightSensorWidth: number;

  properties: {
    portalId: number;
    inverted: boolean;
  };
} & BoxedDeviceOptions;

class Portal extends BoxedDevice<PortalOptions> {
  readonly center: Sprite;
  readonly glowLeft: Sprite;
  readonly glowRight: Sprite;
  readonly sensorFixture: box2d.b2Fixture;
  readonly eventHorizon: box2d.b2Fixture;
  readonly nearBodies: Record<
    number,
    {
      body: Physics.Box2D.Body & { side?: -1 | 1 };
      dist: null;
      mask?: Graphics;
    }
  >;
  readonly transporting: {
    body: Physics.Box2D.Body;
    vel: box2d.b2Vec2;
    side: -1 | 1;
  }[] = [];
  readonly normal: box2d.b2Vec2;
  other?: Portal;
  private fakeWallFixture?: box2d.b2Fixture;
  private sound?: Sound | null;
  private receiving: boolean = false;

  declare body: Physics.Box2D.Body;

  constructor(game: Game, options: PortalOptions) {
    options.rotation ||= 0;
    options.sensorWidth ??= 2;
    options.sensorHeigh ??= 1.5;
    options.lightSensorWidth ??= 0.1;
    options.boxSize = { width: 2, height: 3 };

    super(game, options);

    this.drawDarkMask = this.drawDarkMask.bind(this);
    this.ocupy = this.ocupy.bind(this);
    this.createFakeBlock = this.createFakeBlock.bind(this);
    // this.debugVector = this.debugVector.bind(this);
    this.destroy = this.destroy.bind(this);
    this.update = this.update.bind(this);
    this.updateState = this.updateState.bind(this);
    this.transport = this.transport.bind(this);
    this.removeMask = this.removeMask.bind(this);
    this.createMask = this.createMask.bind(this);
    this.sounds = this.sounds.bind(this);

    this.center = this.game.make.sprite(
      this.options.x,
      this.options.y,
      "MechAssets",
    );
    this.center.animations.add(
      "loop",
      Animation.generateFrameNames("portal_center", 0, 39, "", 4),
      30,
      true,
    );
    this.center.animations.play("loop");
    this.center.anchor.set(0.5);
    this.game.physics.box2d.enable(this.center);
    this.body = this.center.body;
    this.game.layers.liquids.addChild(this.center);
    this.glowLeft = this.game.make.sprite(
      this.options.x,
      this.options.y,
      "MechAssets",
    );
    this.glowLeft.animations.add(
      "loop",
      Animation.generateFrameNames("portal_glow", 0, 29, "", 4),
      30,
      true,
    );
    this.glowLeft.animations.play("loop");
    this.glowLeft.anchor.set(0.5);
    this.glowLeft.scale.x = -1;
    this.glowLeft.rotation = this.options.rotation || 0;
    this.glowLeft.alpha = 0;
    this.glowLeft.tint = 0;
    this.game.layers.liquids.addChild(this.glowLeft);
    this.glowRight = this.game.make.sprite(
      this.options.x,
      this.options.y,
      "MechAssets",
    );
    this.glowRight.animations.add(
      "loop",
      Animation.generateFrameNames("portal_glow", 0, 29, "", 4),
      30,
      true,
    );
    this.glowRight.animations.play("loop");
    this.glowRight.anchor.set(0.5);
    this.glowRight.rotation = this.options.rotation || 0;
    this.glowRight.alpha = 0;
    this.game.layers.liquids.addChild(this.glowRight);
    const portal = this.game.make.sprite(
      this.options.x,
      this.options.y,
      "MechAssets",
      "portal0000",
    );
    portal.anchor.set(0.5);
    portal.rotation = this.options.rotation || 0;
    const portalLight = this.game.make.sprite(
      0,
      0,
      "MechAssets",
      "portal_light_off0000",
    ) as Light;
    portalLight.anchor.set(0.5);
    portal.addChild(portalLight);
    portalLight.offFrameName = "portal_light_off0000";
    portalLight.onFrameName = "portal_light_on0000";
    this.lights.push(portalLight);
    this.game.layers.liquids.addChild(portal);
    this.options.properties.inverted &&
      ((this.center.scale.x = -1),
      (portal.scale.x = -1),
      (this.glowLeft.scale.x = 1),
      (this.glowRight.scale.x = -1));
    this.body.clearFixtures();
    this.body.mass = 0;
    this.body.data.SetAngle(this.options.rotation);
    const sensorShape = new box2d.b2PolygonShape();
    sensorShape.SetAsOrientedBox(
      this.options.sensorWidth,
      this.options.sensorHeigh,
      new box2d.b2Vec2(0, 0),
      0,
    );
    const sensorfixtureDef = new box2d.b2FixtureDef();
    sensorfixtureDef.shape = sensorShape;
    sensorfixtureDef.density = 0;
    sensorfixtureDef.isSensor = true;
    sensorfixtureDef.filter.maskBits = 4096;
    sensorfixtureDef.filter.categoryBits = 4096;
    sensorfixtureDef.userData = { lightProperties: { type: "transparent" } };
    this.sensorFixture = this.body.data.CreateFixture(sensorfixtureDef);
    this.sensorFixture.id = this.body.world.getNextFixtureId();
    const eventHorizonShape = new box2d.b2PolygonShape();
    eventHorizonShape.SetAsOrientedBox(
      this.options.lightSensorWidth,
      this.options.sensorHeigh,
      new box2d.b2Vec2(0, 0),
      0,
    );
    const eventHorizonDef = new box2d.b2FixtureDef();
    eventHorizonDef.shape = eventHorizonShape;
    eventHorizonDef.density = 0;
    eventHorizonDef.isSensor = false;
    eventHorizonDef.filter.maskBits = 4096;
    eventHorizonDef.filter.categoryBits = 4096;
    eventHorizonDef.userData = {
      lightProperties: {
        type: "portal",
        getOutput: (input: box2d.b2Vec2): box2d.b2Vec2 => {
          if (!this.other) return input;
          const rotation =
            (this.other.options.rotation || 0) - (this.options.rotation || 0);
          return this.other.options.properties.inverted ===
            this.options.properties.inverted
            ? input.SelfRotateRadians(rotation + Math.PI)
            : input.SelfRotateRadians(rotation);
        },
        getPoint: (point: box2d.b2Vec2, normal: box2d.b2Vec2): box2d.b2Vec2 => {
          if (!this.other) return point;
          normal = new box2d.b2Vec2(0, 1).SelfRotateRadians(
            this.options.rotation || 0,
          );
          let offset = point.Clone().SelfSub(this.body.data.GetPosition());
          if (
            this.other.options.properties.inverted !==
            this.options.properties.inverted
          ) {
            offset = normal
              .Clone()
              .SelfMul((2 * offset.Dot(normal)) / normal.Length())
              .SelfSub(offset);
          }
          const rotation =
            (this.other.options.rotation || 0) - (this.options.rotation || 0);
          offset.SelfRotateRadians(rotation);
          return this.other.body.data.GetPosition().SelfAdd(offset);
        },
      },
      device: this,
    };
    this.eventHorizon = this.body.data.CreateFixture(eventHorizonDef);
    this.eventHorizon.id = this.body.world.getNextFixtureId();
    this.registerDevice();
    this.nearBodies = {};
    this.body.setFixtureContactCallback(
      this.sensorFixture,
      (
        _body1: Physics.Box2D.Body,
        body2: Physics.Box2D.Body & { side?: -1 | 1 },
        _fixture1: box2d.b2Fixture,
        fixture2: box2d.b2Fixture,
        begin: boolean,
      ) => {
        if (!fixture2.m_userData["portal-sensor"]) return;
        if (begin || null == this.nearBodies[body2.id]) {
          if (1 === this.state && begin && null == this.nearBodies[body2.id]) {
            console.log("add", body2.id);
            const x = this.body.data.GetLocalPoint(
              body2.data.GetPosition(),
              new box2d.b2Vec2(),
            ).x;
            const body = { body: body2, dist: null };
            body2.side = (x / Math.abs(x)) as -1 | 1;
            this.createMask(body);
            this.nearBodies[body2.id] = body;
          }
        } else {
          console.log("remove", body2.id);
          const body = this.nearBodies[body2.id];
          if (body) this.removeMask(body);
          delete this.nearBodies[body2.id];
        }
      },
      this,
    );
    this.body.setFixtureContactCallback(
      this.eventHorizon,
      (
        _body1: Physics.Box2D.Body,
        body2: Physics.Box2D.Body & { lastTransport?: number },
        _fixture1: box2d.b2Fixture,
        _fixture2: box2d.b2Fixture,
        begin: boolean,
      ) => {
        if (!begin) return;
        const x = this.body.data.GetLocalPoint(
          body2.data.GetPosition(),
          new box2d.b2Vec2(),
        ).x;
        const side =
          (x > 0 && !this.options.properties.inverted) ||
          (x < 0 && this.options.properties.inverted)
            ? 1
            : -1;
        if (
          !body2.lastTransport ||
          new Date().getTime() - body2.lastTransport > 200
        ) {
          body2.lastTransport = new Date().getTime();
          this.transporting.push({
            body: body2,
            vel: body2.data.GetLinearVelocity().Clone(),
            side: side,
          });
        } else {
          console.log("prevented transport...");
        }
      },
      this,
    );
    this.options.properties.inverted
      ? (this.normal = new box2d.b2Vec2(1, 0))
      : (this.normal = new box2d.b2Vec2(-1, 0));
    this.normal.SelfRotateRadians(this.options.rotation || 0);
  }

  sounds() {
    return ["portalOpen", "portalLoop", "portalClose", "portalTransport"];
  }

  createMask(body: (typeof this.nearBodies)[number]) {
    const height = this.mpx(3 * this.options.sensorHeigh);
    const mask = this.game.make.graphics(0, 0);
    this.game.level.root.addChild(mask);
    mask.beginFill(16777215);
    const direction = new box2d.b2Vec2(-1, 0).SelfRotateRadians(
      this.options.rotation || 0,
    );
    const position = body.body.data
      .GetPosition()
      .Clone()
      .SelfSub(this.body.data.GetPosition());
    const width = direction.Dot(position) < 0 ? this.mpx(5) : -this.mpx(5);
    mask.drawRect(0, -height, width, 2 * height);
    mask.x = this.options.x;
    mask.y = this.options.y;
    mask.angle = (180 * this.options.rotation) / Math.PI || 0;
    body.mask = mask;
    body.body.sprite.mask = mask;
  }

  removeMask(body: (typeof this.nearBodies)[number]) {
    // @ts-ignore
    body.body.sprite.mask = null;
    body.mask?.destroy();
  }

  transport(body: (typeof this.transporting)[number]) {
    if (!this.other) return;
    const direction = new box2d.b2Vec2(0, 1).SelfRotateRadians(
      this.options.rotation || 0,
    );
    let pos = body.body.data
      .GetPosition()
      .Clone()
      .SelfSub(this.body.data.GetPosition());
    if (
      this.other.options.properties.inverted !==
      this.options.properties.inverted
    ) {
      pos = direction
        .Clone()
        .SelfMul((2 * pos.Dot(direction)) / direction.Length())
        .SelfSub(pos);
    }
    const rotation =
      (this.other.options.rotation || 0) - (this.options.rotation || 0);
    pos.SelfRotateRadians(rotation);
    body.body.data.SetPosition(this.other.body.data.GetPosition().SelfAdd(pos));
    let velocity: box2d.b2Vec2;
    if (
      this.other.options.properties.inverted ===
      this.options.properties.inverted
    ) {
      velocity = body.vel.Clone().SelfRotateRadians(-rotation);
      velocity = direction
        .Clone()
        .SelfMul((2 * velocity.Dot(direction)) / direction.Length())
        .SelfSub(velocity);
    } else {
      velocity = body.vel.Clone().SelfRotateRadians(rotation);
    }
    body.body.data.SetLinearVelocity(velocity);
    if (velocity.Length() < 10) {
      const otherNormal = this.other.normal.Clone();
      if (1 === body.side) otherNormal.SelfMul(-1);
      body.body.data.SetLinearVelocity(
        velocity.SelfNormalize().SelfMul(10 / body.body.data.GetMass()),
      );
    }
    this.game.physics.update();
    this.game.level.sounds.portalTransport.play();
    this.sensorFixture.Refilter();
    this.eventHorizon.Refilter();
  }

  updateState(mute: boolean) {
    if (1 !== this.state || this.center.visible) {
      if (0 === this.state && this.center.visible) {
        this.center.visible = false;
        const filter = new box2d.b2Filter();
        filter.maskBits = 0;
        filter.categoryBits = 0;
        this.eventHorizon.SetFilterData(filter);
        this.sensorFixture.SetFilterData(filter);
        if (null != this.sound) {
          this.sound.stopInstance();
          this.sound = null;
        }
        if (!mute) {
          this.game.level.sounds.portalClose.play();
        }
      }
    } else {
      this.center.visible = true;
      const filter = new box2d.b2Filter();
      filter.maskBits = 4096;
      filter.categoryBits = 4096;
      this.eventHorizon.SetFilterData(filter);
      this.sensorFixture.SetFilterData(filter);
      this.game.level.sounds.portalOpen.play();
      this.game.level.sounds.portalLoop.loop = true;
      if (!mute) {
        this.sound = this.game.level.sounds.portalLoop.playInstance();
        this.sound!.volume = 0.3;
      }
    }
    this.sensorFixture.Refilter();
    if (this.fakeWallFixture != null) {
      const filter = new box2d.b2Filter();
      if (1 === this.state) {
        filter.maskBits = 0;
        filter.categoryBits = 0;
      } else {
        filter.maskBits = 4369;
        filter.categoryBits = 1;
      }
      this.fakeWallFixture.SetFilterData(filter);
      this.fakeWallFixture.Refilter();
    }
  }

  update() {
    if (!this.other) return;
    if (this.state === 1 && Object.keys(this.nearBodies).length > 0) {
      let leftAlpha = Infinity;
      let rightAlpha = Infinity;
      for (const body of Object.values(this.nearBodies)) {
        const pos = this.body.data.GetLocalPoint(
          body.body.data.GetPosition(),
          new box2d.b2Vec2(),
        );
        let x = pos.x;
        if (body.body.side && body.body.side !== x / Math.abs(x)) {
          console.log("side violation!", body.body);
          body.body.data.SetPosition(
            body.body.data.GetPosition().SelfAdd(pos.Clone().SelfMul(-2)),
          );
        }
        if (this.options.properties.inverted) x *= -1;
        x > 0
          ? (leftAlpha = Math.min(leftAlpha, x))
          : (rightAlpha = Math.min(rightAlpha, -x));
      }
      if (leftAlpha < Infinity) {
        this.glowLeft.alpha = //
          this.other.glowLeft.alpha = Math.min(1, (2 - leftAlpha) / 2 + 0.3);
      }
      if (rightAlpha < Infinity) {
        this.glowRight.alpha = //
          this.other.glowRight.alpha = Math.min(1, (2 - rightAlpha) / 2 + 0.3);
      }
      if (this.sound) {
        this.sound.volume =
          0.3 + Math.max(this.glowRight.alpha, this.glowLeft.alpha);
      }
    } else if (
      null == this.transporting &&
      null == this.other.transporting &&
      null == this.receiving &&
      null == this.other.receiving &&
      (0 === this.state ||
        (0 === Object.keys(this.nearBodies).length &&
          0 === Object.keys(this.other.nearBodies).length))
    ) {
      this.glowRight.alpha =
        this.other.glowRight.alpha =
        this.glowLeft.alpha =
        this.other.glowLeft.alpha =
          0;
    }
    if (1 === this.state) {
      while (this.transporting.length > 0) {
        this.transport(this.transporting.shift()!);
      }
      this.other.receiving = true;
    }
    this.receiving = false;
  }

  destroy(destroyChildren?: boolean, soft?: boolean) {
    this.sound?.stopInstance();
    super.destroy(destroyChildren, soft);
  }

  // debugVector(a: box2d.b2Vec2, b: box2d.b2Vec2) {
  //   this.debugger.lineStyle(2, b, 1);
  //   this.debugger.moveTo(0, 0);
  //   this.debugger.lineTo(this.mpx(a.x), this.mpx(a.y));
  // }

  createFakeBlock(options: {
    center: box2d.b2Vec2;
    rotation: number;
    width: number;
    height: number;
  }) {
    const sprite = this.game.make.sprite(0, 0, "MechAssets", "_default0000");
    this.game.physics.box2d.enable(sprite);
    const body = sprite.body;
    body.clearFixtures();
    options.center.y -= 0.5 * Math.cos(this.options.rotation);
    options.center.x += 0.5 * Math.sin(this.options.rotation);
    const shape = new box2d.b2PolygonShape();
    shape.SetAsOrientedBox(
      options.width,
      options.height,
      options.center,
      options.rotation,
    );
    const fakeWallDef = new box2d.b2FixtureDef();
    fakeWallDef.shape = shape;
    this.fakeWallFixture = body.data.CreateFixture(fakeWallDef);
    body.mass = 0;
  }

  ocupy(tiles: Tile[][]) {
    const x = this.options.x / 32;
    const y = this.options.y / 32;
    this.ocupyTile(tiles, x, y + 2);
    this.ocupyTile(tiles, x - 1, y - 2);
    this.ocupyTile(tiles, x - 1, y + 2);
    this.ocupyTile(tiles, x, y - 2);
  }

  drawDarkMask(bitmapData: BitmapData & { offset: { x: number; y: number } }) {
    if (this.state !== 1) return;
    bitmapData.ctx.globalCompositeOperation = "lighter";
    const pos = {
      x: this.center.x + bitmapData.offset.x,
      y: this.center.y + bitmapData.offset.y,
    };
    const offset1 = new box2d.b2Vec2(0, 36).SelfRotateRadians(
      this.options.rotation,
    );
    const gradient1 = bitmapData.ctx.createRadialGradient(
      pos.x + offset1.x,
      pos.y + offset1.y,
      20,
      pos.x + offset1.x,
      pos.y + offset1.y,
      90,
    );
    gradient1.addColorStop(0, "rgba(255,255,255,1)");
    gradient1.addColorStop(0.5, "rgba(255,255,255,0.3)");
    gradient1.addColorStop(1, "transparent");
    bitmapData.circle(pos.x + offset1.x, pos.y + offset1.y, 90, gradient1);
    const offset2 = new box2d.b2Vec2(0, -36).SelfRotateRadians(
      this.options.rotation,
    );
    const gradient2 = bitmapData.ctx.createRadialGradient(
      pos.x + offset2.x,
      pos.y + offset2.y,
      20,
      pos.x + offset2.x,
      pos.y + offset2.y,
      90,
    );
    gradient2.addColorStop(0, "rgba(255,255,255,1)");
    gradient2.addColorStop(0.5, "rgba(255,255,255,0.3)");
    gradient2.addColorStop(1, "transparent");
    bitmapData.circle(pos.x + offset2.x, pos.y + offset2.y, 90, gradient2);
  }
}

export default Portal;
