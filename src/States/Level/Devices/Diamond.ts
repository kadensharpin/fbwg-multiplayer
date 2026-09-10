import { Easing, Game, Physics, Signal, Sprite } from "phaser";
import * as box2d from "phaser-box2d";
import Character, { CharacterSprite } from "../character";

class Diamond extends Sprite {
  readonly options = { width: 0.7, height: 0.7 };
  readonly sprite: Sprite;
  readonly signal: Signal;
  declare body: Physics.Box2D.Body;

  constructor(game: Game, x: number, y: number, asset: string) {
    x += game.physics.box2d.mpx(1);
    y -= game.physics.box2d.mpx(1);

    super(game, x, y, "CharAssets", "_default0000");

    this.grabbed = this.grabbed.bind(this);

    this.game.physics.box2d.enable(this);
    this.sprite = game.make.sprite(
      0,
      0,
      "CharAssets",
      "diamond_" + asset + "0000",
    );
    this.sprite.anchor.set(0.5);
    this.addChild(this.sprite);
    this.signal = new Signal();
    this.body.clearFixtures();
    this.body.mass = 0;
    const shape = new box2d.b2PolygonShape();
    shape.SetAsOrientedBox(
      this.options.width / 2,
      this.options.height / 2,
      new box2d.b2Vec2(0, 0),
      0,
    );
    const fixtureDef = new box2d.b2FixtureDef();
    fixtureDef.shape = shape;
    fixtureDef.friction = 0.7;
    fixtureDef.restitution = 0;
    fixtureDef.density = 0;
    fixtureDef.userData = "diamond-" + asset;
    fixtureDef.isSensor = true;
    fixtureDef.userData = { lightProperties: { type: "transparent" } };
    this.data.char = asset;
    const fixture = this.body.data.CreateFixture(fixtureDef);
    fixture.id = this.body.world.getNextFixtureId();
    this.game.layers.underGround.addChild(this);

    this.body.setFixtureContactCallback(
      fixture,
      (
        _body1: Physics.Box2D.Body,
        body2: Physics.Box2D.Body,
        _fixture1: box2d.b2Fixture,
        _fixture2: box2d.b2Fixture,
        begin: boolean,
      ) => {
        const sprite = body2.sprite as CharacterSprite;
        if (
          sprite.character &&
          sprite.character.data.char &&
          ("silver" === this.data.char ||
            "fbwg" === this.data.char ||
            sprite.character.data.char === this.data.char) &&
          begin
        ) {
          console.log("Grabbed!");
          this.grabbed(sprite.character);
          this.signal.dispatch();
        }
      },
      this,
    );

    this.sprite.y = -5;
    setTimeout(() => {
      this.game.add
        .tween(this.sprite)
        .to({ y: 5 }, 2e3, Easing.Sinusoidal.InOut, true)
        .yoyo(true)
        .loop();
    }, 2e3 * Math.random());
  }

  grabbed(character: Character) {
    this.game.level.sounds.diamond?.play();
    this.data.char === "silver"
      ? character.data.silverDiamond++
      : character.data.diamonds++;
    this.destroy();
  }
}

export default Diamond;
