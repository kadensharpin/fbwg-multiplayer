import Body from "@/utils/box2d/Body";
import { Fixture, FixtureData, NormalLightProperties } from "@/utils/Fixture";
import box2d from "@box2d/core";
import { Game, Signal } from "phaser";
import BoxedDevice from "./BoxedDevice";
import { type DeviceOptions } from "./Device";

type LightPusherOptions = {
  pusherWidth: number;
  pusherHeight: number;
  sensorWidth: number;
  properties: { color: string };
} & DeviceOptions;

class LightPusher extends BoxedDevice<LightPusherOptions> {
  declare body: Body;
  readonly sensorFixture: Fixture<NormalLightProperties>;
  readonly signal: Signal<[this]>;

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
    const sensorShape = new box2d.b2PolygonShape();
    sensorShape.SetAsBox(
      this.options.sensorWidth / 2,
      this.options.pusherHeight / 2,
      new box2d.b2Vec2(0, 0),
      0,
    );
    this.sensorFixture = this.body.data.CreateFixture({
      shape: sensorShape,
      friction: 0.7,
      restitution: 0,
      density: 0,
      isSensor: true,
      userData: FixtureData.builder().withNormalLight(true).build(),
    });
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
    this.body.data.CreateFixture({
      shape: fixture2Shape,
      friction: 0.7,
      restitution: 0,
      density: 0,
      isSensor: false,
      userData: FixtureData.builder().withTransparentLight().build(),
    });
    this.sensorFixture.id = this.body.world.getNextFixtureId();
    this.signal = new Signal();
    this.registerDevice();
  }

  static sounds() {
    return "lightPusher";
  }

  checkState() {
    const data = this.sensorFixture.GetUserData();
    if (
      this.state === 0 &&
      data.lightProperties.illuminationColour === this.options.properties.color
    ) {
      this.state = 1;
      this.game.level.sounds?.lightPusher?.play();
      this.signal.dispatch(this);
    } else if (
      this.state === 1 &&
      data.lightProperties.illuminationColour !== this.options.properties.color
    ) {
      this.state = 0;
      this.signal.dispatch(this);
    }
    data.lightProperties.illuminationColour = null;
  }
}

export default LightPusher;
