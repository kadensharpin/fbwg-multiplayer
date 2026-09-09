import { Game, Sprite } from "@azerion/phaser";

type BackgroundCoverOptions = {
  x: number;
  y: number;
  width: number;
  height: number;
};

class BackgroundCover extends Sprite {
  readonly options: BackgroundCoverOptions;

  constructor(game: Game, options: BackgroundCoverOptions) {
    super(game, options.x, options.y, "MechAssets", "BackgroundCover0000");

    this.options = options;
    this.width = options.width;
    this.height = options.height;

    game.layers.background.addChild(this);
  }
}

export default BackgroundCover;
