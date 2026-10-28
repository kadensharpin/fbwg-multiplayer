import Body from "@/utils/box2d/Body";
import box2d from "@box2d/core";
import { Game } from "phaser";
import { deepObjectExtend } from "../../../utils/util";
import Device, { DeviceOptions } from "./Device";

type WindowOptions = {
  rotation: number;
  properties: {
    dx: number;
    dy: number;
  };
} & DeviceOptions;

class Window extends Device<WindowOptions> {
  declare body: Body;
  constructor(game: Game, options: WindowOptions) {
    if (options.width < options.height) {
      const temp = options.width;
      options.width = options.height;
      options.height = temp;
      options.x = options.x + options.height / 2;
      options.y = options.y + options.width / 2;
      options.rotation = -90;
    } else {
      options.x = options.x + options.width / 2;
      options.y = options.y + options.height / 2;
    }

    deepObjectExtend(options, {
      lightAtlas: "MechAssets",
      properties: { group: 0, dx: 4, dy: 0 },
    });

    super(game, options);

    this.sprite = this.game.make.sprite(
      this.options.x,
      this.options.y,
      "MechAssets",
      "_default0000",
    );
    this.game.physics.box2d.enable(this.sprite);
    this.game.layers.overGround.addChild(this.sprite);
    this.body = this.sprite.body;
    this.body.clearFixtures();
    this.body.data.SetAngle(this.options.rotation);
    this.body.static = true;
    const shape = new box2d.b2PolygonShape();
    shape.SetAsBox(
      this.options.width / 2,
      this.options.height / 2,
      new box2d.b2Vec2(0, 0),
      0,
    );
    const fixtureDef = {} as box2d.b2FixtureDef;
    fixtureDef.shape = shape;
    fixtureDef.friction = 0.7;
    fixtureDef.restitution = 0;
    fixtureDef.density = 0;
    fixtureDef.userData = { lightProperties: { type: "transparent" } };
    fixtureDef.filter = { categoryBits: 1, maskBits: 61695 };
    const fixture = this.body.data.CreateFixture(fixtureDef);
    fixture.id = this.body.world.getNextFixtureId();
    new box2d.b2Vec2(this.options.properties.dx, this.options.properties.dy);
    this.state = 0;
    this.registerDevice();
    const windowLeft = this.game.make.sprite(
      0,
      0,
      "MechAssets",
      "WindowLeft0000",
    );
    windowLeft.anchor.set(0.5);
    this.sprite.addChild(windowLeft);
    windowLeft.x = this.mpx(this.options.width / 2 - 0.5);
    windowLeft.y = this.mpx(this.options.height / 2 - 0.5);
    const windowRight = this.game.make.sprite(
      0,
      0,
      "MechAssets",
      "WindowRight0000",
    );
    windowRight.anchor.set(0.5);
    this.sprite.addChild(windowRight);
    windowRight.x = -this.mpx(this.options.width / 2 - 0.5);
    windowRight.y = this.mpx(this.options.height / 2 - 0.5);
    const windowCentre = this.game.make.sprite(
      0,
      0,
      "MechAssets",
      "WindowCenter0000",
    );
    windowCentre.anchor.set(0.5);
    this.sprite.addChild(windowCentre);
    windowCentre.x = 0;
    windowCentre.y = 0;
    windowCentre.scale.x = (this.options.width - 2) / 3;
    this.sprite.scale.x = 1.05;
    this.sprite.scale.y = 1.05;
  }
}

export default Window;
