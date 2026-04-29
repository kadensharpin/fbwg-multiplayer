/// <amd-module name="States/Settings/ToggleSettingButton" />

import { Game } from "@azerion/phaser";
import Button from "../Common/Button";

class ToggleSettingButton<T> extends Button {
  textureId: string;
  constructor(
    game: Game,
    x: number,
    y: number,
    textureId: string,
    ref: T,
    onClick: (ref: T) => void,
  ) {
    super(
      game,
      x,
      y,
      "MenuAssets",
      [textureId + "0000", textureId + "0000"],
      () => onClick(ref),
      "pusher",
    );
    this.setSelected = this.setSelected.bind(this);
    this.textureId = textureId;
    this.anchor.set(0.5);
  }
  setSelected(selected: boolean) {
    if (selected) {
      this.downFrameName = this.textureId + "0000";
      this.upFrameName = this.textureId + "0000";
    } else {
      this.downFrameName = this.textureId + "0001";
      this.upFrameName = this.textureId + "0001";
    }
    this.sprite!.frameName = this.upFrameName!;
  }
}

export = ToggleSettingButton;
