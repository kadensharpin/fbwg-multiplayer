/// <amd-module name="States/Level/LevelUI" />

import { Game, Group } from "@azerion/phaser";
import Button from "../Common/Button";
import Clock from "./Clock";
import { Level } from "./level";

class LevelUI extends Group {
  private readonly pauseButton: Button;
  private readonly clock: Clock;

  constructor(game: Game, level: Level) {
    super(game);

    this.pauseClicked = this.pauseClicked.bind(this);
    this.show = this.show.bind(this);
    this.layoutContent = this.layoutContent.bind(this);

    this.game.layers.ui.addChild(this);
    this.pauseButton = new Button(
      this.game,
      this.game.realWidth / 2,
      -this.game.realHeight / 2,
      "PopupAssets",
      "PauseButton0000",
      this.pauseClicked,
      null,
    );
    this.pauseButton.sprite!.anchor.set(1, 0);
    this.pauseButton.hitArea = new PIXI.Circle(
      -this.pauseButton.width / 2,
      this.pauseButton.width / 2,
      this.pauseButton.width * 2,
    );
    this.addChild(this.pauseButton);
    this.clock = new Clock(this.game, 0, -this.game.realHeight / 2);
    this.clock.anchor.set(0.5, 0.05);
    this.addChild(this.clock);
    this.visible = false;
  }

  layoutContent() {
    if (this.game != null) {
      this.pauseButton.x = this.game.realWidth / 2;
      this.pauseButton.y = -this.game.realHeight / 2;
      this.clock.y = -this.game.realHeight / 2;
    }
    this.clock.x = 0;
  }

  show() {
    this.visible = true;
  }

  pauseClicked() {
    console.log("pause");
    this.game.level.togglePause();
  }
}

export = LevelUI;
