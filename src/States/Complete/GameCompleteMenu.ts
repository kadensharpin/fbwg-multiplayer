/// <amd-module name="States/Complete/GameCompleteMenu" />

import { Game, Signal } from "@azerion/phaser";
import StoneButton from "../Common/StoneButton";
import IngameMenu from "../Level/IngameMenu";

class GameCompleteMenu extends IngameMenu {
  readonly onClose = new Signal();

  constructor(game: Game, options: any) {
    super(game, options);

    this.close = this.close.bind(this);
    this.renderContent = this.renderContent.bind(this);
  }

  renderContent() {
    const congratulationsText = this.game.make.bitmapText(
      0,
      -this.contentSize.halfHeight / 3,
      this.game.lang.font,
      this.game.lang.locale("congratulations"),
      36,
    );
    congratulationsText.anchor.set(0.5);
    this.board.addChild(congratulationsText);
    const completionText = this.game.make.bitmapText(
      0,
      -this.contentSize.halfHeight / 3 + 1.2 * congratulationsText.height,
      this.game.lang.font,
      this.game.lang.locale("you_completed"),
      28,
    );
    completionText.anchor.set(0.5);
    this.board.addChild(completionText);
    const okButton = new StoneButton(
      this.game,
      0,
      this.contentSize.halfHeight / 2,
      this.game.lang.locale("Ok"),
      this.close,
    );
    okButton.anchor.set(0.5);
    this.board.addChild(okButton);
  }

  close() {
    this.hide();
    setTimeout(() => this.onClose.dispatch(), 1e3);
  }
}

export = GameCompleteMenu;
