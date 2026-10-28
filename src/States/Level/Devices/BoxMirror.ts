import Body from "@/utils/box2d/Body";
import box2d from "@box2d/core";
import { Game } from "phaser";
import BoxPrototype, { BoxPrototypeOptions } from "./BoxPrototype";

type BoxMirrorOptions = {
  mirrorWidth: number;
  mirrorHeight: number;
} & BoxPrototypeOptions;

class BoxMirror extends BoxPrototype<BoxMirrorOptions> {
  declare body: Body;

  constructor(game: Game, options: BoxMirrorOptions) {
    options.mirrorWidth ??= 2;
    options.mirrorHeight ??= 0.05;
    options.frameName ??= "BoxMirror0000";

    super(game, options);

    this.boxFixture.SetUserData({
      lightProperties: { type: "transparent" },
    });
    const shape = new box2d.b2PolygonShape();
    shape.SetAsBox(
      this.options.mirrorWidth / 2,
      this.options.mirrorHeight / 2,
      new box2d.b2Vec2(0, 0),
      Math.PI / 4,
    );
    const fixtureDef = {} as box2d.b2FixtureDef;
    fixtureDef.shape = shape;
    fixtureDef.friction = 0;
    fixtureDef.restitution = 0;
    fixtureDef.density = 0;
    fixtureDef.userData = { lightProperties: { type: "mirror" } };
    const fixture = this.body.data.CreateFixture(fixtureDef);
    fixture.id = this.body.world.getNextFixtureId();
  }
}

export default BoxMirror;
