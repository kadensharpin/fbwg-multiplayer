import { Game, Signal } from "phaser";
import IngameMenu from "../Level/IngameMenu";
import LevelButton from "../LevelMenu/LevelButton";
import RewardedUnavailableMenu from "./RewardedUnavailableMenu";
import StoneButton from "./StoneButton";

class RewardedAdMenu extends IngameMenu {
  readonly onClose: Signal;
  rewarded: boolean;
  watchButton?: StoneButton;
  debounceClick: boolean = false;
  menu?: RewardedUnavailableMenu;

  button: LevelButton;
  buttonClick: (button: LevelButton) => void;

  constructor(
    game: Game,
    options: {
      button: LevelButton;
      buttonClick: (button: LevelButton) => void;
    },
  ) {
    super(game, options);

    this.close = this.close.bind(this);
    this.rewardedShown = this.rewardedShown.bind(this);
    this.watchAd = this.watchAd.bind(this);
    this.rewardedAdCompleted = this.rewardedAdCompleted.bind(this);
    this.renderContent = this.renderContent.bind(this);

    this.onClose = new Signal();
    this.button = options.button;
    this.buttonClick = options.buttonClick;
    this.rewarded = false;
  }

  renderContent() {
    const header1 = this.game.make.bitmapText(
      0,
      -this.contentSize.halfHeight / 2 + 30,
      this.game.lang.font,
      this.game.lang.locale("rewarded_header1"),
      26,
    );
    header1.anchor.set(0.5);
    this.board.addChild(header1);
    const header2 = this.game.make.bitmapText(
      0,
      -this.contentSize.halfHeight / 2 + 120,
      this.game.lang.font,
      this.game.lang.locale("rewarded_header2"),
      26,
    );
    header2.anchor.set(0.5);
    this.board.addChild(header2);
    const closeButton = new StoneButton(
      this.game,
      -this.contentSize.width / 4,
      (this.contentSize.halfHeight * 1.1) / 2,
      this.game.lang.locale("rewarded_close"),
      this.close,
    );
    closeButton.anchor.set(0.5);
    this.board.addChild(closeButton);
    this.watchButton = new StoneButton(
      this.game,
      this.contentSize.width / 4,
      (this.contentSize.halfHeight * 1.1) / 2,
      this.game.lang.locale("rewarded_watch"),
      this.watchAd,
    );
    this.watchButton.anchor.set(0.5);
    return this.board.addChild(this.watchButton);
  }

  rewardedAdCompleted() {
    this.rewarded = true;
  }

  watchAd() {
    if (!this.debounceClick) {
      this.game.sound.mute = true;
      this.game.paused = true;
      if (this.watchButton) this.watchButton.alpha = 0.5;
      this.debounceClick = true;
    }
  }

  rewardedShown() {
    this.game.sound.mute = !this.game.settings.fx;
    this.game.paused = false;
    if (!this.rewarded) {
      this.menu = new RewardedUnavailableMenu(this.game, {});
      this.menu.show();
    }
    this.button.data.rewarded = true;
    this.buttonClick(this.button);
    this.rewarded = false;
  }

  close() {
    this.hide();
    setTimeout(() => this.onClose.dispatch(), 1000);
  }
}

export default RewardedAdMenu;
