import Body from "@/utils/box2d/Body";
import { FixtureData } from "@/utils/Fixture";
import { deepObjectExtend } from "@/utils/util";
import box2d from "@box2d/core";
import { Game } from "phaser";
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
  declare body: Body;

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

    const fixture = this.body.data.CreateFixture({
      shape: new box2d.b2CircleShape(this.radius),
      friction: 0.2,
      restitution: 0.1,
      density: 2.3,
      filter: { categoryBits: 17 },
    });
    fixture.id = this.body.world.getNextFixtureId();

    if (null != this.options.properties?.linearDamping)
      this.body.data.SetLinearDamping(this.options.properties.linearDamping);

    if (null != this.options.properties?.angularDamping)
      this.body.data.SetAngularDamping(this.options.properties.angularDamping);

    const portalSensor = this.body.data.CreateFixture({
      shape: new box2d.b2CircleShape(0.1).Set(new box2d.b2Vec2(0, 0)),
      filter: {
        categoryBits: 4096,
        maskBits: 4096,
      },
      friction: 0.5,
      density: 0,
      userData: FixtureData.builder().withPortalSensor(true).build(),
    });
    portalSensor.id = this.body.world.getNextFixtureId();
  }
}

export default Ball;
