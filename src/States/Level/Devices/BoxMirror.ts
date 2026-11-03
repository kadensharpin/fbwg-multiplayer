import Body from "@/utils/box2d/Body";
import {
  Fixture,
  FixtureData,
  NormalLightProperties,
  TransparentLightProperties,
} from "@/utils/Fixture";
import box2d from "@box2d/core";
import { Game } from "phaser";
import BoxPrototype, { BoxPrototypeOptions } from "./BoxPrototype";

type BoxMirrorOptions = {
  mirrorWidth: number;
  mirrorHeight: number;
} & BoxPrototypeOptions;

class BoxMirror extends BoxPrototype<BoxMirrorOptions> {
  declare body: Body;
  declare readonly boxFixture: Fixture<TransparentLightProperties>;

  constructor(game: Game, options: BoxMirrorOptions) {
    options.mirrorWidth ??= 2;
    options.mirrorHeight ??= 0.05;
    options.frameName ??= "BoxMirror0000";

    super(game, options);

    this.boxFixture.SetUserData(
      FixtureData.builder().withTransparentLight().build(),
    );
    const shape = new box2d.b2PolygonShape();
    shape.SetAsBox(
      this.options.mirrorWidth / 2,
      this.options.mirrorHeight / 2,
      new box2d.b2Vec2(0, 0),
      Math.PI / 4,
    );
    const mirrorFixture: Fixture<NormalLightProperties> =
      this.body.data.CreateFixture({
        shape,
        friction: 0,
        restitution: 0,
        density: 0,
        userData: FixtureData.builder().withNormalLight(false, true).build(),
      });
    mirrorFixture.id = this.body.world.getNextFixtureId();
  }
}

export default BoxMirror;
