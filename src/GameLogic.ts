import { BitmapText, Game, Sprite } from "phaser";
import ProgressModel from "./ProgressModel";
import { Rtc } from "./rtc";
import { Characters } from "./States/Level/character";
import Level from "./States/Level/Level";
import LevelMenu from "./States/LevelMenu/LevelMenu";
import { LevelData, Temple } from "./temple";

class GameLogic {
  private rtc: Rtc | null = null;
  private waitingOverlay: Sprite | null = null;
  private myCharacter: Characters | null = null;

  public get isMultiplayer(): boolean {
    return this.rtc?.isOpen() ?? false;
  }

  public get multiplayerRoom(): string | null {
    return this.rtc?.room ?? null;
  }

  public get character(): Characters | null {
    return this.myCharacter;
  }

  constructor(readonly game: Game) {
    this.setTemple = this.setTemple.bind(this);
    this.startTemple = this.startTemple.bind(this);
    this.startLevel = this.startLevel.bind(this);
    this.startLevelById = this.startLevelById.bind(this);
    this.retry = this.retry.bind(this);
  }

  setTemple(temple: string) {
    if (this.rtc?.isHost()) {
      this.rtc.send("change-temple", temple);
    }
    console.log("set temple", temple);
    this.game.progress.save();
    ProgressModel.lastTemple = temple;
    this.game.load.baseURL = temple + "/";
    this.game.transitions.fadeToBlack().then(() => {
      this.game.state.start("load");
    });
  }

  startTemple(temple: Temple | null) {
    if (this.rtc?.isHost()) {
      this.rtc.send("start-temple", null);
    }
    temple ??= this.game.progress.temples[0];
    this.game.state.add("levelMenu", LevelMenu);
    this.game.state.fade("levelMenu", true, false, temple);
  }

  startLevelById(levelId: number) {
    const level = this.game.progress.temples[0].levels.find(
      (it) => it.id === levelId,
    );
    if (level) this.startLevel(level);
  }

  startLevel(level: LevelData, fade: boolean = true) {
    if (this.rtc?.isHost()) {
      this.rtc.send("start-level", level.id);
    } else if (this.waitingOverlay) {
      this.game.stage.removeChild(this.waitingOverlay);
      this.game.input.enabled = true;
    }

    this.game.progress.setPlayed(level);
    if (this.game.menuMusic != null) {
      this.game.menuMusic.fadeOut(500);
      this.game.menuMusic.onFadeComplete.add((sound) => sound.stop());
    }
    this.game.state.add("level", Level);
    if (fade) {
      this.game.state.fade("level", true, false, level, !level.rewarded);
    } else {
      this.game.state.start("level", true, false, level, !level.rewarded);
    }
  }

  async startMultiplayer(room: string) {
    let onOpen: () => void,
      p = new Promise<void>((s) => (onOpen = s));
    this.rtc = new Rtc(room);
    this.rtc.on("open", () => {
      console.log("connected to peer, is host:", this.rtc?.isHost());
      if (!this.rtc?.isHost()) {
        this.myCharacter = "fb";
        this.rtc?.on("change-temple", this.setTemple);
        this.rtc?.on("start-temple", this.startTemple);
        this.rtc?.on("start-level", this.startLevelById);
        this.waitingOverlay = this.createNonHostOverlay();
        this.game.stage.addChild(this.waitingOverlay);
        this.game.input.enabled = false;
      } else {
        this.myCharacter = "wg";
        this.rtc.send("change-temple", this.game.load.baseURL.slice(0, -1));
      }

      this.rtc?.on("left", (isDown) => {
        const otherCharacter = this.getOtherCharacter();
        if (!otherCharacter) return;

        otherCharacter.cursors.left.isDown = isDown;
      });
      this.rtc?.on("right", (isDown) => {
        const otherCharacter = this.getOtherCharacter();
        if (!otherCharacter) return;

        otherCharacter.cursors.right.isDown = isDown;
      });
      this.rtc?.on("jump", (isDown) => {
        const otherCharacter = this.getOtherCharacter();
        if (!otherCharacter) return;

        otherCharacter.cursors.up.isDown = isDown;
      });
      this.rtc?.on("finish-level", (success) => {
        if (!this.rtc?.isHost() && this.waitingOverlay!) {
          this.game.stage.addChild(this.waitingOverlay!);
          this.game.input.enabled = false;
        }

        this.game.level.endGame(success);
      });
      this.rtc?.on("set-pos", ([x, y]) => {
        if (this.game.state.current !== "level") return;

        const otherCharacter = this.getOtherCharacter();
        if (!otherCharacter) return;
        if (
          otherCharacter.cursors.left.isDown ||
          otherCharacter.cursors.right.isDown
        ) {
          const dist = otherCharacter.body.data
            .GetPosition()
            .Clone()
            .SubtractXY(x, y);
          if (dist.x < 1 && dist.y < 1) return;
        }

        otherCharacter.body.data.SetPositionXY(x, y);
      });
      this.rtc?.on("retry", this.retry);
      setInterval(() => {
        if (this.game.state.current !== "level") return;

        const myCharacter = this.getThisCharacter();
        if (!myCharacter) return;

        const pos = myCharacter.body.data.GetPosition();
        this.rtc?.send("set-pos", [pos.x, pos.y]);
      }, 500);
      onOpen();
    });
    return p;
  }

  private getThisCharacter() {
    if (this.myCharacter === "wg") {
      return this.game.level.pers2;
    } else {
      return this.game.level.pers1;
    }
  }

  private getOtherCharacter() {
    if (this.myCharacter === "wg") {
      return this.game.level.pers1;
    } else {
      return this.game.level.pers2;
    }
  }

  move(type: "left" | "right" | "jump", isDown: boolean) {
    this.rtc?.send(type, isDown);
  }

  endGame(success: boolean) {
    this.rtc?.send("finish-level", success);
  }

  retry() {
    if (this.rtc?.isHost()) {
      this.rtc.send("retry", null);
    }
    this.game.level.retry();
  }

  private createNonHostOverlay(): Sprite {
    const waiting = "Waiting for Host";
    const sprite = this.game.make.sprite(0, 0) as Sprite & { text: BitmapText };
    sprite.name = "loading-overlay";
    const graphics = this.game.make.graphics(0, 0);
    graphics.beginFill(0, 0.5);
    graphics.drawRect(0, 0, this.game.realWidth, this.game.realHeight);
    graphics.endFill();
    sprite.addChild(graphics);
    sprite.text = this.game.make.bitmapText(
      0,
      0,
      this.game.lang.font,
      waiting,
      Math.min(30, 36 / Math.max(1, this.game.resolution)),
    );
    sprite.text.anchor.set(0);
    sprite.text.alpha = 1;
    sprite.text.x = window.innerWidth / 2 - sprite.text.textWidth / 2;
    sprite.text.y = window.innerHeight / 2 - sprite.text.textHeight / 2;
    sprite.addChild(sprite.text);
    const startTime = this.game.time.time;
    const progress = () => {
      const elapsed = this.game.time.elapsedSince(startTime);
      const state = Math.floor(elapsed / 300) % 4;
      if (state === 0) {
        sprite.text.text = waiting + "...";
      }
      if (state === 1) {
        sprite.text.text = waiting;
      }
      if (state === 2) {
        sprite.text.text = waiting + ".";
      }
      if (state === 3) {
        sprite.text.text = waiting + "..";
      }
      return requestAnimationFrame(progress);
    };
    requestAnimationFrame(progress);
    this.game.stage.addChild(sprite);
    return sprite;
  }
}

export default GameLogic;
