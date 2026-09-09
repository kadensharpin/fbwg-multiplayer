import { Game } from "phaser";
import Button from "./Button";

class GoldButton extends Button {
  constructor(
    game: Game,
    x: number,
    y: number,
    label: string,
    onClick: (self: Button) => void,
    fontSize: number,
  ) {
    super(game, x, y, "MenuAssets", null, onClick, "pusher");
    if (!fontSize) fontSize = 28;
    this.anchor.set(0.5);
    this.label = game.make.bitmapText(
      0,
      0,
      game.lang.font,
      label + " ",
      fontSize,
    );
    this.label.anchor.set(0.5);
    this.addChild(this.label);
  }
}
export default GoldButton;
