/// <amd-module name="States/Settings/ToggleControlButton" />

import { Animation, Game } from "@azerion/phaser";
import Button from "../Common/Button";

class ToggleControlButton<T> extends Button {
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
    if ("single" === ref) {
      const sprite = game.make.sprite(0, 0, "MenuAssets");
      sprite.anchor.set(0.5);
      const animationFrames = Animation.generateFrameNames(
        "ToggleSingleScreen",
        0,
        12,
        "",
        4,
      );
      sprite.animations.add("forth", animationFrames, 12, false);
      sprite.animations.add(
        "back",
        animationFrames.slice(0).reverse(),
        12,
        false,
      );
      const animate = () => {
        if (null == sprite.animations.play("forth")) return;
        sprite.animations.play("forth").onComplete.add(() => {
          this.game.time.events.add(
            1000,
            () => {
              if (null == sprite.animations.play("back")) return;
              sprite.animations
                .play("back")
                .onComplete.add(() =>
                  this.game.time.events.add(1000, animate, this),
                );
            },
            animate,
            this,
          );
        });
      };
      animate();
      this.addChild(sprite);
    }
  }

  setSelected(selected: boolean) {
    if (selected) {
      this.downFrameName = this.textureId + "0000";
      this.upFrameName = this.textureId + "0000";
    } else {
      this.downFrameName = this.textureId + "0001";
      this.upFrameName = this.textureId + "0001";
    }
    this.sprite!.frameName = this.upFrameName;
  }
}

export = ToggleControlButton;
