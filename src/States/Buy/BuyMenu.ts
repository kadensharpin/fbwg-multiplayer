import { Game, Signal } from "phaser";
import StoneButton from "../Common/StoneButton";
import IngameMenu from "../Level/IngameMenu";

class BuyMenu extends IngameMenu<undefined> {
  readonly onClose = new Signal();

  constructor(game: Game, options?: never) {
    super(game, options);

    this.close = this.close.bind(this);
    this.renderContent = this.renderContent.bind(this);
  }

  renderContent() {
    const unlockText = this.game.make.bitmapText(
      0,
      -this.contentSize.halfHeight / 2,
      this.game.lang.font,
      this.game.lang.locale("unlock_all"),
      26,
    );
    unlockText.anchor.set(0.5);
    this.board.addChild(unlockText);
    const buyButton = new StoneButton(this.game, 0, 0, "1.19€", () => {});
    buyButton.anchor.set(0.5);
    this.board.addChild(buyButton);
    const cancelButton = new StoneButton(
      this.game,
      0,
      (1.1 * this.contentSize.halfHeight) / 2,
      this.game.lang.locale("Cancel"),
      this.close,
    );
    cancelButton.anchor.set(0.5);
    this.board.addChild(cancelButton);
  }

  close() {
    this.hide();
    setTimeout(() => this.onClose.dispatch(), 1000);
  }
}

export default BuyMenu;
