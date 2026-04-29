/// <amd-module name="States/Level/PauseMenu" />

import { BitmapText, Game } from "@azerion/phaser";
import Button from "States/Common/Button";
import StoneButton from "../Common/StoneButton";
import SettingsMenu from "../Settings/SettingsMenu";
import IngameMenu from "./IngameMenu";

type Level = never;

class PauseMenu extends IngameMenu {
  isPressed = false;
  level: Level;
  divID: string;
  blockID: string;
  label!: BitmapText;
  settingsButton!: Button;
  settingsMenu!: SettingsMenu;
  levelState: any;
  retryButton!: StoneButton;
  quitButton!: StoneButton;
  resumeButton!: StoneButton;
  constructor(game: Game, level: Level) {
    super(game, null);

    this.retry = this.retry.bind(this);
    this.quit = this.quit.bind(this);
    this.resume = this.resume.bind(this);
    this.show = this.show.bind(this);
    this.layoutContent = this.layoutContent.bind(this);
    this.renderContent = this.renderContent.bind(this);

    this.level = level;
    if (this.game.device.desktop) {
      this.divID = "rtb-v-2";
      this.blockID = "R-A-800494-7";
    } else {
      this.divID = "rtb-m-h-1";
      this.blockID = "R-A-800494-14";
    }
  }
  renderContent() {
    this.label = this.game.make.bitmapText(
      0,
      0,
      this.game.lang.font,
      this.game.lang.locale("Paused"),
      36,
    );
    this.label.anchor.set(0);
    this.label.x = -this.label.width / 2;
    this.label.y =
      0.5 * -this.contentSize.halfHeight + this.label.textHeight / 2;
    this.board.addChild(this.label);
    this.settingsButton = new Button(
      this.game,
      0,
      0,
      "MenuAssets",
      ["SettingsButton0000", "SettingsButton0001"],
      () => {
        this.settingsMenu = new SettingsMenu(this.game, this.levelState);
        this.settingsMenu.show();
      },
      "pusher",
    );
    this.settingsButton.anchor.set(1);
    this.settingsButton.scale.set(0.9);
    this.settingsButton.x =
      this.contentSize.halfWidth - this.settingsButton.width;
    this.settingsButton.y =
      -this.contentSize.halfHeight + this.settingsButton.height + 100;
    this.board.addChild(this.settingsButton);
    this.retryButton = new StoneButton(
      this.game,
      0,
      0,
      this.game.lang.locale("Retry"),
      this.retry,
    );
    this.retryButton.anchor.set(0);
    this.board.addChild(this.retryButton);
    this.quitButton = new StoneButton(
      this.game,
      0,
      0,
      this.game.lang.locale("End"),
      this.quit,
    );
    this.quitButton.anchor.set(0);
    this.board.addChild(this.quitButton);
    this.resumeButton = new StoneButton(
      this.game,
      0,
      0,
      this.game.lang.locale("Resume"),
      this.resume,
    );
    this.resumeButton.anchor.set(0);
    this.board.addChild(this.resumeButton);
    this.layoutContent();
  }
  layoutContent() {
    super.layoutContent();
    this.label.x = -this.label.width / 2;
    this.label.y =
      0.6 * -this.contentSize.halfHeight + this.label.textHeight / 2;
    this.retryButton.x = this.contentSize.halfWidth / 3;
    this.retryButton.y = 0.15 * this.contentSize.halfHeight;
    this.quitButton.x = -this.contentSize.halfWidth / 3;
    this.quitButton.y = 0.15 * this.contentSize.halfHeight;
    this.resumeButton.x = 0;
    this.resumeButton.y = 0.5 * this.contentSize.halfHeight;
    this.settingsButton.x =
      this.contentSize.halfWidth - this.settingsButton.width;
    this.settingsButton.y =
      -this.contentSize.halfHeight + this.settingsButton.height + 100;
  }
  show() {
    super.show();
    this.isPressed = false;
  }
  resume() {
    if (this.isPressed) return;
    this.game.level.togglePause();
    this.isPressed = true;
  }
  quit() {
    if (this.isPressed) return;
    this.level.quit();
    this.isPressed = true;
  }
  retry() {
    if (this.isPressed) return;
    this.level.retry();
    this.isPressed = true;
  }
}

export = PauseMenu;
