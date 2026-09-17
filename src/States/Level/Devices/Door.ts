import { Animation, Game, Group, Physics, Signal, Sound, Sprite } from "phaser";
import * as box2d from "phaser-box2d";
import Character, { Characters } from "../character";

class Door extends Group {
  readonly options = { width: 64, height: 8 };
  readonly pos: { x: number; y: number };
  readonly sprite: Sprite;
  readonly body: Physics.Box2D.Body;
  readonly signal: Signal;
  readonly data: { char: Characters };
  private isOpen: boolean = false;
  isUp: boolean = false;
  private currentFrac: number;
  private sound: Sound | null | undefined = null;

  constructor(game: Game, x: number, y: number, char: Characters) {
    super(game);

    this.update = this.update.bind(this);

    x += this.game.physics.box2d.mpx(1);
    this.pos = { x, y };
    const prefix = char === "fb" ? "FinishBoy" : "FinishGirl";
    this.sprite = this.game.make.sprite(
      x,
      y + 4,
      "TempleAssets",
      prefix + "0000",
    );
    this.sprite.scale.set(0.8);
    this.sprite.animations.add(
      "open",
      Animation.generateFrameNames(prefix, 0, 21, "", 4),
      10,
      false,
    );
    this.game.physics.box2d.enable(this.sprite);
    this.body = this.sprite.body;
    this.sprite.anchor.y = 0.99;
    this.game.layers.background.addChild(this.sprite);
    this.signal = new Signal();
    this.body.clearFixtures();
    this.body.data.SetType(box2d.b2BodyType.b2_staticBody);
    const shape = new box2d.b2PolygonShape();
    shape.SetAsOrientedBox(
      this.game.physics.box2d.pxm(this.options.width / 2),
      this.game.physics.box2d.pxm(this.options.height / 2),
      new box2d.b2Vec2(0, 0),
      0,
    );
    const fixtureDef = new box2d.b2FixtureDef();
    fixtureDef.shape = shape;
    fixtureDef.friction = 0.7;
    fixtureDef.restitution = 0;
    fixtureDef.density = 0;
    fixtureDef.userData = "door-" + char;
    fixtureDef.isSensor = true;
    this.data = { char };
    const fixture = this.body.data.CreateFixture(fixtureDef);
    fixture.id = this.body.world.getNextFixtureId();
    this.body.setFixtureContactCallback(
      fixture,
      (
        _body1: Physics.Box2D.Body,
        body2: Physics.Box2D.Body,
        _fixture1: box2d.b2Fixture,
        _fixture2: box2d.b2Fixture,
        begin: boolean,
      ) => {
        const sprite = body2.sprite as Sprite & { character: Character };
        if (sprite.character && sprite.character.data.char === this.data.char)
          return (this.isOpen = !!begin);
      },
      this,
    );
    this.currentFrac = this.sprite.animations.currentFrame.index;
  }
  update() {
    const frameIndex = this.sprite.animations._outputFrames.indexOf(
      this.sprite.animations.currentFrame.index,
    );
    this.isUp = 21 === frameIndex;
    const b = Math.min(0.04, this.game.time.elapsed / 1e3);
    const c = 25 * b;
    if (this.isOpen) {
      if (frameIndex < 21) {
        this.currentFrac += c;
        this.sprite.animations.frame = Math.round(this.currentFrac);
        if (!(null != this.sound && this.sound.isPlaying))
          this.sound = this.game.level.sounds?.door?.playInstance();
      } else if (frameIndex === 21) {
        this.signal.dispatch();
        if (null != this.sound) {
          this.sound.stopInstance();
          this.sound = null;
        }
      }
    } else {
      if (frameIndex > 0) {
        this.currentFrac -= c;
        this.sprite.animations.frame = Math.round(this.currentFrac);
        if (!(null != this.sound && this.sound.isPlaying)) {
          this.sound = this.game.level.sounds?.door?.playInstance();
        }
      }
      if (0 === frameIndex) {
        if (null != this.sound) {
          this.sound.stopInstance();
          this.sound = null;
        }
        this.signal.dispatch();
      }
    }
    return this.isUp;
  }
}

export default Door;

declare module "phaser" {
  interface AnimationManager {
    _outputFrames: number[];
  }
}
