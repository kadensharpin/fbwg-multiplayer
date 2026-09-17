import { Game, Group, Signal, Sprite, TileSprite } from "phaser";
import { Temple } from "../../temple";
import Button from "../Common/Button";

class TempleSelector extends Sprite {
  readonly onSelected: Signal;
  private readonly onMove: Signal;
  readonly onTarget: Signal;
  readonly onShowPopup: Signal;
  private readonly icon_distance: number;
  readonly strip_height: number;
  private readonly strip: Sprite;
  private readonly bs: [Group, Group];
  private readonly icons: Button[];
  private currentX: number;
  private _x: number;
  private v: number;
  private a: number;
  private _anchor: number;
  private lastAnchor?: number;
  private panning: boolean = false;
  private didpan: boolean = false;
  private readonly cover: Sprite;
  private readonly leftSide: TileSprite;
  private readonly rigthSide: TileSprite;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, "MenuBackgrounds", "_default0000");

    this.destroy = this.destroy.bind(this);
    this.layoutContent = this.layoutContent.bind(this);
    this.getTarget = this.getTarget.bind(this);
    this.update = this.update.bind(this);
    this.showBuyTemple = this.showBuyTemple.bind(this);
    this.showSoftLockWarning = this.showSoftLockWarning.bind(this);
    this.templeClicked = this.templeClicked.bind(this);
    this.resize = this.resize.bind(this);
    this.preload = this.preload.bind(this);

    this.onSelected = new Signal();
    this.onMove = new Signal();
    this.onTarget = new Signal();
    this.onShowPopup = new Signal();
    this.icon_distance = 256;
    this.strip_height = 300;
    this.strip = this.game.make.sprite(
      Infinity,
      0,
      "MenuBackgrounds",
      "_default0000",
    );
    this.addChild(this.strip);
    this.bs = [this.game.make.group(), this.game.make.group()];
    const gameWidth = Math.ceil(this.game.realWidth / 256);
    let bsIndex = 0;
    for (const group of this.bs) {
      for (let i = 0; i <= gameWidth; i = ++i) {
        const h = this.game.make.sprite(
          -this.game.realWidth / 2 + i * 255,
          -this.strip_height,
          "MenuBackgrounds",
          "SimpleBackground0000",
        );
        group.addChild(h);
      }
      group.cacheAsBitmap = true;
      group.x = -bsIndex++ * group.width;
      this.strip.addChild(group);
    }
    const temples = game.progress.get("temples") as Temple[];
    this.icons = [];
    for (const temple of temples) {
      const icon = temple.icon || temple.id;
      let button;
      if (temple.locked && !this.game.config.devUnlock) {
        button = new Button(
          game,
          temple.index * this.icon_distance,
          -this.strip_height / 2,
          "TempleIcons",
          [icon + "Icon0000", icon + "Icon0000"],
          () => this.showBuyTemple(temple),
          null,
        );
        const goldLock = new Sprite(
          this.game,
          0,
          0,
          "MenuAssets",
          "GoldLock0000",
        );
        goldLock.scale.set(1);
        goldLock.anchor.set(0.5);
        button.addChild(goldLock);
      } else if (temple.softLocked && !this.game.config.devUnlock) {
        button = new Button(
          game,
          temple.index * this.icon_distance,
          -this.strip_height / 2,
          "TempleIcons",
          [icon + "Icon0000", icon + "Icon0000"],
          this.showSoftLockWarning,
          null,
        );
      } else {
        button = new Button(
          game,
          temple.index * this.icon_distance,
          -this.strip_height / 2,
          "TempleIcons",
          [icon + "Icon0001", icon + "Icon0002"],
          this.templeClicked,
          null,
        );
        if (temple.hasNew) {
          const newText = new Sprite(
            this.game,
            0,
            0,
            "MenuAssets",
            "NewSign0000",
          );
          newText.scale.set(0.7);
          newText.x += 60;
          newText.y -= 60;
          newText.anchor.set(0.5);
          button.addChild(newText);
        }
      }
      button.anchor.set(0.5);
      button.data = temple;
      this.icons.push(button);
      this.strip.addChild(button);
    }
    this.currentX = 0;
    this._x = 0;
    this.v = 0;
    this.a = 0;
    this._anchor = 0;
    game.TouchManager.register(this.strip, "panstart", () => {
      this.panning = true;
    });
    game.TouchManager.register(null, "panmove", (input) => {
      if (this.panning === true) {
        this._x = this.currentX + input.deltaX / game.camera.scale.x;
        this.v = input.overallVelocityX * 10;
      }
    });
    game.TouchManager.register(null, "panend", () => {
      this.panning = false;
      this.didpan = true;
    });
    const holderGroup = this.game.make.group(0);
    this.cover = this.game.make.sprite(
      0,
      50,
      "MenuBackgrounds",
      "SliderHolder0000",
    );
    this.cover.anchor.set(0.5, 1);
    this.leftSide = this.game.make.tileSprite(
      -this.cover.width / 2,
      50,
      (this.game.realWidth - this.cover.width) / 2,
      this.cover.height,
      "MenuBackgrounds",
      "HolderTexture0000",
    );
    this.rigthSide = this.game.make.tileSprite(
      this.cover.width / 2,
      50,
      (this.game.realWidth - this.cover.width) / 2,
      this.cover.height,
      "MenuBackgrounds",
      "HolderTexture0000",
    );
    this.leftSide.anchor.set(1, 1);
    this.rigthSide.anchor.set(0, 1);
    holderGroup.addChild(this.cover);
    holderGroup.addChild(this.leftSide);
    holderGroup.addChild(this.rigthSide);
    this.cover.cacheAsBitmap = true;
    this.leftSide.cacheAsBitmap = true;
    this.rigthSide.cacheAsBitmap = true;
    this.addChild(holderGroup);
    game.TouchManager.register(this.leftSide, "touchstart", () =>
      console.log("prevent event"),
    );
    game.TouchManager.register(this.leftSide, "mousedown", () =>
      console.log("prevent event"),
    );
    game.TouchManager.register(this.leftSide, "panstart", () =>
      console.log("prevent event"),
    );
    game.TouchManager.register(this.rigthSide, "touchstart", () =>
      console.log("prevent event"),
    );
    game.TouchManager.register(this.rigthSide, "mousedown", () =>
      console.log("prevent event"),
    );
    game.TouchManager.register(this.rigthSide, "panstart", () =>
      console.log("prevent event"),
    );
    bsIndex =
      this.game.currentTemple != null ? this.game.currentTemple.index : 0;
    this._x = this._anchor = -this.icon_distance * bsIndex;
  }

  preload() {}

  resize() {
    // this.background.width = this.game.realWidth;
    // this.background.x = -this.game.realWidth / 2;
    this.leftSide.width = (this.game.realWidth - this.cover.width) / 2;
    this.rigthSide.width = (this.game.realWidth - this.cover.width) / 2;
    this.leftSide.x = -this.cover.width / 2;
    this.rigthSide.x = this.cover.width / 2;
  }

  templeClicked(button: Button) {
    if (!this.didpan) {
      this.game.currentSounds.pusher?.play();
      console.log("clicked temple" + button.data.id);
      this.onSelected.dispatch(button.data);
    }
    this.didpan = false;
  }

  showSoftLockWarning() {
    if (!this.didpan) {
      console.log("should trigger to show 'complete more levels'");
      this.onShowPopup.dispatch({ type: "softLock" });
    }
    this.didpan = false;
  }

  showBuyTemple(temple: Temple) {
    if (!this.didpan) {
      console.log("should trigger to show 'buy this temple'");
      this.onShowPopup.dispatch({
        type: "buyTemple",
        value: temple,
      });
    }
    this.didpan = false;
  }

  update() {
    if (this.panning) {
      this.a = 0;
    } else {
      const timeElapsed = Math.min(0.04, this.game.time.elapsed / 1000);
      this.a = (this._anchor - this._x) * timeElapsed * 0.25;
      this.v += this.a;
      this.v *= 0.9;
      this._x += this.v;
      this.currentX = this._x;
    }
    this._anchor =
      this.icon_distance * Math.round(this._x / this.icon_distance);
    for (const icon of this.icons) {
      if (
        icon.x + this._x >=
        ((this.icons.length - 2) / 2 + 1) * this.icon_distance
      ) {
        icon.x -= this.icons.length * this.icon_distance;
      } else if (
        icon.x + this._x <
        -((this.icons.length - 2) / 2 + 1) * this.icon_distance
      ) {
        icon.x += this.icons.length * this.icon_distance;
      }
    }
    for (const bs of this.bs) {
      if (bs.x + this._x > bs.width) {
        bs.x -= bs.width * 2;
      }
      if (bs.x + this._x < -bs.width) {
        bs.x += bs.width * 2;
      }
    }
    if (this.lastAnchor !== this._anchor) {
      this.lastAnchor = this._anchor;
      const k = this.getTarget();
      this.onTarget.dispatch(k);
    }
    if (this.strip.x !== Math.round(this._x)) {
      this.strip.x = Math.round(this._x);
      this.onMove.dispatch();
    }
  }

  getTarget() {
    return this.icons.sort(
      (buttonA, buttonB) =>
        Math.abs(this._x + buttonA.x) - Math.abs(this._x + buttonB.x),
    )[0]!;
  }

  layoutContent() {
    this.leftSide.width = (this.game.realWidth - this.cover.width) / 2;
    this.rigthSide.width = (this.game.realWidth - this.cover.width) / 2;
  }

  destroy(destroyChildren?: boolean) {
    this.game.TouchManager.unregister(this.leftSide, "touchstart");
    this.game.TouchManager.unregister(this.leftSide, "mousedown");
    this.game.TouchManager.unregister(this.leftSide, "panstart");
    this.game.TouchManager.unregister(this.rigthSide, "touchstart");
    this.game.TouchManager.unregister(this.rigthSide, "mousedown");
    this.game.TouchManager.unregister(this.rigthSide, "panstart");
    this.game.TouchManager.unregister(this.strip, "panstart");
    this.game.TouchManager.unregister(null, "panmove");
    this.game.TouchManager.unregister(null, "panend");
    super.destroy(destroyChildren);
  }
}

export default TempleSelector;
