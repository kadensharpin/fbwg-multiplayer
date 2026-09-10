import { BitmapData, Game, Physics, Sound, Sprite } from "phaser";
import * as box2d from "phaser-box2d";
import BoxedDevice from "./BoxedDevice";
import { type DeviceOptions, Light } from "./Device";

type RotMirrorOptions = {
  rotation: number;
  boxWidth: number;
  boxHeight: number;
  mirrorWidth: number;
  mirrorHeight: number;

  properties: { bringToBack: boolean; dir: number };
} & DeviceOptions;

class RotMirror extends BoxedDevice<RotMirrorOptions> {
  readonly base: Sprite;
  readonly joint: box2d.b2RevoluteJoint;
  private sound?: Sound | null;

  declare body: Physics.Box2D.Body;

  constructor(game: Game, options: RotMirrorOptions) {
    options.boxWidth ??= 1.8;
    options.boxHeight ??= 1.8;
    options.mirrorWidth ??= 2;
    options.mirrorHeight ??= 0.1;

    super(game, options);

    this.drawDarkMask = this.drawDarkMask.bind(this);
    this.checkState = this.checkState.bind(this);
    this.updateState = this.updateState.bind(this);
    this.update = this.update.bind(this);
    this.sounds = this.sounds.bind(this);

    this.base = this.game.make.sprite(
      this.options.x,
      this.options.y,
      "MechAssets",
      "rotmirror_circle0000",
    );
    this.base.anchor.set(0.5);
    this.game.layers.underGround.addChild(this.base);
    const mirror = this.game.make.sprite(
      this.options.x,
      this.options.y,
      "MechAssets",
      "rotmirror0000",
    );
    mirror.anchor.set(0.5);
    this.game.physics.box2d.enable(mirror);
    this.body = mirror.body;
    const light = this.game.make.sprite(
      0,
      0,
      "MechAssets",
      "rotmirror_light_off0000",
    ) as Light;
    light.anchor.set(0.5);
    mirror.addChild(light);
    light.offFrameName = "rotmirror_light_off0000";
    light.onFrameName = "rotmirror_light_on0000";
    this.lights.push(light);
    this.game.layers[
      this.options.properties.bringToBack ? "underGround" : "overGround"
    ].addChild(mirror);
    this.body.clearFixtures();
    const fixtureShape = new box2d.b2PolygonShape();
    fixtureShape.SetAsOrientedBox(
      this.options.boxWidth / 2,
      this.options.boxHeight / 2,
      new box2d.b2Vec2(0, 0),
      0,
    );
    const fixtureDef1 = new box2d.b2FixtureDef();
    fixtureDef1.shape = fixtureShape;
    fixtureDef1.friction = 0.7;
    fixtureDef1.restitution = 0;
    fixtureDef1.density = 1;
    fixtureDef1.userData = { lightProperties: { type: "transparent" } };
    const fixture1 = this.body.data.CreateFixture(fixtureDef1);
    fixture1.id = this.body.world.getNextFixtureId();
    const fixtureShape2 = new box2d.b2PolygonShape();
    fixtureShape2.SetAsOrientedBox(
      this.options.mirrorWidth / 2,
      this.options.mirrorHeight / 2,
      new box2d.b2Vec2(0, 0),
      Math.PI / 4,
    );
    const fixtureDef2 = new box2d.b2FixtureDef();
    fixtureDef2.shape = fixtureShape2;
    fixtureDef2.friction = 0.7;
    fixtureDef2.restitution = 0;
    fixtureDef2.density = 0.2;
    fixtureDef2.userData = { lightProperties: { type: "mirror" } };
    const fixture2 = this.body.data.CreateFixture(fixtureDef2);
    fixture2.id = this.body.world.getNextFixtureId();
    const fixtureShape3 = new box2d.b2CircleShape(0.25);
    fixtureShape3.m_p = new box2d.b2Vec2(
      this.options.boxWidth / 2 - 0.25,
      this.options.boxWidth / 2 - 0.25,
    );
    const fixtureDef3 = new box2d.b2FixtureDef();
    fixtureDef3.shape = fixtureShape3;
    this.body.data.CreateFixture(fixtureDef3);
    new box2d.b2CircleShape(0.25);
    fixtureShape3.m_p = new box2d.b2Vec2(
      -this.options.boxWidth / 2 + 0.25,
      -this.options.boxWidth / 2 + 0.25,
    );
    new box2d.b2FixtureDef();
    fixtureDef1.shape = fixtureShape3;
    this.body.data.CreateFixture(fixtureDef1);
    const jointDef = new box2d.b2RevoluteJointDef();
    const centre = this.body.data.GetWorldCenter();
    const jointPos = new box2d.b2Vec2(centre.x, centre.y);
    jointDef.Initialize(this.body.data, this.game.level.groundBody, jointPos);
    while (this.options.rotation < 0) this.options.rotation += 2 * Math.PI;
    1 === this.options.properties.dir
      ? ((jointDef.lowerAngle = -this.options.rotation),
        (jointDef.upperAngle = -this.options.rotation + Math.PI / 2))
      : ((jointDef.lowerAngle = -this.options.rotation - Math.PI / 2),
        (jointDef.upperAngle = -this.options.rotation));
    jointDef.enableLimit = true;
    jointDef.maxMotorTorque = 100;
    jointDef.enableMotor = true;
    this.joint = this.game.physics.box2d.world.CreateJoint(jointDef);
    1 === this.options.properties.dir
      ? this.body.data.SetAngle(-this.joint.GetLowerLimit())
      : this.body.data.SetAngle(-this.joint.GetUpperLimit());
    this.registerDevice();
  }

  sounds() {
    return ["platform"];
  }

  update() {
    if (this.joint.GetJointAngleRadians() < this.joint.GetLowerLimit())
      this.body.data.SetAngle(-this.joint.GetLowerLimit());
    if (this.joint.GetJointAngleRadians() > this.joint.GetUpperLimit())
      this.body.data.SetAngle(-this.joint.GetUpperLimit());
    super.update();
  }

  updateState(mute: boolean) {
    if (0 === this.state) {
      this.joint.SetMotorSpeed(-1.5 * this.options.properties.dir);
      this.sound?.stopInstance();
      if (!mute) {
        this.sound = this.game.level.sounds.platform.playInstance();
      }
    } else {
      this.joint.SetMotorSpeed(1.5 * this.options.properties.dir);
      this.sound?.stopInstance();
      if (!mute) {
        this.sound = this.game.level.sounds.platform.playInstance();
      }
    }
  }

  checkState() {
    const a = () =>
      this.options.properties.dir > 0
        ? -this.joint.GetJointAngleRadians()
        : this.joint.GetJointAngleRadians();
    const b = () =>
      this.options.properties.dir > 0
        ? -this.joint.GetUpperLimit()
        : this.joint.GetLowerLimit();
    const c = () =>
      this.options.properties.dir > 0
        ? -this.joint.GetLowerLimit()
        : this.joint.GetUpperLimit();
    if (null != this.sound && 0 === this.state && a() >= c()) {
      this.game.level.sounds.platform.stopInstance();
      this.sound = null;
    } else {
      if (null != this.sound && 1 === this.state && a() <= b()) {
        this.game.level.sounds.platform.stopInstance();
        this.sound = null;
      }
    }
  }

  drawDarkMask(bitmap: BitmapData & { offset: { x: number; y: number } }) {
    if (1 !== this.state) {
      return;
    }
    const pos = {
      x: this.base.x + bitmap.offset.x,
      y: this.base.y + bitmap.offset.y,
    };
    bitmap.ctx.globalCompositeOperation = "lighter";
    const gradient = bitmap.ctx.createRadialGradient(
      pos.x,
      pos.y,
      20,
      pos.x,
      pos.y,
      160,
    );
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.5, "rgba(255,255,255,0.3)");
    gradient.addColorStop(1, "transparent");
    bitmap.circle(pos.x, pos.y, 160, gradient);
  }
}

export default RotMirror;
