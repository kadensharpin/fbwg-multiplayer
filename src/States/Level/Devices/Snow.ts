/// <amd-module name="States/Level/Devices/Snow" />

import { Game, Physics, Sprite } from "@azerion/phaser";
import Character from "../character";
import Ground from "../Ground";

type SnowOptions = {
  x: number;
  y: number;
  data: {
    x: number;
    y: number;
    length: number;
    dir: "SW" | "SE" | "WE";
  };
};

class Snow extends Sprite {
  readonly options: SnowOptions;
  readonly ground: Ground;
  readonly iceFixture: box2d.b2Fixture;
  declare body: Physics.Box2D.Body;

  constructor(game: Game, ground: Ground, data: SnowOptions["data"]) {
    const options: Partial<SnowOptions> = { data };
    let iceX: number;
    let angle;
    if ("SW" === data.dir) {
      iceX = data.length * Math.sqrt(2);
      angle = Math.PI / 4;
      options.y = data.x + data.length / 2;
      options.x = data.y + data.length / 2;
    } else if ("SE" === data.dir) {
      iceX = data.length * Math.sqrt(2);
      angle = -Math.PI / 4;
      options.y = data.x + data.length / 2;
      options.x = data.y - data.length / 2 + 1;
    } else if ("WE" === data.dir) {
      iceX = data.length;
      angle = 0;
      options.y = data.x;
      options.x = data.y + data.length / 2;
    } else {
      throw new Error("data.dir must be one of SW, SE or WE");
    }
    iceX -= 0.1;

    super(game, options.x, options.y);

    this.drawTile = this.drawTile.bind(this);
    this.createSnowGraphics = this.createSnowGraphics.bind(this);

    this.ground = ground;
    this.options = options as SnowOptions;

    this.game.add.existing(this);
    this.game.layers.liquids.addChild(this);
    this.game.physics.box2d.enable(this);
    this.body.clearFixtures();
    this.body.mass = 0;
    this.body.data.SetPosition(
      new box2d.b2Vec2(-this.options.x, -this.options.y),
    );
    this.body.data.SetAngle(angle);
    const iceShape = new box2d.b2PolygonShape();
    const iceVertices = [];
    const height = 0.4;
    iceVertices.push(new box2d.b2Vec2(-iceX / 2 + 0, 0.01));
    iceVertices.push(new box2d.b2Vec2(iceX / 2 - 0, 0.01));
    iceVertices.push(new box2d.b2Vec2(iceX / 2 - 0.3, 0.01 - height));
    iceVertices.push(new box2d.b2Vec2(-iceX / 2 + 0.3, 0.01 - height));
    iceShape.Set(iceVertices);
    const iceFixtureDef = new box2d.b2FixtureDef();
    iceFixtureDef.shape = iceShape;
    iceFixtureDef.filter.categoryBits = 1;
    iceFixtureDef.filter.maskBits = 16;
    iceFixtureDef.friction = 1;
    iceFixtureDef.userData = { type: "ice" };
    this.iceFixture = this.body.data.CreateFixture(iceFixtureDef);
    this.iceFixture.id = this.body.world.getNextFixtureId();
    this.body.setFixtureContactCallback(
      this.iceFixture,
      (
        body1: Physics.Box2D.Body & { sprite: { character?: Character } },
        body2: Physics.Box2D.Body & { sprite: { character?: Character } },
        fixture1: box2d.b2Fixture,
        fixture2: box2d.b2Fixture,
        begin: boolean,
      ) => {
        const character1 = body1.sprite.character;
        const character2 = body2.sprite.character;
        if (
          (character1 && "feet" === fixture1.m_userData) ||
          (character2 && "feet" === fixture2.m_userData)
        ) {
          const character = (character1 || character2)!;
          character.snowCount ||= 0;
          if (begin) {
            character.snowCount += 1;
          } else {
            character.snowCount -= 1;
          }
          character.setOnIce(0 !== character.snowCount);
        }
      },
      this,
    );
    this.createSnowGraphics();
  }

  createSnowGraphics() {
    for (let i = 0; i < this.options.data.length; i++) {
      let x, y, asset;
      if (this.options.data.dir === "SW") {
        x =
          this.game.physics.box2d.mpx(1) *
          (this.options.x - this.options.data.length / 2 + i * 1);
        y =
          this.game.physics.box2d.mpx(1) *
          (this.options.y - this.options.data.length / 2 + i * 1);
        asset = "SnowSlope0000";
      } else if (this.options.data.dir === "SE") {
        x =
          this.game.physics.box2d.mpx(1) *
          (this.options.x + this.options.data.length / 2 - 1 - i * 1);
        y =
          this.game.physics.box2d.mpx(1) *
          (this.options.y - this.options.data.length / 2 + i * 1);
        asset = "SnowSlope0001";
      } else if (this.options.data.dir === "WE") {
        x =
          this.game.physics.box2d.mpx(1) *
          (this.options.x - this.options.data.length / 2 + i);
        y = this.game.physics.box2d.mpx(1) * this.options.y;
        asset = "SnowFlat0000";
      } else continue;
      this.drawTile(x, y, asset);
    }
  }

  drawTile(x: number, y: number, asset: string) {
    const frame = this.game.cache.getFrameByName("GroundAssets", asset);
    const img = this.game.cache.getImage("GroundAssets");
    x = x - (frame.width - 32) / 2 + 32;
    y = y - (frame.height - 32) / 2 + 32;
    this.ground.bmd.ctx.drawImage(
      img,
      frame.x,
      frame.y,
      frame.width,
      frame.height,
      x,
      y,
      frame.width,
      frame.height,
    );
  }
}

export = Snow;
