import Body from "@/utils/box2d/Body";
import box2d from "@box2d/core";
import { BitmapData, Game, Signal, Sprite } from "phaser";
import BoxedDevice from "./BoxedDevice";
import { DeviceOptions, Light } from "./Device";

type LeverOptions = {
  properties: {
    startPos: number;
    onis: number;
  };
} & DeviceOptions;

class Lever extends BoxedDevice<LeverOptions> {
  readonly base: Sprite;
  joint: box2d.b2RevoluteJoint;
  signal: Signal;
  declare body: Body;

  constructor(game: Game, options: LeverOptions) {
    super(game, options);

    this.drawDarkMask = this.drawDarkMask.bind(this);
    this.checkState = this.checkState.bind(this);

    const stick = this.game.make.sprite(
      this.options.x,
      this.options.y,
      "MechAssets",
      "lever_stick0000",
    );
    stick.anchor.set(0.5);
    this.game.physics.box2d.enable(stick);
    this.body = stick.body;
    const light = this.game.make.sprite(
      0,
      0,
      "MechAssets",
      "lever_stick_light_off0000",
    ) as Light;
    light.anchor.set(0.5);
    stick.addChild(light);
    light.offFrameName = "lever_stick_light_off0000";
    light.onFrameName = "lever_stick_light_on0000";
    this.lights.push(light);
    this.game.layers.overGround.addChild(stick);
    this.base = this.game.make.sprite(
      this.options.x,
      this.options.y,
      "MechAssets",
      "lever_base0000",
    );
    this.base.anchor.set(0.5);
    const lightOff = this.game.make.sprite(
      0,
      0,
      "MechAssets",
      "lever_base_light_off0000",
    ) as Light;
    lightOff.anchor.set(0.5);
    this.base.addChild(lightOff);
    lightOff.offFrameName = "lever_base_light_off0000";
    lightOff.onFrameName = "lever_base_light_on0000";
    this.lights.push(lightOff);
    this.game.layers.overGround.addChild(this.base);
    this.body.clearFixtures();
    const shape = new box2d.b2PolygonShape();
    shape.SetAsBox(0.15, 0.7, new box2d.b2Vec2(0, 0.55), 0);
    const fixtureDef = {} as box2d.b2FixtureDef;
    fixtureDef.shape = shape;
    fixtureDef.friction = 0.7;
    fixtureDef.restitution = 0;
    fixtureDef.density = 1.6;
    fixtureDef.filter = { categoryBits: 1, maskBits: 61695 };
    const fixture = stick.body.data.CreateFixture(fixtureDef);
    fixture.id = stick.body.world.getNextFixtureId();
    const joint = new box2d.b2RevoluteJointDef();
    const centre = this.body.data.GetWorldCenter();
    const centreAtBase = new box2d.b2Vec2(centre.x, centre.y - 0.7);
    joint.Initialize(this.body.data, this.game.level.groundBody!, centreAtBase);
    joint.lowerAngle = -0.2 * Math.PI;
    joint.upperAngle = 0.2 * Math.PI;
    joint.enableLimit = true;
    joint.maxMotorTorque = 10;
    joint.motorSpeed = 0;
    joint.enableMotor = true;
    this.joint = this.game.physics.box2d.world.CreateJoint(joint);
    if (this.options.properties?.startPos === -1) {
      this.body.data.SetAngle(this.joint.GetLowerLimit());
    } else {
      this.body.data.SetAngle(this.joint.GetUpperLimit());
    }
    this.signal = new Signal();
    this.registerDevice();
  }

  static sounds() {
    return "lever";
  }

  checkState() {
    if (
      !this.state &&
      this.joint.GetJointAngle() * this.options.properties.onis < 0
    ) {
      this.state = 1;
    } else if (
      this.state &&
      this.joint.GetJointAngle() * this.options.properties.onis > 0
    ) {
      this.state = 0;
    } else {
      return;
    }
    this.joint.SetMotorSpeed(
      4 * this.options.properties.onis * (this.state ? -1 : 1),
    );
    this.game.level.sounds?.lever?.play();
    this.signal.dispatch(this);
  }

  drawDarkMask(data: BitmapData & { offset: { x: number; y: number } }) {
    if (!this.state) return;
    data.ctx.globalCompositeOperation = "lighter";
    const pos = {
      x: this.base.x + data.offset.x,
      y: this.base.y + data.offset.y,
    };
    const radius = new box2d.b2Vec2(0, this.mpx(-1.1));
    radius.Rotate(this.joint.GetJointAngle());
    radius.Add(new box2d.b2Vec2(0, this.mpx(1.8)));
    const gradient = data.ctx.createRadialGradient(
      pos.x + radius.x,
      pos.y + radius.y,
      10,
      pos.x + radius.x,
      pos.y + radius.y,
      50,
    );
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.7, "rgba(255,255,255,0.1)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    data.circle(pos.x + radius.x, pos.y + radius.y, 60, gradient);
  }
}

export default Lever;
