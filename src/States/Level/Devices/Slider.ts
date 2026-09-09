import { Game, Signal, Sound } from "phaser";
import Device, { DeviceOptions, Light } from "./Device";

type SliderOptions = {
  polyline: [[number, number], [number, number]];

  properties: {
    max: number;
  };
} & DeviceOptions;

class Slider extends Device<SliderOptions> {
  readonly _width: number;
  readonly joint: any;
  readonly signal: Signal;
  private sound?: Sound;

  constructor(game: Game, options: SliderOptions) {
    options.properties.group ??= 0;

    super(game, options);

    this.checkState = this.checkState.bind(this);
    this.sounds = this.sounds.bind(this);

    const o = this.game.physics.box2d.mpx(1);
    const p = -this.game.physics.box2d.mpx(1);
    this._width = this.options.polyline[1][0] - this.options.polyline[0][0];
    const pos = { x: this.options.x + this._width / 2, y: this.options.y };
    const sprite = this.game.make.sprite(
      pos.x,
      pos.y,
      "MechAssets",
      "_default0000",
    );
    this.game.physics.box2d.enable(sprite);
    const sliderDot = this.game.make.sprite(
      0,
      0,
      "MechAssets",
      "SliderDot0000",
    );
    sliderDot.anchor.set(0.5);
    sprite.addChild(sliderDot);
    const lightOff = this.game.make.sprite(
      0,
      0,
      "MechAssets",
      "slider_light_off0000",
    ) as Light;
    lightOff.anchor.set(0.5);
    sprite.addChild(lightOff);
    this.game.layers.overChars.addChild(sprite);
    this.lights.push(lightOff);
    const sliderTrack = this.game.make.sprite(
      pos.x,
      pos.y,
      "MechAssets",
      "SliderTrack0000",
    );
    sliderTrack.anchor.set(0.5);
    sliderTrack.width = this._width;
    this.game.layers.underGround.addChild(sliderTrack);
    sprite.body.clearFixtures();
    const circle = new box2d.b2CircleShape(0.3);
    circle.m_p.SetXY(0, 0);
    const fixtureDef = new box2d.b2FixtureDef();
    fixtureDef.shape = circle;
    fixtureDef.friction = 0;
    sprite.body.data.CreateFixture(fixtureDef);
    const axis = new box2d.b2Vec2(-1, 0);
    const jointDef = new box2d.b2PrismaticJointDef();
    jointDef.Initialize(
      sprite.body.data,
      this.game.level.groundBody,
      sprite.body.data.GetWorldCenter(),
      axis,
    );
    jointDef.upperTranslation = -this.pxm(this._width / 2);
    jointDef.lowerTranslation = this.pxm(this._width / 2);
    jointDef.enableLimit = true;
    jointDef.motorSpeed = 0;
    jointDef.maxMotorForce = 20;
    jointDef.enableMotor = true;
    this.joint = this.game.physics.box2d.world.CreateJoint(jointDef);
    sprite.body.data.SetLinearDamping(1);
    this.signal = new Signal();
    this.registerDevice();
  }

  sounds() {
    return "slider";
  }

  checkState() {
    if (this.joint.GetJointTranslation() === this.state) return;

    if (!this.sound || !this.sound.isPlaying) {
      this.sound = this.game.level.sounds.slider.play();
    }
    this.state =
      (Math.PI *
        this.joint.GetJointTranslation() *
        (this.options.properties.max || 1)) /
      this.pxm(-this._width);
    this.signal.dispatch(this);
  }
}

export default Slider;
