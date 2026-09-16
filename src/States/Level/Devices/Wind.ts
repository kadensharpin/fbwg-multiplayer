import {
  Animation,
  BitmapData,
  Game,
  Physics,
  Sound,
  Sprite,
  Tile,
} from "phaser";
import * as box2d from "phaser-box2d";
import Character from "../character";
import BoxedDevice, { BoxedDeviceOptions } from "./BoxedDevice";

type WindOptions = {
  boxWidth: number;
  boxHeight: number;
  windWidth: number;
  windHeight: number;
  rotation: number;

  properties: {
    windWidth: number;
    length: number;

    invertInput: boolean;
    flat: boolean;
  };
} & BoxedDeviceOptions;

class Wind extends BoxedDevice<WindOptions> {
  readonly windSensor: box2d.b2Fixture;
  readonly windEffect: Sprite;
  readonly activeBodies: Record<
    number,
    { body: Physics.Box2D.Body & { sprite: { character: Character } } }
  >;
  private running: boolean = false;
  private sound?: Sound | null;

  declare sprite: Sprite;
  declare body: Physics.Box2D.Body;

  constructor(game: Game, options: WindOptions) {
    options.rotation ||= 0;
    options.rotation += 90;
    options.boxWidth ??= 2.5;
    options.boxHeight ??= 0.6;
    options.windWidth ??= 2.6;
    options.windHeight ??= 10;
    options.atlasName ??= "MechAssets";
    options.frameName ??= "wind_base0000";
    options.lightAtlas ??= "MechAssets";
    options.lightFrame ??= "wind_base_light";
    options.layer ??= "liquids";
    options.boxSize = { width: -3, height: 2 };

    super(game, options);

    this.drawDarkMask = this.drawDarkMask.bind(this);
    this.ocupy = this.ocupy.bind(this);
    this.updateState = this.updateState.bind(this);
    this.update = this.update.bind(this);
    this.destroy = this.destroy.bind(this);

    this.sprite.anchor.set(0.5);
    const shape1 = new box2d.b2PolygonShape();
    if (this.options.properties.flat) {
      shape1.SetAsOrientedBox(
        this.options.boxWidth / 2,
        this.options.boxHeight / 2,
        new box2d.b2Vec2(0, 0.3),
        0,
      );
    } else {
      const vertices = [];
      vertices.push(new box2d.b2Vec2(-this.options.boxWidth / 2 - 0.6, 0));
      vertices.push(new box2d.b2Vec2(this.options.boxWidth / 2 + 0.6, 0));
      vertices.push(
        new box2d.b2Vec2(this.options.boxWidth / 2, this.options.boxHeight),
      );
      vertices.push(
        new box2d.b2Vec2(-this.options.boxWidth / 2, this.options.boxHeight),
      );
      shape1.Set(vertices);
    }
    const fixtureDef1 = new box2d.b2FixtureDef();
    fixtureDef1.shape = shape1;
    fixtureDef1.friction = 0.4;
    fixtureDef1.restitution = 0;
    fixtureDef1.density = 0.2;
    const offset = new box2d.b2Vec2(0, 0).SelfRotateRadians(
      this.options.rotation || 0,
    );
    const fixture1 = this.body.data.CreateFixture(fixtureDef1);
    fixture1.id = this.body.world.getNextFixtureId();
    this.body.mass = 0;
    const width = this.options.properties.windWidth ?? this.options.windWidth;
    const shape2 = new box2d.b2PolygonShape();
    shape2.SetAsOrientedBox(
      width / 2,
      this.options.properties.length / 2,
      new box2d.b2Vec2(0, this.options.properties.length / 2 + 0.5),
      0,
    );
    const windSensorDef = new box2d.b2FixtureDef();
    windSensorDef.shape = shape2;
    windSensorDef.isSensor = true;
    windSensorDef.userData = { lightProperties: { type: "transparent" } };
    this.windSensor = this.body.data.CreateFixture(windSensorDef);
    this.windSensor.id = this.body.world.getNextFixtureId();
    this.body.mass = 0;
    this.activeBodies = {};
    this.body.setFixtureContactCallback(
      this.windSensor,
      (
        _body1: Physics.Box2D.Body,
        body2: Physics.Box2D.Body & { sprite: { character?: Character } },
        _fixture1: box2d.b2Fixture,
        _fixture2: box2d.b2Fixture,
        begin: boolean,
      ) => {
        if (null == body2.sprite.character) return;
        if (begin && null == this.activeBodies[body2.id]) {
          this.activeBodies[body2.id] = {
            body: body2 as (typeof this.activeBodies)[number]["body"],
          };
        } else if (!begin && null != this.activeBodies[body2.id]) {
          delete this.activeBodies[body2.id];
        }
      },
      this,
    );
    this.sprite.animations.add(
      "loop",
      Animation.generateFrameNames("wind_base", 0, 4, "", 4),
      30,
      true,
    );
    this.windEffect = this.game.make.sprite(
      this.options.x - game.physics.box2d.mpx(offset.x),
      this.options.y - game.physics.box2d.mpx(offset.y),
      "MechAssets",
    );
    this.windEffect.anchor.y = 1;
    this.windEffect.anchor.x = 0.5;
    this.windEffect.animations.add(
      "loop",
      Animation.generateFrameNames("wind_effect", 0, 30, "", 4),
      30,
      true,
    );
    this.windEffect.animations.play("loop");
    this.windEffect.animations.next(Math.floor(30 * Math.random()));
    this.windEffect.height = game.physics.box2d.mpx(
      this.options.properties.length,
    );
    this.windEffect.rotation = this.options.rotation || 0;
    this.windEffect.visible = false;
    this.game.layers.overChars.addChild(this.windEffect);
    this.registerDevice();
  }

  static sounds() {
    return "wind";
  }

  destroy(destroyChildren?: boolean, soft?: boolean) {
    this.sound?.stopInstance();
    super.destroy(destroyChildren, soft);
  }

  update() {
    const state = this.getState();
    if (1 !== state) return;
    for (const { body } of Object.values(this.activeBodies)) {
      const force = new box2d.b2Vec2(0, 1).SelfRotateRadians(
        this.options.rotation || 0,
      );
      const pos = body.data.GetPosition().SelfSub(this.body.data.GetPosition());
      force
        .SelfMul(1.2 + 0.2 * Math.sin(this.game.time.now / 1e3))
        .SelfMul(100)
        .SelfMul(1 - pos.GetLength() / this.options.properties.length);
      body.data.ApplyForce(force, new box2d.b2Vec2(0, 0));
      body.data.SetLinearVelocity(body.data.GetLinearVelocity().SelfMul(0.975));
      const velocity = body.data.GetLinearVelocity().GetLength();
      body.data.SetLinearVelocity(
        body.data
          .GetLinearVelocity()
          .SelfNormalize()
          .SelfMul(Math.min(velocity, 15)),
      );
    }
  }

  updateState(_mute: boolean) {
    this.running ||= false;
    const state = this.getState();
    if (state === 1 && this.windEffect.visible === false) {
      this.windEffect.visible = true;
      this.sprite.animations.play("loop");
      this.running = true;
      this.game.level.sounds.wind.loop = true;
      this.sound = this.game.level.sounds.wind.playInstance();
      this.sound!.volume = 0.2;
    } else if (state === 0 && this.windEffect.visible === true) {
      this.windEffect.visible = false;
      this.sound?.stopInstance();
      this.sound = null;
      setTimeout(() => {
        this.sprite.animations.stop();
        this.sprite.frameName = "wind_base0000";
      }, 400);
    }
  }

  ocupy(tiles: Tile[][]) {
    const x = this.options.x / 32;
    const y = this.options.y / 32;
    this.ocupyTile(tiles, x - 1, y);
    this.ocupyTile(tiles, x - 1, y - 1);
    this.ocupyTile(tiles, x, y);
    this.ocupyTile(tiles, x, y - 1);
    this.ocupyTile(tiles, x - 2, y);
    this.ocupyTile(tiles, x - 2, y - 1);
  }

  drawDarkMask(bitmapData: BitmapData & { offset: { x: number; y: number } }) {
    if (this.state !== 1) return;
    bitmapData.ctx.globalCompositeOperation = "lighter";
    const pos = {
      x: this.sprite.x + bitmapData.offset.x,
      y: this.sprite.y + bitmapData.offset.y,
    };
    const offset1 = new box2d.b2Vec2(36, 0).SelfRotateRadians(
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
    const offset2 = new box2d.b2Vec2(-36, 0).SelfRotateRadians(
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

  private getState(): 0 | 1 {
    return (this.options.properties.invertInput ? +!this.state : this.state) as
      | 0
      | 1;
  }
}

export default Wind;
