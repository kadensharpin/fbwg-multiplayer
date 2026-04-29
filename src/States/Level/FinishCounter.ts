/// <amd-module name="States/Level/FinishCounter" />

import { Game, Group, Sprite } from "@azerion/phaser";

class FinishCounter extends Group {
  achieved: Sprite;
  constructor(game: Game, unusedText: string, textureId: string) {
    super(game);
    this.setAchieved = this.setAchieved.bind(this);
    const sprite = this.game.make.sprite(0, 0, "PopupAssets", textureId);
    sprite.anchor.set(0.5, 0.5);
    sprite.x = -sprite.width / 2;
    this.addChild(sprite);
    if (unusedText) {
      const g = this.game.make.bitmapText(0, 0, "font_en", unusedText, 20);
      g.anchor.set(0.5, 0.5);
      g.x = -sprite.width / 2;
      g.y = 40;
      this.addChild(g);
    }
    this.achieved = this.game.make.sprite(0, 0, "PopupAssets", "TickIcon0000");
    this.achieved.anchor.set(0.5, 0.5);
    this.achieved.x = sprite.width / 2;
    this.achieved.visible = false;
    this.addChild(this.achieved);
  }

  setAchieved(success: boolean) {
    this.achieved.frameName = success ? "TickIcon0000" : "CrossIcon0000";
    this.achieved.visible = true;
  }
}

export = FinishCounter;
