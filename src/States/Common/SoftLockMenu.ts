import { Game, Signal } from "phaser";
import IngameMenu from "../Level/IngameMenu";
import StoneButton from "./StoneButton";

class SoftLockMenu extends IngameMenu {
  readonly onClose: Signal;

  constructor(game: Game, options: {}) {
    super(game, options);

    this.close = this.close.bind(this);
    this.renderContent = this.renderContent.bind(this);

    this.onClose = new Signal();
  }

  renderContent() {
    const text1 = this.game.make.bitmapText(
      0,
      -this.contentSize.halfHeight / 2 + 30,
      this.game.lang.font,
      this.game.lang.locale("this") +
        " " +
        this.game.lang.locale(this.options.label) +
        " " +
        this.game.lang.locale("not_yet"),
      26,
    );
    text1.anchor.set(0.5);
    this.board.addChild(text1);
    const text2 = this.game.make.bitmapText(
      0,
      -this.contentSize.halfHeight / 2 + 140,
      this.game.lang.font,
      this.game.lang.locale("complete_more"),
      22,
    );
    text2.anchor.set(0.5);
    this.board.addChild(text2);
    const text3 = this.game.make.bitmapText(
      0,
      -this.contentSize.halfHeight / 2 + 200,
      this.game.lang.font,
      this.game.lang.locale("to_unlock"),
      22,
    );
    text3.anchor.set(0.5);
    this.board.addChild(text3);
    const okButton = new StoneButton(
      this.game,
      0,
      (this.contentSize.halfHeight * 1.1) / 2,
      this.game.lang.locale("Ok!"),
      this.close,
    );
    okButton.anchor.set(0.5);
    this.board.addChild(okButton);
  }

  close() {
    this.hide();
    setTimeout(() => this.onClose.dispatch(), 1000);
  }
}

export default SoftLockMenu;
