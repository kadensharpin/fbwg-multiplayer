import { EndState } from "@/ProgressModel";
import { BitmapText, Game } from "phaser";
import RewardedUnavailableMenu from "../Common/RewardedUnavailableMenu";
import StoneButton from "../Common/StoneButton";
import IngameMenu from "./IngameMenu";

class GameOverMenu extends IngameMenu<EndState> {
  private label!: BitmapText;
  private skipButton!: StoneButton;
  private menu?: RewardedUnavailableMenu;

  constructor(game: Game, options: EndState) {
    super(game, options);
    this.onUnavailableClose = this.onUnavailableClose.bind(this);
    this.showRewardedUnavailable = this.showRewardedUnavailable.bind(this);
    this.skip = this.skip.bind(this);
    this.retry = this.retry.bind(this);
    this.gotoMenu = this.gotoMenu.bind(this);
    this.layoutContent = this.layoutContent.bind(this);
    this.renderContent = this.renderContent.bind(this);
  }

  renderContent() {
    this.label = this.game.make.bitmapText(
      0,
      0,
      this.game.lang.font,
      this.game.lang.locale("Game Over"),
      36,
    );
    this.label.anchor.set(0);
    this.label.x = -this.label.width / 2;
    this.label.y =
      0.5 * -this.contentSize.halfHeight + this.label.textHeight / 2;
    this.board.addChild(this.label);
    const skipText = this.game.make.bitmapText(
      0,
      0,
      this.game.lang.font,
      this.game.lang.locale("SkipText"),
      36,
    );
    skipText.anchor.set(0);
    skipText.fontSize = 22;
    skipText.x = -skipText.width / 2;
    skipText.y = 0.15 * -this.contentSize.halfHeight + skipText.textHeight / 2;
    this.board.addChild(skipText);
    const menuButton = new StoneButton(
      this.game,
      0.6 * -this.contentSize.halfWidth,
      0.4 * this.contentSize.halfHeight,
      this.game.lang.locale("Menu"),
      this.gotoMenu,
    );
    menuButton.anchor.set(0.5);
    this.board.addChild(menuButton);
    const retryButton = new StoneButton(
      this.game,
      0,
      0.4 * this.contentSize.halfHeight,
      this.game.lang.locale("Retry"),
      this.retry,
    );
    retryButton.anchor.set(0.5);
    this.board.addChild(retryButton);
    this.skipButton = new StoneButton(
      this.game,
      0.6 * this.contentSize.halfWidth,
      0.4 * this.contentSize.halfHeight,
      this.game.lang.locale("Skip"),
      this.skip,
    );
    this.skipButton.anchor.set(0.5);
    this.board.addChild(this.skipButton);
  }

  layoutContent() {
    super.layoutContent();
    this.label.x = -this.label.width / 2;
    this.label.y =
      0.5 * -this.contentSize.halfHeight + this.label.textHeight / 2;
  }

  gotoMenu() {
    this.game.state.fade("levelMenu", true, false, this.game.currentTemple);
  }

  retry() {
    this.game.level.retry();
  }

  skip() {
    this.options.data.skipped = true;
    this.game.progress.update(this.options);
    this.gotoMenu();
  }

  showRewardedUnavailable() {
    this.menu = new RewardedUnavailableMenu(this.game);
    this.menu.show();
    this.menu.onClose.add(this.onUnavailableClose);
    this.skipButton.alpha = 0.5;
  }

  onUnavailableClose() {}
}

export default GameOverMenu;
