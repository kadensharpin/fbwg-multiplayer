import { NamespaceStorage } from "@/utils/storage/NamespaceStorage";
import { CacheBuster } from "@/utils/util";
import { Game, State } from "phaser";
import ProgressModel from "../ProgressModel";
import MultiMenu from "./Menu/MultiMenu";
import SingleMenu from "./Menu/SingleMenu";

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

const altasses: [key: string, atlasImage: string, altasData: string][] = [
  [
    "PreloaderAssets",
    "assets/atlasses/PreloaderAssets.png",
    "assets/atlasses/PreloaderAssets.json",
  ],
  [
    "MenuAssets",
    "assets/atlasses/MenuAssets.png",
    "assets/atlasses/MenuAssets.json",
  ],
  [
    "PopupAssets",
    "assets/atlasses/PopupAssets.png",
    "assets/atlasses/PopupAssets.json",
  ],
  [
    "MenuBackgrounds",
    "assets/atlasses/MenuBackgrounds.png",
    "assets/atlasses/MenuBackgrounds.json",
  ],
  [
    "CharAssets",
    "assets/atlasses/CharAssets.png",
    "assets/atlasses/CharAssets.json",
  ],
  [
    "PopupAssets",
    "assets/atlasses/PopupAssets.png",
    "assets/atlasses/PopupAssets.json",
  ],
  [
    "GroundAssets",
    "assets/atlasses/GroundAssets.png",
    "assets/atlasses/GroundAssets.json",
  ],
  [
    "CharAssets",
    "assets/atlasses/CharAssets.png",
    "assets/atlasses/CharAssets.json",
  ],
  [
    "MechAssets",
    "assets/atlasses/MechAssets.png",
    "assets/atlasses/MechAssets.json",
  ],
];

const fonts: [key: string, fontImage: string, fontData: string][] = [
  ["font_en", "assets/fonts/font.png", "assets/fonts/font.fnt"],
  [
    "font_ru",
    "assets/fonts/fbwg_font_cyrillic.png",
    "assets/fonts/fbwg_font_cyrillic.fnt",
  ],
];

const images: [key: string, image: string][] = [
  ["HallBeam", "assets/images/Beam.png"],
  ["ios-store", "assets/images/stores/ios.png"],
  ["android-store", "assets/images/stores/android.png"],
  ["microsoft-store", "assets/images/stores/microsoft.png"],
  ["steam-store", "assets/images/stores/steam.png"],
];

const json: [key: string, json: string][] = [
  ["Ground", "assets/tilemaps/tilesets/Ground.json"],
  ["Objects", "assets/tilemaps/tilesets/Objects.json"],
  ["LargeObjects", "assets/tilemaps/tilesets/LargeObjects.json"],
  ["Chars", "assets/tilemaps/tilesets/Chars.json"],
];

class Load extends State {
  private originalProcessPack!: (pack: any) => void;

  preload() {
    console.log("Preloading Boot State");

    this.originalProcessPack = this.load.processPack;
    this.load.processPack = this.processPack.bind(this);
    this.load.crossOrigin = "anonymous";

    this.load.pack("gameConfig", "game.json");
    for (const [key, atlasImage, altasData] of altasses) {
      this.load.atlasJSONArray(key, atlasImage, altasData);
    }
    for (const [key, fontImage, fontData] of fonts) {
      this.load.bitmapFont(key, fontImage, fontData);
    }
    for (const [key, image] of images) {
      this.load.image(key, image);
    }
    for (const [key, url] of json) {
      this.load.json(key, url);
    }
    for (const sound of sounds) {
      const Sound = sound.charAt(0).toUpperCase() + sound.slice(1);
      this.load.audio(sound, "assets/audio/" + Sound + ".mp3");
    }
  }

  async create() {
    this.game.plugins.add(CacheBuster);
    this.game.storage = new NamespaceStorage();

    this.game.loadSettings();
    this.game.sound.mute = !this.game.settings.fx;

    this.game.progress = new ProgressModel(this.game);
    await this.game.progress.fetch();

    if (this.game.gameConfig.type === "multi") {
      this.game.state.add("menu", MultiMenu);
    } else {
      this.game.state.add("menu", SingleMenu);
    }

    this.game.state.fade("menu");
  }

  processPack(pack: {
    type: "packfile";
    key: string;
    url: string;
    path: string;
    syncPoint: boolean;
    data: any;
    loading: boolean;
    loaded: boolean;
    error: boolean;
    callbackContext: any;
  }) {
    if (pack.key != "gameConfig") return this.originalProcessPack(pack);
    this.load.processPack = this.originalProcessPack;

    this.game.gameConfig = pack.data as Game["gameConfig"];
    document.title = this.game.gameConfig.title.replace("&amp;", "&");

    const assets = Array.isArray(this.game.gameConfig.assets)
      ? this.game.gameConfig.assets
      : [this.game.gameConfig.assets];
    if (assets.length === 0) {
    } else if (this.game.gameConfig.type === "multi") {
      this.load.atlasJSONArray(
        "TempleIcons",
        "assets/atlasses/TempleIcons.png",
        "assets/atlasses/TempleIcons.json",
      );
      for (const temple of assets) {
        const Temple = temple.charAt(0).toUpperCase() + temple.slice(1);
        this.load.image(
          "TempleHall" + Temple,
          "assets/images/TempleHall" + Temple + ".jpg",
        );
      }
      this.load.image("GameName", "assets/images/GameNameElements.png");
    } else {
      const temple = assets[0]!;
      let Temple = temple.charAt(0).toUpperCase() + temple.slice(1);
      this.load.image(
        "TempleHall",
        "assets/images/TempleHall" + Temple + ".jpg",
      );
      this.load.image("GameName", "assets/images/GameName" + Temple + ".png");
    }
    for (const asset of assets) {
      this.load.atlasJSONArray(
        "TempleAssets",
        "assets/atlasses/Temples/" + asset + "/TempleAssets.png",
        "assets/atlasses/Temples/" + asset + "/TempleAssets.json",
      );
    }
  }
}

export default Load;
