/// <amd-module name="States/Level/Devices/BoxPrototype" />

import { Game, Physics } from "@azerion/phaser";
import BoxedDevice from "./BoxedDevice";
import { DeviceOptions } from "./Device";

export type BoxPrototypeOptions = {
  boxWidth: number;
  boxHeight: number;
  density: number;
  circleFriction: number;

  properties: {
    boxSize?: number;
    friction?: number;
  };
} & DeviceOptions;

class BoxPrototype<
  Options extends BoxPrototypeOptions = BoxPrototypeOptions,
> extends BoxedDevice<Options> {
  readonly boxFixture: box2d.b2Fixture & { id: number };
  declare body: Physics.Box2D.Body;

  constructor(game: Game, options: Partial<BoxPrototypeOptions>) {
    options.atlasName ??= "MechAssets";
    options.frameName ??= "movingbox0000";
    options.layer ??= "overGround";
    options.boxWidth ??= 1.77;
    options.boxHeight ??= 1.77;
    options.density ??= 0.45;
    options.circleFriction ??= 0.1;

    super(game, options as Options);

    if (this.options.properties?.boxSize != null) {
      this.options.boxWidth = this.options.properties.boxSize;
      this.options.boxWidth = this.options.properties.boxSize;
    }
    this.sprite!.cacheAsBitmap = true;
    const shape = new box2d.b2PolygonShape();
    const vertices = [];
    vertices.push(
      new box2d.b2Vec2(
        -this.options.boxWidth / 2 + 0.1,
        -this.options.boxHeight / 2,
      ),
    );
    vertices.push(
      new box2d.b2Vec2(
        this.options.boxWidth / 2 - 0.1,
        -this.options.boxHeight / 2,
      ),
    );
    vertices.push(
      new box2d.b2Vec2(
        this.options.boxWidth / 2,
        -this.options.boxHeight / 2 + 0.1,
      ),
    );
    vertices.push(
      new box2d.b2Vec2(
        this.options.boxWidth / 2,
        +this.options.boxHeight / 2 - 0.1,
      ),
    );
    vertices.push(
      new box2d.b2Vec2(
        this.options.boxWidth / 2 - 0.1,
        +this.options.boxHeight / 2,
      ),
    );
    vertices.push(
      new box2d.b2Vec2(
        -this.options.boxWidth / 2 + 0.1,
        +this.options.boxHeight / 2,
      ),
    );
    vertices.push(
      new box2d.b2Vec2(
        -this.options.boxWidth / 2,
        +this.options.boxHeight / 2 - 0.1,
      ),
    );
    vertices.push(
      new box2d.b2Vec2(
        -this.options.boxWidth / 2,
        -this.options.boxHeight / 2 + 0.1,
      ),
    );
    shape.Set(vertices.reverse());
    const fixtureDef = new box2d.b2FixtureDef();
    fixtureDef.shape = shape;
    fixtureDef.friction =
      this.options.properties.friction != null
        ? this.options.properties.friction
        : 0.4;
    fixtureDef.restitution = 0;
    fixtureDef.density = this.options.density;
    this.boxFixture = this.body.data.CreateFixture(fixtureDef);
    this.boxFixture.id = this.body.world.getNextFixtureId();
    const createFixture = (radius: number, pos: [number, number]) => {
      const d = new box2d.b2CircleShape(radius);
      d.m_p.SetXY(pos[0], pos[1]);
      const fixtureDef = new box2d.b2FixtureDef();
      fixtureDef.shape = d;
      fixtureDef.filter.categoryBits = 17;
      fixtureDef.filter.maskBits = 4097;
      fixtureDef.friction = this.options.circleFriction;
      fixtureDef.density = 0;
      fixtureDef.userData = { lightProperties: { type: "transparent" } };
      const fixture = this.body.data.CreateFixture(fixtureDef);
      fixture.id = this.body.world.getNextFixtureId();
      return fixture;
    };
    const size = this.options.boxWidth / 2 - 0.6 * 0.1;
    createFixture(0.1, [-size, -size]);
    createFixture(0.1, [size, -size]);
    createFixture(0.1, [-size, size]);
    createFixture(0.1, [size, size]);
    const circle = new box2d.b2CircleShape(0.1);
    circle.m_p.SetXY(0, 0);
    const fixtureDef2 = new box2d.b2FixtureDef();
    fixtureDef2.shape = circle;
    fixtureDef2.filter.categoryBits = 4096;
    fixtureDef2.filter.maskBits = 4096;
    fixtureDef2.friction = 0.5;
    fixtureDef2.density = 0;
    fixtureDef2.userData = {
      "portal-sensor": true,
      lightProperties: { type: "transparent" },
    };
    const fixture2 = this.body.data.CreateFixture(fixtureDef2);
    fixture2.id = this.body.world.getNextFixtureId();
    this.body.data.SetLinearDamping(1);
    this.body.data.SetAngularDamping(20);
  }
}

// @ts-ignore
export = BoxPrototype;
