import { Game, Signal } from "@azerion/phaser";
import StoneButton from "../Common/StoneButton";
import IngameMenu from "../Level/IngameMenu";

class CreditsMenu extends IngameMenu {
  onClose: Signal;
  constructor(game: Game, options: any) {
    super(game, options);

    this.close = this.close.bind(this);
    this.show = this.show.bind(this);
    this.renderContent = this.renderContent.bind(this);
    this.onClose = new Signal();
  }

  renderContent() {
    this.contentSize.halfWidth;
    const b = this.contentSize.halfHeight;
    const credits = this.game.make.bitmapText(
      0,
      -160,
      this.game.lang.font,
      this.game.lang.locale("credits_to"),
      20,
      "center",
    );
    credits.anchor.set(0.5);
    this.board.addChild(credits);
    const names = this.game.make.bitmapText(
      0,
      -40,
      "font_en",
      "Oslo Albet \r \r Anna Tamarit \r \r Jan Villanueva",
      24,
      "center",
    );
    names.anchor.set(0.5);
    this.board.addChild(names);
    const septimania = this.game.make.bitmapText(
      0,
      80,
      "font_en",
      "Septimania 2018",
      16,
      "center",
    );
    septimania.anchor.set(0.5);
    this.board.addChild(septimania);
    const okButton = new StoneButton(
      this.game,
      0,
      (1.1 * b) / 2,
      this.game.lang.locale("Ok"),
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

export default CreditsMenu;
