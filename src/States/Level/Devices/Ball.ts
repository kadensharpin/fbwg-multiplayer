/// <amd-module name="States/Level/Devices/Ball" />

import { Game, Physics } from "@azerion/phaser";
import { deepObjectExtend } from "../../../utils/util";
import BoxedDevice from "./BoxedDevice";
import { type DeviceOptions } from "./Device";

type BallOptions = {
  properties?: {
    linearDamping?: number;
    angularDamping?: number;
  };
} & DeviceOptions;

class Ball extends BoxedDevice<BallOptions> {
  radius = 0.4;
  declare body: Physics.Box2D.Body;

  constructor(game: Game, options: BallOptions) {
    options.x -= game.physics.box2d.mpx(0.5);
    options.y += game.physics.box2d.mpx(0.65);

    deepObjectExtend(options, {
      boxWidth: 1.8,
      boxHeight: 1.8,
      atlasName: "MechAssets",
      frameName: "ball0000",
    });

    super(game, options);

    const shape = new box2d.b2CircleShape(this.radius);
    const fixtureDef = new box2d.b2FixtureDef();
    fixtureDef.shape = shape;
    fixtureDef.friction = 0.2;
    fixtureDef.restitution = 0.1;
    fixtureDef.density = 2.3;
    fixtureDef.filter.categoryBits = 17;
    const fixture = this.body.data.CreateFixture(fixtureDef);
    fixture.id = this.body.world.getNextFixtureId();

    if (null != this.options.properties?.linearDamping)
      this.body.data.SetLinearDamping(this.options.properties.linearDamping);

    if (null != this.options.properties?.angularDamping)
      this.body.data.SetAngularDamping(this.options.properties.angularDamping);

    const d = new box2d.b2CircleShape(0.1);
    d.m_p.SetXY(0, 0);
    const fixtureDef2 = new box2d.b2FixtureDef();
    fixtureDef2.shape = d;
    fixtureDef2.filter.categoryBits = 4096;
    fixtureDef2.filter.maskBits = 4096;
    fixtureDef2.friction = 0.5;
    fixtureDef2.density = 0;
    fixtureDef2.userData = { "portal-sensor": true };
    const fixture2 = this.body.data.CreateFixture(fixtureDef2);
    fixture2.id = this.body.world.getNextFixtureId();
  }
}

export = Ball;
