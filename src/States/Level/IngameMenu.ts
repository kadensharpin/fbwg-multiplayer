import { Game, Graphics, Group, Sprite } from "@azerion/phaser";

class IngameMenu extends Group {
  options: any;
  background: Graphics;
  board: Sprite;
  boardBg: Sprite;
  target: any;
  outside: any;
  force: number;
  vy: number;
  ay: number;
  friction: number;
  shown: any;
  center: any;
  contentSize!: {
    width: number;
    height: number;
    halfWidth: number;
    halfHeight: number;
  };
  constructor(game: Game, options: any) {
    super(game);

    this.destroy = this.destroy.bind(this);
    this.update = this.update.bind(this);
    this.fixToCamera = this.fixToCamera.bind(this);
    this.layoutContent = this.layoutContent.bind(this);
    this.renderContent = this.renderContent.bind(this);

    this.options = options;
    this.background = game.make.graphics(0, 0);
    this.background.boundsPadding = 0;
    this.addChild(this.background);
    this.board = game.make.sprite(0, 0, "PopupAssets", "_default0000");
    this.board.anchor.set(0.5);
    this.boardBg = game.make.sprite(0, 0, "PopupAssets", "PopupBackground0000");
    this.boardBg.anchor.set(0.5);
    this.boardBg.cacheAsBitmap = true;
    this.board.addChild(this.boardBg);
    this.addChild(this.board);
    game.TouchManager.register(this.background, "mousedown", () =>
      console.log("prevent event"),
    );
    game.TouchManager.register(this.background, "touchstart", () =>
      console.log("prevent event"),
    );
    this.visible = false;
    this.game.add.existing(this);
    this.fixToCamera();
    this.target = this.outside;
    this.force = 2.3;
    this.vy = 0;
    this.ay = 0;
    this.friction = 0.7;
    this.board.x = this.target.x;
    this.board.y = this.target.y;
    setTimeout(() => this.renderContent());
  }

  renderContent() {}
  layoutContent() {
    this.fixToCamera();
    this.target = this.shown ? this.center : this.outside;
    this.board.x = this.target.x;
  }
  show() {
    this.target = this.center;
    this.shown = true;
    this.visible = true;
  }
  hide() {
    this.shown = false;
    this.target = this.outside;
  }
  fixToCamera() {
    this.x = -this.game.realWidth / 2;
    this.y = -this.game.realHeight / 2;
    this.background.clear();
    this.background.beginFill(0);
    this.background.drawRect(0, 0, this.game.realWidth, this.game.realHeight);
    this.background.alpha = 0;
    const scale = Math.min(
      1,
      Math.min(
        this.game.realWidth / this.boardBg.texture.frame.width,
        this.game.realHeight / this.boardBg.texture.frame.height,
      ),
    );
    this.board.scale.set(scale);
    const width = 0.8 * this.boardBg.width;
    const height = this.boardBg.height;
    this.contentSize = {
      width,
      height,
      halfWidth: width / 2,
      halfHeight: height / 2,
    };
    this.center = {
      x: this.game.realWidth / 2,
      y: this.game.realHeight / 2,
    };
    this.outside = {
      x: this.game.realWidth / 2,
      y: 1.5 * this.game.realHeight,
    };
  }
  update() {
    if (!this.visible) return;
    this.background.alpha =
      0.7 *
      (1 - (this.board.y - this.center.y) / (this.outside.y - this.center.y));
    if (Math.abs(this.board.y - this.target.y) < 1 && Math.abs(this.vy) < 1)
      return;
    const a = Math.min(0.04, this.game.time.elapsed / 1e3);
    this.ay = (this.target.y - this.board.y) * this.force * a;
    this.vy += this.ay;
    this.vy *= this.friction;
    this.board.y += this.vy;
    if (Math.abs(this.board.y - this.outside.y) < 3) this.visible = false;
  }
  destroy(destroyChildren?: boolean, soft?: boolean) {
    this.background.clear();
    this.visible = false;
    return super.destroy(destroyChildren, soft);
  }
}

export default IngameMenu;

declare module "@azerion/phaser" {
  interface Game {
    realWidth: number;
    realHeight: number;
  }
}
