import { Game, Group, PIXI, Rectangle, Sprite } from "phaser";

class LoaderBar extends Group {
  constructor(game: Game, parent: PIXI.DisplayObjectContainer, name?: string) {
    super(game, parent, name);

    const bar = this.game.make.sprite(0, 0, "PreloaderAssets", "LoaderBar0000");
    bar.x = -100;
    bar.y = -10;
    this.addChild(bar);
    const rect = new Rectangle(0, 0, 0, 20);
    bar.crop(rect, false);
    const holder = new Sprite(
      this.game,
      0,
      0,
      "PreloaderAssets",
      "LoaderHolder0000",
    );
    holder.anchor.set(0.5);
    this.addChild(holder);
    const title = new Sprite(
      this.game,
      0,
      -80,
      "PreloaderAssets",
      "LoaderTitle0000",
    );
    title.anchor.set(0.47);
    this.addChild(title);
    const onFileComplete = (percent: number) => {
      if (window.parent != null) {
        const progress = {
          bytesLoaded: percent,
          bytesTotal: 100,
        };
        window.parent.postMessage(progress, "*");
      }
      rect.width = (percent / 100) * 200;
      bar.crop(rect, false);
    };
    const onLoadComplete = () => {
      this.game.load.onFileComplete.remove(onFileComplete);
      this.game.load.onLoadComplete.remove(onLoadComplete);
      this.destroy();
    };
    this.game.load.onFileComplete.add(onFileComplete);
    this.game.load.onLoadComplete.add(onLoadComplete);
  }
}

export default LoaderBar;
