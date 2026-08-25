/// <amd-module name="States/Level/Devices/MovingPlatform" />

import { BitmapData, Game, Group, Physics, Sound } from "@azerion/phaser";
import Device, { DeviceOptions } from "./Device";

type MovingPlatformOptions = {
  properties: {
    dx?: number;
    dy?: number;
    dtheta?: number;
    paddingX?: number;
    paddingY?: number;
    offsetX?: number;
    offsetY?: number;
  };
  rotation: number;
  padding?: { x: number; y: number };
} & DeviceOptions;

class MovingPlatform extends Device<MovingPlatformOptions> {
  readonly shapeRotation: number;
  readonly joint: box2d.b2RevoluteJoint | box2d.b2PrismaticJoint;
  readonly shapeSprite: Group;
  private sound?: Sound | null;
  declare body: Physics.Box2D.Body;

  constructor(game: Game, options: MovingPlatformOptions) {
    options.lightAtlas ??= "MechAssets";
    options.lightFrame ??= "moving_platform_light";
    options.properties ??= { group: 0, dx: 4, dy: 0 };

    let shapeRotation: number;
    if (options.width < options.height) {
      const tempHeight = options.width;
      options.width = options.height;
      options.height = tempHeight;
      options.x = options.x + options.height / 2;
      options.y = options.y + options.width / 2;
      shapeRotation = -Math.PI / 2;
    } else {
      options.x = options.x + options.width / 2;
      options.y = options.y + options.height / 2;
      shapeRotation = 0;
    }

    options.padding = {
      x:
        options.properties && options.properties.paddingX
          ? options.properties.paddingX
          : 0,
      y:
        options.properties && options.properties.paddingY
          ? options.properties.paddingY
          : 0.06,
    };

    super(game, options);

    this.drawDarkMask = this.drawDarkMask.bind(this);
    this.checkState = this.checkState.bind(this);
    this.updateState = this.updateState.bind(this);
    this.update = this.update.bind(this);
    this.sounds = this.sounds.bind(this);

    this.shapeRotation = shapeRotation;

    this.sprite = this.game.make.sprite(
      this.options.x,
      this.options.y,
      "MechAssets",
      "_default0000",
    );

    this.game.physics.box2d.enable(this.sprite);
    this.game.layers.underGround.addChild(this.sprite);
    this.body = this.sprite.body;
    this.body.clearFixtures();
    this.body.data.SetAngle(this.options.rotation);

    const shape = new box2d.b2PolygonShape();

    shape.SetAsOrientedBox(
      this.options.width / 2 - this.options.padding!.x,
      this.options.height / 2 - this.options.padding!.y,
      new box2d.b2Vec2(0, 0),
      this.shapeRotation,
    );
    const fixtureDef = new box2d.b2FixtureDef();
    fixtureDef.shape = shape;
    fixtureDef.friction = 0.7;
    fixtureDef.restitution = 0;
    fixtureDef.density = this.options.properties.dtheta ? 0.5 : 0;
    fixtureDef.userData = { reflection: true };
    fixtureDef.filter.categoryBits = 256;
    fixtureDef.filter.maskBits = 4369;
    const fixture = this.body.data.CreateFixture(fixtureDef);
    fixture.id = this.body.world.getNextFixtureId();
    if (this.options.properties.dtheta) {
      const jointDef = new box2d.b2RevoluteJointDef();
      const worldCenter = this.body.data.GetWorldCenter();
      const f = new box2d.b2Vec2(
        worldCenter.x - (this.options.properties.offsetX || 0),
        worldCenter.y - (this.options.properties.offsetY || 0),
      );
      jointDef.Initialize(this.body.data, this.game.level.groundBody, f);
      if (this.options.properties.dtheta > 0) {
        jointDef.lowerAngle = 0;
        jointDef.upperAngle = (Math.PI * this.options.properties.dtheta) / 180;
      } else {
        jointDef.lowerAngle = (Math.PI * this.options.properties.dtheta) / 180;
        jointDef.upperAngle = 0;
      }
      jointDef.enableLimit = true;
      jointDef.maxMotorTorque = 200;
      jointDef.enableMotor = true;
      this.joint = this.game.physics.box2d.world.CreateJoint(jointDef);
    } else {
      const axis = new box2d.b2Vec2(
        this.options.properties.dx,
        this.options.properties.dy,
      );
      const jointDef = new box2d.b2PrismaticJointDef();
      jointDef.Initialize(
        this.body.data,
        this.game.level.groundBody,
        this.body.data.GetWorldCenter(),
        axis,
      );
      jointDef.lowerTranslation = -axis.Length();
      jointDef.upperTranslation = 0;
      jointDef.enableLimit = true;
      jointDef.motorSpeed = 0.5;
      jointDef.maxMotorForce = 220;
      jointDef.enableMotor = true;
      this.joint = this.game.physics.box2d.world.CreateJoint(jointDef);
    }
    this.state = 0;

    this.registerDevice();
    this.shapeSprite = this.game.make.group(0, "0");
    const leftCap = this.game.make.sprite(0, 0, "MechAssets", "BarCapLeft0000");
    leftCap.anchor.set(0.5);
    this.shapeSprite.addChild(leftCap);
    leftCap.x = this.mpx(this.options.width / 2 - 0.5);
    leftCap.y = this.mpx(this.options.height / 2 - 0.5);
    const rightCap = this.game.make.sprite(
      0,
      0,
      "MechAssets",
      "BarCapRight0000",
    );
    rightCap.anchor.set(0.5);
    this.shapeSprite.addChild(rightCap);
    rightCap.x = -this.mpx(this.options.width / 2 - 0.5);
    rightCap.y = this.mpx(this.options.height / 2 - 0.5);
    const centre = this.game.make.sprite(0, 0, "MechAssets", "BarCenter0000");
    centre.anchor.set(0.5);
    this.shapeSprite.addChild(centre);
    centre.x = 0;
    centre.y = 0;
    centre.scale.x = (this.options.width - 2) / 3;
    this.lights[0]!.scale.x = (this.options.width - 1) / 3;
    this.shapeSprite.addChild(this.lights[0]!);
    this.shapeSprite.rotation = this.shapeRotation;
    this.sprite.addChild(this.shapeSprite);
    0 === this.shapeRotation
      ? ((this.sprite.scale.x = 1.05), (this.sprite.scale.y = 0.95))
      : ((this.sprite.scale.y = 1.05), (this.sprite.scale.x = 0.95));
  }

  sounds() {
    return "platform";
  }

  update() {
    if (this.joint instanceof box2d.b2RevoluteJoint) {
      if (this.joint.GetJointAngleRadians() < this.joint.GetLowerLimit()) {
        this.body.data.SetAngle(-this.joint.GetLowerLimit());
      }
      if (this.joint.GetJointAngleRadians() > this.joint.GetUpperLimit()) {
        this.body.data.SetAngle(-this.joint.GetUpperLimit());
      }
    }
    super.update();
  }

  updateState(mute: boolean) {
    const speed =
      this.joint instanceof box2d.b2RevoluteJoint &&
      this.options.properties.dtheta! > 0
        ? -2
        : 2;
    this.cacheAsBitmap = true;
    if (!this.state) {
      this.joint.SetMotorSpeed?.(speed);
      this.body.data.ApplyForce(new box2d.b2Vec2(1, 0), new box2d.b2Vec2(0, 0));
      if (this.sound) {
        this.sound.stopInstance();
        this.sound = null;
      }
      if (!mute) {
        this.sound = this.game.level.sounds.platform.playInstance();
        return this.sound;
      }
    } else {
      this.joint.SetMotorSpeed?.(-speed);
      this.body.data.ApplyForce(new box2d.b2Vec2(1, 0), new box2d.b2Vec2(0, 0));
      if (this.sound) {
        this.sound.stopInstance();
        this.sound = null;
      }
      if (!mute) {
        this.sound = this.game.level.sounds.platform.playInstance();
        return this.sound;
      }
    }
  }

  checkState() {
    const a = () =>
      this.joint instanceof box2d.b2PrismaticJoint
        ? this.joint.GetJointTranslation()
        : this.joint.GetJointAngleRadians!() *
          (this.options.properties.dtheta! > 0 ? -1 : 1);
    const b = () =>
      this.joint instanceof box2d.b2PrismaticJoint
        ? this.joint.m_lowerTranslation!
        : this.options.properties.dtheta! > 0
          ? -this.joint.GetUpperLimit!()
          : this.joint.GetLowerLimit!();
    const c = () =>
      this.joint instanceof box2d.b2PrismaticJoint
        ? this.joint.m_upperTranslation!
        : this.options.properties.dtheta! > 0
          ? -this.joint.GetLowerLimit!()
          : this.joint.GetUpperLimit!();
    if (this.sound && !this.state && a() >= c()) {
      this.sound.stopInstance();
      this.sound = null;
    } else if (this.sound && this.state && a() <= b()) {
      this.sound.stopInstance();
      this.sound = null;
    }
  }

  drawDarkMask(data: BitmapData & { offset: { x: number; y: number } }) {
    if (!this.state) return;
    data.ctx.globalCompositeOperation = "lighter";
    const pos = {
      x: this.sprite!.x + data.offset.x,
      y: this.sprite!.y + data.offset.y,
    };
    const b = new box2d.b2Vec2(36, 0).SelfRotateRadians(this.shapeRotation);
    const c = new box2d.b2Vec2(-36, 0).SelfRotateRadians(this.shapeRotation);
    const gradient = data.ctx.createRadialGradient(
      pos.x + b.x,
      pos.y + b.y,
      20,
      pos.x + b.x,
      pos.y + b.y,
      160,
    );
    gradient.addColorStop(0, "rgba(255,255,255,0.9)");
    gradient.addColorStop(0.5, "rgba(255,255,255,0.2)");
    gradient.addColorStop(1, "transparent");
    data.circle(pos.x + b.x, pos.y + b.y, 160, gradient);
    const gradient2 = data.ctx.createRadialGradient(
      pos.x + c.x,
      pos.y + c.y,
      20,
      pos.x + c.x,
      pos.y + c.y,
      160,
    );
    gradient2.addColorStop(0, "rgba(255,255,255,0.9)");
    gradient2.addColorStop(0.5, "rgba(255,255,255,0.2)");
    gradient2.addColorStop(1, "transparent");
    data.circle(pos.x + c.x, pos.y + c.y, 180, gradient2);
  }
}

export = MovingPlatform;
