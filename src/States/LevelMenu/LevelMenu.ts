import { BitmapText, TileSprite } from "phaser";
import { Temple } from "../../temple";
import Buy from "../Buy/Buy";
import BackButton from "../Common/BackButton";
import Button from "../Common/Button";
import UIState from "../Common/UIState";
import Complete from "../Complete/Complete";
import Level from "../Level/Level";
import LevelButton from "./LevelButton";
import LevelMenuButtons from "./LevelMenuButtons";

class LevelMenu extends UIState {
  templeData?: Temple;
  divID?: string;
  blockID?: string;
  bkg?: TileSprite;
  back?: BackButton;
  buttons?: LevelMenuButtons;
  showNumBtn?: Button & { numsVisible?: boolean };
  text?: BitmapText;

  constructor() {
    super();

    this.goBack = this.goBack.bind(this);
    this.startLevel = this.startLevel.bind(this);
    this.layoutContent = this.layoutContent.bind(this);
    this.afterAddContent = this.afterAddContent.bind(this);
    this.toggleNumbers = this.toggleNumbers.bind(this);
    this.preload = this.preload.bind(this);
    this.init = this.init.bind(this);
  }

  preload() {
    if (!this.templeData) return;

    super.preload();
    const url = "./assets/atlasses/Temples/" + this.templeData.id;
    this.game.load.atlasJSONArray(
      "TempleAssets",
      url + "/TempleAssets.png",
      url + "/TempleAssets.json",
    );
    if (this.game.device.desktop) {
      this.divID = "rtb-v-1";
      this.blockID = "R-A-800494-9";
    }
  }

  layoutContent() {
    if (!this.bkg || !this.templeData) return;

    super.layoutContent();
    this.bkg.width = this.game.realWidth;
    this.bkg.height = this.game.realHeight;
    this.bkg.x = -this.game.realWidth / 2;
    this.bkg.y = -this.game.realHeight / 2;
    if (this.text != null) {
      if (this.game.realHeight > 800) {
        this.text.fontSize = 38;
        this.text.anchor.set(0, 0.5);
        this.text.y = -this.game.realHeight / 2 + 100;
        this.text.x = 0 - this.text.width / 2;
      } else {
        this.text.fontSize = 32;
        this.text.anchor.set(0, 0.5);
        this.text.x = -this.game.realWidth / 2 + 50;
        this.text.y = -this.game.realHeight / 2 + 50;
      }
    }
    this.resize();
    if (this.back != null) {
      const b = this.back.sprite!.height / 4;
      this.back.x = -this.game.realWidth / 2 + this.back.sprite!.width / 2 + b;
      this.back.y = this.game.realHeight / 2 - this.back.sprite!.height / 2 - b;
    }
    if (this.showNumBtn != null) {
      this.showNumBtn.x =
        this.game.realWidth / 2 - this.showNumBtn.label!.textWidth / 2 - 40;
      this.showNumBtn.y =
        this.game.realHeight / 2 - this.showNumBtn.label!.textHeight / 2 - 40;
    }
    if (this.buttons != null) {
      this.buttons.destroy();
    }
    this.buttons = new LevelMenuButtons(this.game, this.templeData);
    this.buttons.onClick.add(this.startLevel);
    this.root?.addChild(this.buttons);
  }

  init(temple: Temple) {
    if (!this.game.progress.get("temples")[0].levels[0].played) {
      this.game.progress.setPlayed(
        this.game.progress.get("temples")[0].levels[0],
      );
      this.game.state.add("level", Level);
      this.game.state.fade(
        "level",
        true,
        false,
        this.game.progress.get("temples")[0].levels[0],
      );
    }
    this.templeData = temple;
    this.game.currentTemple = temple;
  }

  addContent() {
    if (!this.templeData) return;
    console.log("createing MenuState");
    this.game.stage.backgroundColor = "#000000";
    this.bkg = this.game.make.tileSprite(
      -this.game.realWidth / 2,
      -this.game.realHeight / 2,
      this.game.realWidth,
      this.game.realHeight,
      "TempleAssets",
      "MenuBackground0000",
    );
    this.root?.addChild(this.bkg);
    if (this.templeData?.type === "tree") {
      this.back = new BackButton(
        this.game,
        -this.game.realWidth / 2 + 100,
        this.game.realHeight / 2 - 100,
        this.game.lang.locale("Back"),
        this.goBack,
      );
      this.root?.addChild(this.back);
      this.showNumBtn = new Button(
        this.game,
        0,
        0,
        "",
        "",
        this.toggleNumbers,
        null,
      );
      this.showNumBtn.numsVisible = false;
      const showNumText = this.game.make.bitmapText(
        0,
        0,
        this.game.lang.font,
        this.game.lang.locale("level_numbers"),
        20,
      );
      showNumText.anchor.set(0.5);
      this.showNumBtn.label = showNumText;
      this.showNumBtn.addChild(showNumText);
      this.root?.addChild(this.showNumBtn);
    } else {
      let templeLabel;
      if (this.game.realHeight > 800) {
        templeLabel = this.game.make.bitmapText(
          0,
          -this.game.realHeight / 2 + 120,
          this.game.lang.font,
          this.game.lang.locale(this.templeData.label),
          38,
        );
        templeLabel.anchor.set(0, 0.5);
        templeLabel.y = -this.game.realHeight / 2 + 120;
        templeLabel.x = 0 - templeLabel.width / 2;
      } else {
        templeLabel = this.game.make.bitmapText(
          -this.game.realWidth / 2 + 50,
          -this.game.realHeight / 2 + 50,
          this.game.lang.font,
          this.game.lang.locale(this.templeData.label),
          32,
        );
        templeLabel.anchor.set(0, 0.5);
        templeLabel.x = -this.game.realWidth / 2 + 50;
        templeLabel.y = -this.game.realHeight / 2 + 50;
      }
      this.text = templeLabel;
      this.root?.addChild(templeLabel);
      this.back = this.back = new BackButton(
        this.game,
        -this.game.realWidth / 2 + 100,
        0,
        this.game.lang.locale("Back"),
        this.goBack,
      );
      this.root?.addChild(this.back);
    }
    this.afterAddContent();
    return this.onReady.dispatch();
  }

  toggleNumbers() {
    if (!this.showNumBtn || !this.buttons) return;
    this.showNumBtn.numsVisible = !this.showNumBtn.numsVisible;
    this.buttons.toggleNumbers(this.showNumBtn.numsVisible);
  }

  afterAddContent() {
    if (this.game.progress.firstComplete) {
      this.game.progress.firstComplete = false;
      this.game.state.add("gameComplete", Complete);
      this.game.state.start("gameComplete", false, false, {
        success: true,
      });
    }
    if (
      this.game.gameConfig.target === "cordova" ||
      this.game.config.simulateCordova
    ) {
      const unlockButton = new Button(
        this.game,
        this.game.realWidth / 2 - 100,
        this.game.realHeight / 2 - 100,
        "MenuAssets",
        "UnlockButton0000",
        () => {
          this.game.state.add("buy", Buy);
          this.game.state.start("buy", false, false, {
            success: true,
          });
        },
        null,
      );
      this.root?.addChild(unlockButton);
    }
    return this.layoutContent();
  }

  startLevel(button: LevelButton) {
    this.game.progress.setPlayed(button.data);
    if (this.game.menuMusic != null) {
      this.game.menuMusic.fadeOut(500);
      this.game.menuMusic.onFadeComplete.add((sound) => sound.stop());
    }
    this.game.state.add("level", Level);
    this.game.state.fade(
      "level",
      true,
      false,
      button.data,
      !button.data.rewarded,
    );
  }

  goBack() {
    if (this.game.state.current !== "menu") {
      this.game.state.fade("menu", true, false);
    } else {
      console.log("dasfasdfa");
    }
  }
}

export default LevelMenu;
