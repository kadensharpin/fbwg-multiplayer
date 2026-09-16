import { Game, Physics, Signal } from "phaser";
import * as box2d from "phaser-box2d";
import BoxedDevice from "./BoxedDevice";
import { type DeviceOptions } from "./Device";

type LightPusherOptions = {
  pusherWidth: number;
  pusherHeight: number;
  sensorWidth: number;
  properties: { color: string };
} & DeviceOptions;

class LightPusher extends BoxedDevice<LightPusherOptions> {
  declare body: Physics.Box2D.Body;
  readonly sensorFixture: box2d.b2Fixture;
  readonly signal: Signal;

  constructor(game: Game, options: LightPusherOptions) {
    options.pusherWidth ??= 1;
    options.pusherHeight ??= 0.4;
    options.sensorWidth ??= 1.5;
    options.atlasName ??= "MechAssets";
    options.frameName ??= "lightpusher_base0000";
    options.lightAtlas ??= "MechAssets";
    options.lightFrame ??= "lightpusher_light";

    super(game, options);

    this.checkState = this.checkState.bind(this);

    this.body.mass = 0;
    const fixture1Shape = new box2d.b2PolygonShape();
    fixture1Shape.SetAsOrientedBox(
      this.options.sensorWidth / 2,
      this.options.pusherHeight / 2,
      new box2d.b2Vec2(0, 0),
      0,
    );
    const fixtureDef1 = new box2d.b2FixtureDef();
    fixtureDef1.shape = fixture1Shape;
    fixtureDef1.friction = 0.7;
    fixtureDef1.restitution = 0;
    fixtureDef1.density = 0;
    fixtureDef1.isSensor = true;
    fixtureDef1.userData = {
      lightProperties: { type: "normal", sensor: true },
    };
    this.sensorFixture = this.body.data.CreateFixture(fixtureDef1);
    this.sensorFixture.id = this.body.world.getNextFixtureId();
    const vertices = [];
    vertices.push(new box2d.b2Vec2(-this.options.pusherWidth / 2 - 0.5, 0));
    vertices.push(new box2d.b2Vec2(this.options.pusherWidth / 2 + 0.5, 0));
    vertices.push(
      new box2d.b2Vec2(
        this.options.pusherWidth / 2,
        this.options.pusherHeight - 0.1,
      ),
    );
    vertices.push(
      new box2d.b2Vec2(
        -this.options.pusherWidth / 2,
        this.options.pusherHeight - 0.1,
      ),
    );
    const fixture2Shape = new box2d.b2PolygonShape();
    fixture2Shape.Set(vertices);
    const fixtureDef2 = new box2d.b2FixtureDef();
    fixtureDef2.shape = fixture2Shape;
    fixtureDef2.friction = 0.7;
    fixtureDef2.restitution = 0;
    fixtureDef2.density = 0;
    fixtureDef2.isSensor = false;
    fixtureDef2.userData = { lightProperties: { type: "transparent" } };
    this.body.data.CreateFixture(fixtureDef2);
    this.sensorFixture.id = this.body.world.getNextFixtureId();
    this.signal = new Signal();
    this.registerDevice();
  }

  static sounds() {
    return "lightPusher";
  }

  checkState() {
    if (
      this.state === 0 &&
      this.sensorFixture.m_userData.lightProperties.iluminated ===
        this.options.properties.color
    ) {
      this.state = 1;
      this.game.level.sounds.lightPusher?.play();
      this.signal.dispatch(this);
    } else if (
      this.state === 1 &&
      this.sensorFixture.m_userData.lightProperties.iluminated !==
        this.options.properties.color
    ) {
      this.state = 0;
      this.signal.dispatch(this);
    }
    this.sensorFixture.m_userData.lightProperties.iluminated = null;
  }
}

export default LightPusher;
