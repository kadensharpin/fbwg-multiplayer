/// <amd-module name="States/Level/Devices/Pusher" />

import { Game, Signal, Sprite, Tile } from "@azerion/phaser";
import BoxedDevice from "./BoxedDevice";
import type { DeviceOptions, Light } from "./Device";

export type PusherOptions = {
  pusherWidth?: number;
  pusherHeight?: number;
} & DeviceOptions;

class Pusher<Options extends PusherOptions> extends BoxedDevice<Options> {
  readonly button: Sprite;
  readonly signal: Signal;
  readonly base: Sprite;
  readonly joint: box2d.b2PrismaticJoint;

  constructor(game: Game, options: Options) {
    options.pusherWidth ??= 1;
    options.pusherHeight ??= 0.6;

    super(game, options);

    this.ocupy = this.ocupy.bind(this);
    this.checkState = this.checkState.bind(this);
    this.doRegister = this.doRegister.bind(this);
    this.sounds = this.sounds.bind(this);

    const button = this.game.make.sprite(
      this.options.x,
      this.options.y,
      "MechAssets",
      "_default0000",
    );
    this.game.physics.box2d.enable(button);
    const block = this.game.make.sprite(0, 0, "MechAssets", "pusher_block0000");
    block.anchor.set(0.5);
    button.addChild(block);
    const lightBlock = this.game.make.sprite(
      0,
      0,
      "MechAssets",
      "pusher_block_light0000",
    ) as Light;
    lightBlock.anchor.set(0.5);
    button.addChild(lightBlock);
    this.button = button;
    this.game.layers.underGround.addChild(button);
    this.base = this.game.make.sprite(
      this.options.x,
      this.options.y + this.mpx(0.5),
      "MechAssets",
      "_default0000",
    );
    this.game.layers.overGround.addChild(this.base);
    this.lights.push(lightBlock);
    button.body.clearFixtures();
    button.body.data.SetAngle((Math.PI * (options.rotation || 0)) / 180);
    const vertices = [];
    vertices.push(new box2d.b2Vec2(-this.options.pusherWidth! / 2 - 0.5, 0));
    vertices.push(new box2d.b2Vec2(this.options.pusherWidth! / 2 + 0.5, 0));
    vertices.push(
      new box2d.b2Vec2(
        this.options.pusherWidth! / 2,
        this.options.pusherHeight,
      ),
    );
    vertices.push(
      new box2d.b2Vec2(
        -this.options.pusherWidth! / 2,
        this.options.pusherHeight,
      ),
    );
    const shape = new box2d.b2PolygonShape();
    shape.Set(vertices);
    const fixtureDef = new box2d.b2FixtureDef();
    fixtureDef.shape = shape;
    fixtureDef.friction = 0.7;
    fixtureDef.restitution = 0;
    fixtureDef.density = 0.1;
    fixtureDef.userData = "pusher";
    fixtureDef.filter.categoryBits = 1;
    fixtureDef.filter.maskBits = 61695;
    const m = button.body.data.CreateFixture(fixtureDef);
    m.id = button.body.world.getNextFixtureId();
    const jointDef = new box2d.b2PrismaticJointDef();
    jointDef.Initialize(
      button.body.data,
      this.game.level.groundBody,
      button.body.data.GetWorldCenter(),
      new box2d.b2Vec2(0, 1),
    );
    jointDef.upperTranslation = 0.7;
    jointDef.lowerTranslation = 0;
    jointDef.enableLimit = true;
    jointDef.motorSpeed = -15;
    jointDef.maxMotorForce = 5;
    jointDef.enableMotor = true;
    this.joint = this.game.physics.box2d.world.CreateJoint(jointDef);
    this.signal = new Signal();
    this.doRegister();
  }

  sounds(): string | string[] {
    return "pusher";
  }

  doRegister() {
    return this.registerDevice();
  }

  checkState() {
    if (!this.state && this.joint.GetJointTranslation!() > 0.2) {
      this.state = 1;
    } else if (this.state && this.joint.GetJointTranslation!() <= 0.2) {
      this.state = 0;
    } else {
      return;
    }
    this.game.level.sounds.pusher.play();
    this.signal.dispatch(this);
  }

  ocupy(tiles: Tile[][]) {}
}

// @ts-ignore
export = Pusher;
