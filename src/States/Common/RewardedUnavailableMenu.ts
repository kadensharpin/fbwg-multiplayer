import { Game, Signal } from "@azerion/phaser";
import IngameMenu from "../Level/IngameMenu";
import StoneButton from "./StoneButton";

class RewardedUnavailableMenu extends IngameMenu {
  readonly onClose = new Signal();

  constructor(game: Game, options: any) {
    super(game, options);

    this.close = this.close.bind(this);
    this.renderContent = this.renderContent.bind(this);
  }

  renderContent() {
    const line1 = this.game.make.bitmapText(
      0,
      -this.contentSize.halfHeight / 2 + 30,
      this.game.lang.font,
      this.game.lang.locale("rewarded_unavailable1"),
      26,
    );
    line1.anchor.set(0.5);
    this.board.addChild(line1);
    const line2 = this.game.make.bitmapText(
      0,
      -this.contentSize.halfHeight / 2 + 120,
      this.game.lang.font,
      this.game.lang.locale("rewarded_unavailable2"),
      26,
    );
    line2.anchor.set(0.5);
    this.board.addChild(line2);
    const closeButton = new StoneButton(
      this.game,
      0,
      (1.1 * this.contentSize.halfHeight) / 2,
      this.game.lang.locale("rewarded_close"),
      this.close,
    );
    closeButton.anchor.set(0.5);
    this.board.addChild(closeButton);
  }

  close() {
    this.hide();
    setTimeout(() => this.onClose.dispatch(), 1000);
  }
}

export default RewardedUnavailableMenu;
