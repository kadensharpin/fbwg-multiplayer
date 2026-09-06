/// <amd-module name="States/LevelMenu/LevelMenuButtons" />

import {
  BitmapData,
  BitmapText,
  Filter,
  Game,
  Image,
  RenderTexture,
  Signal,
  Sprite,
  Text,
} from "@azerion/phaser";
import BevelFilter from "../../filters/BevelFilter";
import ColorMatrix from "../../filters/ColorMatrix";
import OutlineFilter from "../../filters/OutlineFilter";
import { LevelState, Temple } from "../../temple";
import BuyMenu from "../Buy/BuyMenu";
import RewardedAdMenu from "../Common/RewardedAdMenu";
import SoftLockMenu from "../Common/SoftLockMenu";
import LevelButton from "./LevelButton";

class LevelMenuButtons extends Sprite {
  onClick: Signal;
  templeData: Temple;
  currentMenu: null | RewardedAdMenu | SoftLockMenu | BuyMenu;
  /** All light gray connectors */
  imageAll?: Image;
  /** Connectors background */
  imageAllBig?: Image;
  /** Yellow connectors */
  imageDone?: Image;
  /** Toggle-able Level Numbers */
  numbers?: Text[];

  constructor(game: Game, templeData: Temple) {
    super(game, 0, 0);

    this.buttonClick = this.buttonClick.bind(this);
    this.toggleNumbers = this.toggleNumbers.bind(this);
    this.destroy = this.destroy.bind(this);
    this.layoutContent = this.layoutContent.bind(this);
    this.showPopup = this.showPopup.bind(this);

    this.onClick = new Signal();
    this.templeData = templeData;
    this.currentMenu = null;
    this.addContent();
  }

  addContent() {
    const imageHeight = this.game.realHeight * 0.9;
    const imageWidth = Math.min(imageHeight * 1.2, this.game.realWidth * 0.9);
    const menuScale = Math.min(imageHeight, imageWidth) < 800 ? 0.5 : 0.6;
    const findLevel = (id: number) =>
      this.templeData.levels.find((level) => level._id === id);
    const makeImage = (isBig: boolean, scale = 1) => {
      const bmd = this.game.add.bitmapData(imageWidth, imageHeight);
      bmd.ctx.strokeStyle = this.templeData.color;
      bmd.ctx.lineWidth = menuScale * 16;
      for (const edge of this.templeData.edges) {
        const source = findLevel(edge.source);
        const target = findLevel(edge.target);
        if (!source || !target) continue;
        if (isBig || source.state + target.state > 2) {
          bmd.ctx.moveTo(source.x * imageWidth, source.y * imageHeight);
          bmd.ctx.lineTo(target.x * imageWidth, target.y * imageHeight);
          bmd.ctx.stroke();
        }
      }
      for (const level of this.templeData.levels) {
        if (isBig || level.state > 0 || level.rewarded) {
          const asset =
            level.type === "puzzle"
              ? "DiamondPuzzle_Bkg_Mask"
              : level.type === "speed"
                ? "DiamondSpeed_Bkg_Mask"
                : level.type === "dark"
                  ? "DiamondDark_Bkg_Mask"
                  : "Diamond_Bkg_Mask";
          const sprite = this.game.make.sprite(
            0,
            0,
            "MenuAssets",
            asset + "0000",
          );
          sprite.scale.set(menuScale * scale);
          bmd.draw(
            sprite,
            level.x * imageWidth - sprite.width / 2,
            level.y * imageHeight - sprite.height / 2,
          );
        }
      }
      return this.game.make.image(0, 0, bmd);
    };
    this.imageAll = makeImage(true);
    this.imageAllBig = makeImage(true, 1.2);
    this.imageDone = makeImage(false);
    const filterDone = new BevelFilter(
      this.game,
      imageWidth,
      imageHeight,
      180,
      0,
      0,
      1,
    );
    filterDone.init();
    const filterAll = new BevelFilter(
      this.game,
      imageWidth,
      imageHeight,
      200,
      0,
      0,
      -1,
    );
    filterAll.init();
    const filterAllBig = new BevelFilter(
      this.game,
      imageWidth,
      imageHeight,
      200,
      0,
      1,
      1,
    );
    filterAllBig.init();
    const filterDone2 = new ColorMatrix(
      this.game,
      imageWidth,
      imageHeight,
      16766496,
    );
    const filterAll2 = new ColorMatrix(
      this.game,
      imageWidth,
      imageHeight,
      parseInt(this.templeData.color.replace("#", ""), 16),
    );
    const filterAll3 = new OutlineFilter(
      this.game,
      imageWidth,
      imageHeight,
      3,
      0,
    );
    filterAll3.init();
    const createSprite = (image: Image, filters: Filter[]) => {
      image.filters = filters;
      const treeTexture = new RenderTexture(
        this.game,
        imageWidth,
        imageHeight,
        "treeTexture",
        undefined,
        1,
      );
      this.game.renderer.renderSession.resolution = 1;
      treeTexture.renderRawXY(image, 0, 0, true);
      this.game.renderer.renderSession.resolution = this.game.resolution;
      this.game.cache.addRenderTexture("treeTexture", treeTexture);
      const treeSprite = this.game.make.sprite(
        0,
        0,
        this.game.cache.getRenderTexture("treeTexture").texture,
      );
      treeSprite.x = -imageWidth / 2;
      treeSprite.y = -imageHeight / 2;
      this.addChild(treeSprite);
    };
    createSprite(this.imageAllBig, [filterAllBig, filterAll2]);
    createSprite(this.imageAll, [filterAll, filterAll2, filterAll3]);
    createSprite(this.imageDone, [filterDone, filterDone2]);
    (this.imageAll.key as BitmapData).destroy?.();
    (this.imageAllBig.key as BitmapData).destroy();
    (this.imageDone.key as BitmapData).destroy();
    this.imageAll.destroy();
    this.imageAllBig.destroy();
    this.imageDone.destroy();
    const getTexture = (levelState: LevelState): string => {
      switch (levelState) {
        case 0: {
          return "0000";
        }
        case 1: {
          return "0000";
        }
        case 2: {
          return "0001";
        }
        case 3: {
          return "0002";
        }
        case 4: {
          return "0003";
        }
      }
    };
    const newTextGroup = this.game.make.group(0);
    const unusedGroup = this.game.make.group(0);
    this.numbers = [];
    for (const level of this.templeData.levels) {
      const buttonX = level.x * imageWidth - imageWidth / 2;
      const buttonY = level.y * imageHeight - imageHeight / 2;
      if (level.locked) {
        const lock = new Sprite(
          this.game,
          buttonX,
          buttonY,
          "MenuAssets",
          "Lock0000",
        );
        lock.scale.set(menuScale);
        lock.anchor.set(0.5);
        this.addChild(lock);
      } else {
        const onClick =
          level.state > 0 || level.rewarded
            ? this.buttonClick
            : false
              ? (button: LevelButton) =>
                  this.showPopup({
                    type: "rewarded",
                    button: button,
                    buttonClick: this.buttonClick,
                  })
              : () => this.showPopup({ type: "softLock" });
        const levelButton = new LevelButton(
          this.game,
          buttonX,
          buttonY,
          level.type!,
          getTexture(level.state),
          onClick,
        );
        levelButton.scale.set(menuScale);
        levelButton.anchor.set(0.5);
        levelButton.data = level;
        this.addChild(levelButton);
        if (level.state > 0 && level.isNew) {
          const newText = new BitmapText(
            this.game,
            buttonX,
            buttonY,
            this.game.lang.font,
            this.game.lang.locale("new"),
          );
          newText.x += 40;
          newText.y -= 20;
          newText.scale.set(menuScale, menuScale);
          newText.anchor.set(0.5);
          newTextGroup.addChild(newText);
        }
      }
      const levelNumFont = {
        font: "28px Arial",
        fill: "#ffffff",
        fontWeight: "bold",
        stroke: "#000000",
        strokeThickness: 4,
      };
      const levelNumText = this.game.make.text(
        buttonX,
        buttonY + 3,
        level.id.toString(),
        levelNumFont,
      );
      levelNumText.anchor.set(0.5);
      levelNumText.cacheAsBitmap = true;
      levelNumText.visible = false;
      this.addChild(levelNumText);
      this.numbers.push(levelNumText);
    }
    this.addChild(newTextGroup);
    this.addChild(unusedGroup);
  }

  showPopup(
    popup:
      | { type: "buyTemple"; value: Temple }
      | { type: "softLock" }
      | {
          type: "rewarded";
          button: LevelButton;
          buttonClick: (button: LevelButton) => void;
        },
  ) {
    let menu;
    if (this.currentMenu !== null) {
      return;
    }
    console.log("show popup for", popup.type);
    switch (popup.type) {
      case "rewarded": {
        menu = new RewardedAdMenu(this.game, {
          button: popup.button,
          buttonClick: popup.buttonClick,
        });
        break;
      }
      case "softLock": {
        menu = new SoftLockMenu(this.game, { label: "level" });
        break;
      }
      case "buyTemple": {
        menu = new BuyMenu(this.game, {});
        break;
      }
    }
    this.currentMenu = menu;
    menu.show();
    menu.onClose.add(() => {
      this.currentMenu?.destroy();
      this.currentMenu = null;
    });
  }

  layoutContent() {
    this.currentMenu?.layoutContent?.();
  }

  destroy(destroyChildren?: boolean) {
    if (this.currentMenu != null) {
      this.currentMenu.destroy();
    }
    super.destroy(destroyChildren);
  }

  toggleNumbers(visible: boolean) {
    if (!this.numbers) return;
    for (const text of this.numbers) {
      text.visible = visible;
    }
  }

  buttonClick(button: LevelButton) {
    this.onClick.dispatch(button);
  }
}

export = LevelMenuButtons;
