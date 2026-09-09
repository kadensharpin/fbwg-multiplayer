import {
  BitmapData,
  Easing,
  Game,
  Group,
  Signal,
  Sprite,
} from "@azerion/phaser";
import _ from "underscore";
import { Temple } from "../../temple";
import BuyMenu from "../Buy/BuyMenu";
import Button from "../Common/Button";
import Navies from "../Common/Navies";
import SoftLockMenu from "../Common/SoftLockMenu";
import TempleSelector from "./TempleSelector";

class MultiHall extends Sprite {
  readonly onStart: Signal;
  private readonly templeSelector: TempleSelector;
  private readonly title: Sprite;
  private readonly navies: Navies;
  private readonly bkg: Group;
  w: number;
  h: number;
  paralaxFactor: number;
  backgroundImages?: Record<string, Sprite>;
  bkgBmd?: BitmapData;
  currentBkg?: Sprite;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y);

    this.destroy = this.destroy.bind(this);
    this.showPopup = this.showPopup.bind(this);
    this.layoutContent = this.layoutContent.bind(this);
    this.update = this.update.bind(this);
    this.drawBackgrounds = this.drawBackgrounds.bind(this);
    this.setBackground = this.setBackground.bind(this);

    this.templeSelector = new TempleSelector(
      this.game,
      0,
      this.game.realHeight / 2,
    );
    this.w = this.game.realWidth;
    this.h = this.game.realHeight;
    this.paralaxFactor = 3;
    this.bkg = this.drawBackgrounds();
    this.addChild(this.bkg);
    this.title = this.game.make.sprite(0, 0, "GameName");
    this.title.anchor.set(0.5, 0.5);
    this.title.cacheAsBitmap = true;
    this.addChild(this.title);
    this.onStart = new Signal();
    this.templeSelector.onTarget.add(_.debounce(this.setBackground, 800));
    this.templeSelector.onSelected.add((temple: Temple) =>
      this.onStart.dispatch(temple),
    );
    this.templeSelector.onShowPopup.add(this.showPopup);
    this.addChild(this.templeSelector);
    this.navies = new Navies(this.game, 0, 0);
    this.addChild(this.navies);
    this.game.time.advancedTiming = true;
    this.setBackground(this.templeSelector.getTarget(), false);
  }

  setBackground(button: Button, fade: boolean | null) {
    fade ??= true;
    const background = this.backgroundImages?.[button.data.id];
    if (this.currentBkg !== background && background) {
      if (fade) {
        background.alpha = 0;
        this.game.add
          .tween(background)
          .to({ alpha: 1 }, 800, Easing.Quadratic.InOut, true)
          .onComplete.add(() => (background.alpha = 1));
      }
      this.currentBkg = background;
      this.bkg.addChild(background);
      this.bkg.bringToTop(background);
    }
  }

  drawBackgrounds() {
    const temples = this.game.progress.get("temples") as Temple[];
    this.backgroundImages = {};
    this.bkgBmd = this.game.make.bitmapData(1366, 768);
    this.bkgBmd.fill(0, 0, 0, 1);
    const blank = this.game.make.sprite(0, 0, this.bkgBmd);
    blank.anchor.set(0.5);
    for (const temple of temples) {
      let background;
      if (temple.locked || temple.softLocked) {
        background = blank;
      } else {
        const asset =
          "TempleHall" + temple.id.charAt(0).toUpperCase() + temple.id.slice(1);
        background = this.game.make.sprite(0, 0, asset);
        background.anchor.set(0.5);
        const scale = Math.max(this.w / 1366, this.h / 768);
        background.scale.set(scale);
        background.cacheAsBitmap = true;
      }
      this.backgroundImages[temple.id] = background;
    }
    return this.game.make.group(0);
  }

  update() {
    if (this.game.config.showFps) {
      const fpsDisplay = document.querySelector<HTMLDivElement>("#debug-fps");
      if (fpsDisplay) {
        fpsDisplay.innerText = this.game.time.fps + "";
      }
    }
    this.templeSelector.update();
    this.navies.update();
  }

  layoutContent() {
    if (!this.backgroundImages) return;
    this.w = this.game.realWidth;
    this.h = this.game.realHeight;
    const scale = Math.max(this.w / 1366, this.h / 768);
    for (const backgroundImage of Object.values(this.backgroundImages)) {
      backgroundImage.scale.set(scale);
      backgroundImage.x = 0;
    }
    this.templeSelector.y = this.game.realHeight / 2;
    this.templeSelector.layoutContent();
    this.title.y =
      -this.game.realHeight / 2 +
      (this.game.realHeight - this.templeSelector.height) / 2 -
      this.title.height / 2;
    this.navies.y =
      this.game.realHeight / 2 - this.templeSelector.strip_height / 2;
  }

  showPopup(options: { type: "softLock" | "buyTemple" }) {
    console.log("show popup for", options.type);
    let menu;
    switch (options.type) {
      case "softLock":
        menu = new SoftLockMenu(this.game, { label: "temple" });
        break;
      case "buyTemple":
        menu = new BuyMenu(this.game, {});
        break;
    }
    menu.show();
    menu.onClose.add(menu.destroy);
  }

  destroy(destroyChildren?: boolean) {
    this.bkgBmd?.destroy();
    super.destroy(destroyChildren);
  }
}

export default MultiHall;
