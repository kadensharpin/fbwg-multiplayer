import Body from "@/utils/box2d/Body";
import box2d from "@box2d/core";
import { Game } from "phaser";
import BoxedDevice from "./BoxedDevice";
import { Light, type DeviceOptions } from "./Device";

type InfiniteMirrorOptions = {
  rotation: number;
  boxWidth: number;
  boxHeight: number;
  mirrorWidth: number;
  mirrorHeight: number;
} & DeviceOptions;

class InfiniteMirror extends BoxedDevice<InfiniteMirrorOptions> {
  declare body: Body;
  joint: box2d.b2RevoluteJoint;

  constructor(game: Game, options: InfiniteMirrorOptions) {
    options.boxWidth ??= 1.8;
    options.boxHeight ??= 1.8;
    options.mirrorWidth ??= 3;
    options.mirrorHeight ??= 0.1;

    super(game, options);

    this.updateState = this.updateState.bind(this);

    const circle = this.game.make.sprite(
      this.options.x,
      this.options.y,
      "MechAssets",
      "rotmirror_circle0000",
    );
    circle.anchor.set(0.5);
    this.game.layers.underGround.addChild(circle);
    const mirror = this.game.make.sprite(
      this.options.x,
      this.options.y,
      "MechAssets",
      "infinitemirror0000",
    );
    mirror.anchor.set(0.5);
    this.game.physics.box2d.enable(mirror);
    this.body = mirror.body;
    const light = this.game.make.sprite(
      0,
      0,
      "MechAssets",
      "infinitemirror_light_off0000",
    ) as Light;
    light.anchor.set(0.5);
    mirror.addChild(light);
    light.offFrameName = "infinitemirror_light_off0000";
    light.onFrameName = "infinitemirror_light_off0000";
    this.lights.push(light);
    this.game.layers.overGround.addChild(mirror);
    this.body.clearFixtures();
    const shape = new box2d.b2PolygonShape();
    shape.SetAsBox(
      this.options.boxWidth / 2,
      this.options.boxHeight / 2,
      new box2d.b2Vec2(0, 0),
      0,
    );
    const m = new box2d.b2PolygonShape();
    m.SetAsBox(
      this.options.mirrorWidth / 2,
      this.options.mirrorHeight / 2,
      new box2d.b2Vec2(0, 0),
      Math.PI / 4,
    );
    const fixtureDef1 = {} as box2d.b2FixtureDef;
    fixtureDef1.shape = m;
    fixtureDef1.friction = 0.7;
    fixtureDef1.restitution = 0;
    fixtureDef1.density = 0.2;
    fixtureDef1.userData = { lightProperties: { type: "mirror" } };
    const fixture1 = this.body.data.CreateFixture(fixtureDef1);
    fixture1.id = this.body.world.getNextFixtureId();
    this.body.data.SetAngle(this.options.rotation);
    const shape2 = new box2d.b2CircleShape(0.3);
    shape2.Set(new box2d.b2Vec2(1.1, 1.1));
    const fixtureDef2 = {} as box2d.b2FixtureDef;
    fixtureDef2.shape = shape2;
    this.body.data.CreateFixture(fixtureDef2);
    const shape3 = new box2d.b2CircleShape(0.3);
    shape3.Set(new box2d.b2Vec2(-1.1, -1.1));
    const fixtureDef3 = {} as box2d.b2FixtureDef;
    fixtureDef3.shape = shape3;
    this.body.data.CreateFixture(fixtureDef3);
    const jointDef = new box2d.b2RevoluteJointDef();
    const bodyCentre = this.body.data.GetWorldCenter();
    jointDef.Initialize(
      this.body.data,
      this.game.level.groundBody!,
      bodyCentre.Clone(),
    );
    jointDef.enableLimit = true;
    jointDef.maxMotorTorque = 500;
    jointDef.motorSpeed = 0;
    jointDef.enableMotor = true;
    this.joint = this.game.physics.box2d.world.CreateJoint(jointDef);
    this.registerDevice();
  }

  updateState(_mute: boolean) {
    return this.joint.SetLimits(this.state, this.state);
  }
}

export default InfiniteMirror;
