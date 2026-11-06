import { PIXI } from "phaser";
import { LevelData, Temple } from "../../temple";
import BuyMenu from "../Buy/BuyMenu";
import Button from "../Common/Button";
import GoldButton from "../Common/GoldButton";
import UIState from "../Common/UIState";
import CreditsMenu from "../Credits/CreditsMenu";
import Level from "../Level/Level";
import LevelMenu from "../LevelMenu/LevelMenu";
import SettingsMenu from "../Settings/SettingsMenu";

class Menu extends UIState {
  settingsButton?: Button;
  creditsBtn?: GoldButton;
  unlockButton?: Button;
  appStoreButtons?: Button[];
  currentMenu?: SettingsMenu | CreditsMenu | BuyMenu | null;

  constructor() {
    super();

    this.layoutContent = this.layoutContent.bind(this);
    this.skipToLevel = this.skipToLevel.bind(this);
    this.startTemple = this.startTemple.bind(this);
    this.showBuy = this.showBuy.bind(this);
    this.showCredits = this.showCredits.bind(this);
    this.showSettings = this.showSettings.bind(this);
    this.afterAddContent = this.afterAddContent.bind(this);
    this.preload = this.preload.bind(this);
  }

  layoutContent() {
    super.layoutContent();
    if (this.appStoreButtons != null && this.appStoreButtons.length > 0) {
      let i = 0;
      for (const button of this.appStoreButtons) {
        if ((this.game.realWidth - 800) / 2 < 120) {
          button.scale.set(0.4);
        } else if ((this.game.realWidth - 800) / 2 < 180) {
          button.scale.set(0.45);
        } else {
          button.scale.set(0.6);
        }
        button.x = this.game.realWidth / 2 - 20;
        button.y = this.game.realHeight / 2 - 20 - i++ * button.height;
      }
    }
    if (this.settingsButton != null) {
      this.settingsButton.x = -this.game.realWidth / 2 + 100;
      this.settingsButton.y = this.game.realHeight / 2 - 100;
      if (this.game.realWidth <= 900) {
        this.settingsButton.x = -this.game.realWidth / 2 + 50;
      }
    }
    if (this.creditsBtn != null) {
      this.creditsBtn.x = -this.game.realWidth / 2 + 200;
      this.creditsBtn.y = this.game.realHeight / 2 - 100;
    }
    this.currentMenu?.layoutContent();
  }

  afterAddContent() {
    if (
      this.game.gameConfig.target === "cordova" ||
      this.game.config.simulateCordova
    ) {
      this.unlockButton = new Button(
        this.game,
        this.game.realWidth / 2 - 100,
        this.game.realHeight / 2 - 100,
        "MenuAssets",
        "UnlockButton0000",
        this.showBuy,
        "pusher",
      );
      this.root?.addChild(this.unlockButton);
    } else {
      this.appStoreButtons = [
        {
          image: "microsoft-store",
          url: "https://www.microsoft.com/store/apps/9NSP5N3B7Q32",
        },
        {
          image: "android-store",
          url: "https://play.google.com/store/apps/details?id=com.osloalbet.fb",
        },
        {
          image: "ios-store",
          url: "https://itunes.apple.com/app/apple-store/id1446352801",
        },
        {
          image: "steam-store",
          url: "https://store.steampowered.com/app/1003480/Fireboy__Watergirl_Elements/",
        },
      ].map((store) => {
        const onClick = (_button: Button) => window.open(store.url, "_blank");
        const storeButton = new Button(
          this.game,
          0,
          0,
          store.image,
          null,
          onClick,
          "pusher",
        );
        storeButton.anchor.set(1);
        this.root?.addChild(storeButton);
        return storeButton;
      });
    }
    const buttonFrames: [upFrame: string, downFrame: string] =
      this.game.gameConfig.type === "multi"
        ? ["SettingsButton0000", "SettingsButton0001"]
        : ["SettingsButton0002", "SettingsButton0003"];
    this.settingsButton = new Button(
      this.game,
      -this.game.realWidth / 2 + 100,
      this.game.realHeight / 2 - 100,
      "MenuAssets",
      buttonFrames,
      this.showSettings,
      "pusher",
    );
    this.root?.addChild(this.settingsButton);
    this.creditsBtn = new GoldButton(
      this.game,
      this.game.realWidth / 2 - 40,
      -this.game.realHeight / 2 + 40,
      "?",
      this.showCredits,
      30,
    );
    this.creditsBtn.hitArea = new PIXI.Circle(0, 0, this.creditsBtn.width * 3);
    this.root?.addChild(this.creditsBtn);
    this.layoutContent();
  }

  showSettings() {
    const settings = new SettingsMenu(this.game, {});
    settings.show();
    this.currentMenu = settings;
    settings.onClose.add(() => {
      settings.destroy();
      this.currentMenu = null;
    });
  }

  showCredits() {
    const credits = new CreditsMenu(this.game, {});
    credits.show();
    this.currentMenu = credits;
    credits.onClose.add(() => {
      credits.destroy();
      this.currentMenu = null;
    });
  }

  showBuy() {
    const buy = new BuyMenu(this.game, {});
    buy.show();
    this.currentMenu = buy;
    buy.onClose.add(() => {
      buy.destroy();
      this.currentMenu = null;
    });
  }

  startTemple(temple: Temple) {
    this.game.state.add("levelMenu", LevelMenu);
    this.game.state.fade("levelMenu", true, false, temple);
  }

  skipToLevel(
    level: LevelData = {
      id: 0,
      filename: "",
      required: 0,
    } as LevelData,
  ) {
    this.game.state.add("level", Level);
    this.game.state.fade("level", true, false, level);
  }
}

export default Menu;
