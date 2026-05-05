/// <amd-module name="States/Common/TouchButton" />

import { Game } from "@azerion/phaser";
import Button from "./Button";

type TouchButtonType = "up" | "right" | "left";

class TouchButton extends Button {
  customEvents = true;
  initialFrame: string;
  constructor(
    game: Game,
    x: number,
    y: number,
    type: TouchButtonType,
    character: string,
    onClick?: ((self: Button) => void) | null | undefined,
  ) {
    const textureId =
      type === "up"
        ? "FingerRingJump0000"
        : type === "right"
          ? "FingerRingRight0000"
          : type === "left"
            ? "FingerRingLeft0000"
            : "";
    super(game, x, y, "PopupAssets", textureId, onClick, null);

    this.onUp = this.onUp.bind(this);
    this.onDown = this.onDown.bind(this);
    this.setState = this.setState.bind(this);

    this.sprite!.anchor.set(0.5);
    this.anchor.set(0.5);
    this.sprite!.tint = character === "fb" ? 16757917 : 10347007;
    this.alpha = 0.7;
    this.initialFrame = textureId;
    game.TouchManager.register(this, "touchstart", () => {
      this.isDown = true;
      this.alpha = 0.3;
      this.onDown();
    });
    game.TouchManager.register(this, "touchend", () => {
      this.isDown = false;
      this.alpha = 0.5;
      this.onUp();
    });
    this.hitArea = new PIXI.Circle(0, 0, this.sprite!.width);
  }

  setState(type: TouchButtonType) {
    this.sprite!.frameName =
      "up" === type ? "FingerRingJump0000" : this.initialFrame;
    this.sprite!.cacheAsBitmap = true;
  }
  onDown() {}
  onUp() {}
}

export = TouchButton;
