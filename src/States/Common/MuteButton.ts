/// <amd-module name="States/Common/MuteButton" />

import { Game } from "@azerion/phaser";
import Button from "./Button";

class MuteButton extends Button {
  constructor(
    game: Game,
    x: number,
    y: number,
    textureFile: any = "MenuAssets",
  ) {
    super(
      game,
      x,
      y,
      textureFile,
      "MuteButton0000",
      () => this.updateState(),
      null,
    );
    this.updateState = this.updateState.bind(this);
    this.anchor.set(0.5);
    this.sprite!.anchor.set(1, 0);
    this.updateState();
  }
  updateState() {
    this.sprite!.frameName = this.game.sound.mute
      ? "MuteButton0001"
      : "MuteButton0000";
  }
}

export = MuteButton;
