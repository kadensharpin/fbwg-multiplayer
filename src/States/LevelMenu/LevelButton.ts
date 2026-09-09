import { Game, Sprite } from "phaser";

type LevelType = "speed" | "puzzle" | "dark";

class LevelButton extends Sprite {
  diamond: Sprite;
  constructor(
    game: Game,
    x: number,
    y: number,
    type: LevelType,
    textureNum: string,
    callback: (self: LevelButton) => void,
  ) {
    super(game, x, y);

    this.destroy = this.destroy.bind(this);
    this.setUp = this.setUp.bind(this);
    this.setDown = this.setDown.bind(this);

    this.anchor.set(0.5);
    const textureId =
      type === "speed"
        ? "DiamondSpeed"
        : type === "puzzle"
          ? "DiamondPuzzle"
          : type === "dark"
            ? "DiamondDark"
            : "Diamond";
    this.diamond = game.make.sprite(0, 0, "MenuAssets", textureId + textureNum);
    this.diamond.anchor.set(0.5);
    this.addChild(this.diamond);
    this.hitArea = new PIXI.Circle(0, 0, 1.5 * this.diamond.width);

    if (callback) {
      if (
        this.game.bowser.mobile ||
        this.game.bowser.tablet ||
        this.game.device.iPad
      ) {
        this.game.TouchManager.register(this, "touchstart", this.setDown);
        this.game.TouchManager.register(this, "touchend", (_ev, clicked) => {
          this.setUp();
          if (clicked) {
            if (this.game.settings.vibrate) navigator?.vibrate(50);
            if (this.game.settings.fx) this.game.currentSounds.pusher?.play();
            callback(this);
          }
        });
      } else {
        this.game.TouchManager.register(this, "mousedown", this.setDown);
        this.game.TouchManager.register(this, "mouseup", (_ev, clicked) => {
          this.setUp();
          if (clicked) {
            if (this.game.settings.fx) this.game.currentSounds.pusher?.play();
            callback(this);
          }
        });
      }
    }
  }
  setDown() {
    this.diamond.scale.set(0.95);
  }
  setUp() {
    setTimeout(() => this.diamond.scale.set(1), 100);
  }
  destroy() {
    if (
      this.game.bowser.mobile ||
      this.game.bowser.tablet ||
      this.game.device.iPad
    ) {
      this.game.TouchManager.unregister(this, "touchstart");
      this.game.TouchManager.unregister(this, "touchend");
    } else {
      this.game.TouchManager.unregister(this, "mousedown");
      this.game.TouchManager.unregister(this, "mouseup");
    }
    super.destroy();
  }
}

export default LevelButton;
