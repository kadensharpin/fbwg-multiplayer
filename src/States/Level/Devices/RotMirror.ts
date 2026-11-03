import Body from "@/utils/box2d/Body";
import { FixtureData } from "@/utils/Fixture";
import box2d from "@box2d/core";
import { BitmapData, Game, Sound, Sprite } from "phaser";
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

  declare body: Body;

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
    fixtureShape.SetAsBox(
      this.options.boxWidth / 2,
      this.options.boxHeight / 2,
      new box2d.b2Vec2(0, 0),
      0,
    );
    const fixture1 = this.body.data.CreateFixture({
      shape: fixtureShape,
      friction: 0.7,
      restitution: 0,
      density: 1,
      userData: FixtureData.builder().withTransparentLight().build(),
    });
    fixture1.id = this.body.world.getNextFixtureId();
    const fixtureShape2 = new box2d.b2PolygonShape();
    fixtureShape2.SetAsBox(
      this.options.mirrorWidth / 2,
      this.options.mirrorHeight / 2,
      new box2d.b2Vec2(0, 0),
      Math.PI / 4,
    );
    const fixture2 = this.body.data.CreateFixture({
      shape: fixtureShape2,
      friction: 0.7,
      restitution: 0,
      density: 0.2,
      userData: FixtureData.builder().withNormalLight(false, true).build(),
    });
    fixture2.id = this.body.world.getNextFixtureId();
    const fixtureShape3 = new box2d.b2CircleShape(0.25);
    fixtureShape3.Set(
      new box2d.b2Vec2(
        this.options.boxWidth / 2 - 0.25,
        this.options.boxWidth / 2 - 0.25,
      ),
    );
    this.body.data.CreateFixture({ shape: fixtureShape3 });
    new box2d.b2CircleShape(0.25);
    fixtureShape3.Set(
      new box2d.b2Vec2(
        -this.options.boxWidth / 2 + 0.25,
        -this.options.boxWidth / 2 + 0.25,
      ),
    );
    this.body.data.CreateFixture({
      shape: fixtureShape3,
      friction: 0.7,
      restitution: 0,
      density: 1,
      userData: FixtureData.builder().withTransparentLight().build(),
    });
    const jointDef = new box2d.b2RevoluteJointDef();
    const centre = this.body.data.GetWorldCenter();
    const jointPos = new box2d.b2Vec2(centre.x, centre.y);
    jointDef.Initialize(this.body.data, this.game.level.groundBody!, jointPos);
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

  static sounds() {
    return ["platform"];
  }

  update() {
    if (this.joint.GetJointAngle() < this.joint.GetLowerLimit())
      this.body.data.SetAngle(-this.joint.GetLowerLimit());
    if (this.joint.GetJointAngle() > this.joint.GetUpperLimit())
      this.body.data.SetAngle(-this.joint.GetUpperLimit());
    super.update();
  }

  updateState(mute: boolean) {
    if (0 === this.state) {
      this.joint.SetMotorSpeed(-1.5 * this.options.properties.dir);
      this.sound?.stopInstance();
      if (!mute) {
        this.sound = this.game.level.sounds?.platform?.playInstance();
      }
    } else {
      this.joint.SetMotorSpeed(1.5 * this.options.properties.dir);
      this.sound?.stopInstance();
      if (!mute) {
        this.sound = this.game.level.sounds?.platform?.playInstance();
      }
    }
  }

  checkState() {
    const a = () =>
      this.options.properties.dir > 0
        ? -this.joint.GetJointAngle()
        : this.joint.GetJointAngle();
    const b = () =>
      this.options.properties.dir > 0
        ? -this.joint.GetUpperLimit()
        : this.joint.GetLowerLimit();
    const c = () =>
      this.options.properties.dir > 0
        ? -this.joint.GetLowerLimit()
        : this.joint.GetUpperLimit();
    if (null != this.sound && 0 === this.state && a() >= c()) {
      this.game.level.sounds?.platform?.stopInstance();
      this.sound = null;
    } else {
      if (null != this.sound && 1 === this.state && a() <= b()) {
        this.game.level.sounds?.platform?.stopInstance();
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
