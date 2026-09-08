/// <amd-module name="States/Load" />

import { State } from "@azerion/phaser";
import LevelMenu from "States/LevelMenu/LevelMenu";
import SingleMenu from "States/Menu/SingleMenu";

class Load extends State {
  constructor() {
    super();
  }

  preload() {
    console.log("Loading");
    this.game.load.onFileComplete.add(this.onFileComplete);
    this.game.load.onLoadComplete.add(this.onLoadComplete);
    this.loadAssets();
  }

  startGame() {
    if (this.game.progress.get("temples")[0].levels[0].played) {
      this.game.state.add("levelMenu", LevelMenu);
      this.game.state.start(
        "levelMenu",
        true,
        false,
        this.game.progress.get("temples")[0],
      );
    } else {
      this.game.state.add("menu", SingleMenu);
      this.game.state.start("menu");
    }
    this.game.load.onFileComplete.remove(this.onFileComplete);
    this.game.load.onLoadComplete.remove(this.onLoadComplete);
  }

  onFileComplete(_percent: number) {}

  onLoadComplete(_percent: number) {}

  loadAssets() {
    this.game.load.crossOrigin = "anonymous";
    this.game.load.atlasJSONArray(
      "MenuAssets",
      "assets/atlasses/MenuAssets.png",
      "assets/atlasses/MenuAssets.json",
    );
    this.game.load.atlasJSONArray(
      "PopupAssets",
      "assets/atlasses/PopupAssets.png",
      "assets/atlasses/PopupAssets.json",
    );
    this.game.load.bitmapFont(
      "font_en",
      "assets/fonts/font.png",
      "assets/fonts/font.fnt",
    );
    this.game.load.bitmapFont(
      "font_ru",
      "assets/fonts/fbwg_font_cyrillic.png",
      "assets/fonts/fbwg_font_cyrillic.fnt",
    );
    this.game.load.atlasJSONArray(
      "MenuBackgrounds",
      "assets/atlasses/MenuBackgrounds.png",
      "assets/atlasses/MenuBackgrounds.json",
    );
    const assets = Array.isArray(this.game.gameConfig.assets)
      ? this.game.gameConfig.assets
      : [this.game.gameConfig.assets];
    if (assets.length === 0) {
    } else if (this.game.gameConfig.type === "multi") {
      this.game.load.atlasJSONArray(
        "TempleIcons",
        "assets/atlasses/TempleIcons.png",
        "assets/atlasses/TempleIcons.json",
      );
      for (const temple of assets) {
        const Temple = temple.charAt(0).toUpperCase() + temple.slice(1);
        this.game.load.image(
          "TempleHall" + Temple,
          "assets/images/TempleHall" + Temple + ".jpg",
        );
      }
      this.game.load.image("GameName", "assets/images/GameNameElements.png");
    } else {
      const temple = assets[0]!;
      let Temple = temple.charAt(0).toUpperCase() + temple.slice(1);
      this.game.load.image(
        "TempleHall",
        "assets/images/TempleHall" + Temple + ".jpg",
      );
      this.game.load.image(
        "GameName",
        "assets/images/GameName" + Temple + ".png",
      );
    }
    this.game.load.atlasJSONArray(
      "CharAssets",
      "assets/atlasses/CharAssets.png",
      "assets/atlasses/CharAssets.json",
    );
    this.game.load.image("HallBeam", "assets/images/Beam.png");
    this.game.load.image("ios-store", "assets/images/stores/ios.png");
    this.game.load.image("android-store", "assets/images/stores/android.png");
    this.game.load.image(
      "microsoft-store",
      "assets/images/stores/microsoft.png",
    );
    this.game.load.image("steam-store", "assets/images/stores/steam.png");
    this.game.load.image("skirby-upsell", "assets/images/TOASTER-MINI-new.png");
    this.game.load.atlasJSONArray(
      "PopupAssets",
      "assets/atlasses/PopupAssets.png",
      "assets/atlasses/PopupAssets.json",
    );
    this.game.load.json("Ground", "assets/tilemaps/tilesets/Ground.json");
    this.game.load.json("Objects", "assets/tilemaps/tilesets/Objects.json");
    this.game.load.json(
      "LargeObjects",
      "assets/tilemaps/tilesets/LargeObjects.json",
    );
    this.game.load.json("Chars", "assets/tilemaps/tilesets/Chars.json");
    for (const asset of assets) {
      this.game.load.atlasJSONArray(
        "TempleAssets",
        "assets/atlasses/Temples/" + asset + "/TempleAssets.png",
        "assets/atlasses/Temples/" + asset + "/TempleAssets.json",
      );
    }
    this.game.load.atlasJSONArray(
      "GroundAssets",
      "assets/atlasses/GroundAssets.png",
      "assets/atlasses/GroundAssets.json",
    );
    this.game.load.atlasJSONArray(
      "CharAssets",
      "assets/atlasses/CharAssets.png",
      "assets/atlasses/CharAssets.json",
    );
    this.game.load.atlasJSONArray(
      "MechAssets",
      "assets/atlasses/MechAssets.png",
      "assets/atlasses/MechAssets.json",
    );
    const sounds = [
      "menuMusic",
      "levelMusic_speed",
      "levelMusic_dark",
      "levelMusicFinish_speed",
      "levelMusic",
      "levelMusicOver",
      "levelMusicFinish",
      "charToggle1",
      "charToggle2",
      "endPass",
      "endFail",
      "endDiamond",
      "jump_fb",
      "jump_wg",
      "waterSteps",
      "iceSteps_fb",
      "iceSteps_wg",
      "death",
      "diamond",
      "door",
      "freeze",
      "melt",
      "lever",
      "pusher",
      "platform",
      "wind",
      "portalOpen",
      "portalLoop",
      "portalClose",
      "portalTransport",
      "clock",
      "slider",
      "lightPusher",
    ];
    for (const sound of sounds) {
      const Sound = sound.charAt(0).toUpperCase() + sound.slice(1);
      this.game.load.audio(sound, "assets/audio/" + Sound + ".mp3");
    }
  }

  create() {}
}

export = Load;
