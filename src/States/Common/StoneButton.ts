/// <amd-module name="States/Common/StoneButton" />

import { Game } from "@azerion/phaser";
import Button from "./Button";

class StoneButton extends Button {
  constructor(
    game: Game,
    x: number,
    y: number,
    text: string,
    onClick: (self: Button) => void,
  ) {
    super(
      game,
      x,
      y,
      "MenuAssets",
      ["StoneButton0000", "StoneButton0001"],
      onClick,
      "pusher",
    );
    this.anchor.set(0.5);
    this.label = game.make.bitmapText(0, 0, game.lang.font, text, 26);
    this.label.anchor.set(0.5);
    if (game.lang.getLanguage() !== "en") {
      this.label.y = -this.label.height / 2;
    } else {
      this.label.y = -this.label.height / 5;
    }
    if (this.label.textWidth > 0.65 * this.sprite!.width) {
      this.sprite!.width = this.label.textWidth / 0.65;
    }
    this.addChild(this.label);
  }
}
export = StoneButton;
