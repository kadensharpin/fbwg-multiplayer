import { Temple } from "@/temple";
import { Animation, Game, PIXI, Signal, Sprite } from "phaser";
import GoldButton from "../Common/GoldButton";
import MenuFairy from "../Common/Navies";

class TempleHall extends Sprite {
  bkg: Sprite & { _frame?: any };
  w: number;
  h: number;
  private _scale: number;
  beams: LightBeam[];
  fireboy: Sprite;
  watergirl: Sprite;
  gameName: Sprite;
  onStart: Signal<[Temple]>;
  playBtn: GoldButton;
  fairies: MenuFairy;
  t: number = 0;
  constructor(game: Game, x: number, y: number) {
    super(game, x, y);
    this.layoutContent = this.layoutContent.bind(this);
    this.update = this.update.bind(this);
    this.createChar = this.createChar.bind(this);
    this.w = this.game.realWidth;
    this.h = this.game.realHeight;
    this.bkg = this.game.make.sprite(0, 0, "TempleHall");
    this.bkg.anchor.set(0.5);
    this._scale = Math.max(this.w / this.bkg.width, this.h / this.bkg.height);
    this.bkg.scale.set(this._scale);
    this.bkg.height / 2 > this.h / 2 &&
      (this.bkg.y = this.h / 2 - this.bkg.height / 2);
    this.addChild(this.bkg);
    this.beams = [];
    const target = 7;
    for (let i = 0; i < target; i++) {
      const hallBeam = this.game.make.sprite(0, 0, "HallBeam") as LightBeam;
      hallBeam.anchor.set(0.5, -0.5);
      hallBeam.alpha = 0.6 + 0.4 * Math.random();
      hallBeam.t_offset =
        (2 * (i - target / 2) * Math.PI) / target -
        (Math.random() * Math.PI) / 6;
      hallBeam.t_speed = 0.6 * Math.random();
      hallBeam.blendMode = PIXI.blendModes.SCREEN;
      hallBeam.cacheAsBitmap = true;
      this.addChild(hallBeam);
      this.beams.push(hallBeam);
    }

    this.fireboy = this.createChar("fire");
    this.addChild(this.fireboy);
    this.fireboy.scale.set(this._scale);
    this.fireboy.x = -this.w / 4;
    this.fireboy.y = this.h / 2 - 2 * this.fireboy.height;
    this.watergirl = this.createChar("water");
    this.watergirl.scale.set(this._scale);
    this.watergirl.x = this.w / 4;
    this.watergirl.y = this.h / 2 - 2 * this.watergirl.height;
    this.addChild(this.watergirl);
    this.gameName = this.game.make.sprite(0, 0, "GameName");
    this.gameName.anchor.set(0.5, 0.5);
    const gameNameScale = Math.min(
      1,
      (0.9 * this.game.realWidth) / this.gameName.width,
    );
    this.gameName.scale.set(gameNameScale);
    this.addChild(this.gameName);
    this.onStart = new Signal();
    this.playBtn = new GoldButton(
      this.game,
      0,
      0,
      this.game.lang.locale("Play"),
      () => this.onStart.dispatch(game.progress.temples[0]),
      40,
    );
    this.addChild(this.playBtn);
    this.addChild(this.playBtn);
    this.fairies = new MenuFairy(this.game, 0, 0);
    this.addChild(this.fairies);
    this.layoutContent();
  }

  createChar(characterId: "fire" | "water") {
    const character = this.game.make.sprite(0, 0, "CharAssets", "_default0000");
    const legs = this.game.make.sprite(
      0,
      0,
      "CharAssets",
      characterId + "_legs_idle0000",
    );
    legs.anchor.set(0.5);
    const head = this.game.make.sprite(0, 0, "CharAssets");
    head.animations.add(
      "idle",
      Animation.generateFrameNames(characterId + "_head_idle", 0, 29, "", 4),
      30,
      true,
    );
    head.animations.play("idle");
    head.anchor.set(0.5);
    const glow = this.game.make.sprite(
      0,
      0,
      "CharAssets",
      characterId + "_glow0000",
    );
    glow.anchor.set(0.5);
    glow.y = 40;
    character.addChild(glow);
    character.addChild(legs);
    character.addChild(head);
    return character;
  }
  update() {
    this.t += 0.003;
    for (const beam of this.beams) {
      beam.rotation = 0.2 * Math.sin(beam.t_offset + this.t * beam.t_speed);
      beam.y =
        -this.h / 2 -
        (beam._frame.height * this._scale) / 2 -
        Math.abs(
          (Math.sin(beam.t_offset + this.t * beam.t_speed) * this.h) / 4,
        );
      beam.scale.set(
        0.6 + 0.4 * Math.abs(Math.sin(beam.t_offset + this.t * beam.t_speed)),
        this._scale,
      );
    }
    return this.fairies.update();
  }
  layoutContent() {
    this.w = this.game.realWidth;
    this.h = this.game.realHeight;
    this._scale = Math.max(
      this.w / this.bkg._frame.width,
      this.h / this.bkg._frame.height,
    );
    this.bkg.scale.set(this._scale);
    this.bkg.y =
      this.bkg.height / 2 > this.h / 2 ? this.h / 2 - this.bkg.height / 2 : 0;
    this.fireboy.scale.set(this._scale);
    this.fireboy.x = -this.w / 4;
    this.fireboy.y = this.h / 2 - 2 * this.fireboy.height;
    this.watergirl.scale.set(this._scale);
    this.watergirl.x = this.w / 4;
    this.watergirl.y = this.h / 2 - 2 * this.watergirl.height;
    for (const beam of this.beams) {
      beam.scale.set(this._scale * (0.3 + 1.3 * Math.random()), this._scale);
    }

    this.gameName.y = -this.game.realHeight / 5;
    this.playBtn.y = this.playBtn.height;
    this.playBtn.y = 2 * this.playBtn.height;
    this.fairies.y = this.playBtn.y;
  }
}

export default TempleHall;

type LightBeam = Sprite & { t_speed: number; t_offset: number; _frame: any };
