import { BitmapText, Game, Group } from "phaser";

class CodeCharacter extends Group {
  private _character: string | null = null;
  private text: BitmapText | null = null;

  constructor(game: Game, x: number, y: number) {
    super(game);

    this.x = x;
    this.y = y;

    const graphics = game.add.graphics(0, 0, this);
    graphics.lineStyle(10, 0, 0.7);
    graphics.drawRoundedRect(0, 0, 90, 110, 10);
  }

  public get character(): string | null {
    return this._character;
  }

  public set character(char: string | null) {
    if (char && char.length != 1) return;
    this._character = char;
    this.text?.destroy(true);
    if (!char) return;

    this.text = this.game.make.bitmapText(0, 24, this.game.lang.font, char, 30);
    this.text.x = (this.width - this.text.width) / 2;
    this.addChild(this.text);
  }
}

export default CodeCharacter;
