import { Game } from "phaser";
import Button from "./Button";

class BackButton extends Button {
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
      ["BackButton0000", "BackButton0001"],
      onClick,
      "pusher",
    );
    this.anchor.set(0.5);
    const label = game.make.bitmapText(0, 0, game.lang.font, text, 28);
    label.anchor.set(0);
    label.y = -label.textHeight / 2 - 12;
    label.x = 40;
    this.addChild(label);
    this.label = label;
  }
}

export default BackButton;
