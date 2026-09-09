import { State } from "phaser";
import ProgressModel from "../ProgressModel";
import { CacheBuster } from "../utils/util";
import MultiMenu from "./Menu/MultiMenu";
import SingleMenu from "./Menu/SingleMenu";

class Boot extends State {
  constructor() {
    super();

    this.initialize = this.initialize.bind(this);
    this.loadSettings = this.loadSettings.bind(this);
    this.setStorageAdapter = this.setStorageAdapter.bind(this);
  }

  preload() {
    console.log("Preloading Boot State");
    this.game.load.json("gameConfig", "game.json");
    this.game.load.atlasJSONArray(
      "PreloaderAssets",
      "assets/atlasses/PreloaderAssets.png",
      "assets/atlasses/PreloaderAssets.json",
    );
  }

  async create() {
    // @ts-ignore
    this.game.plugins.add(PhaserSuperStorage.StoragePlugin);
    this.game.plugins.add(CacheBuster);
    this.game.gameConfig = this.game.cache.getJSON("gameConfig");
    await this.setStorageAdapter();
    await this.loadSettings();
    await this.initialize();
    this.game.state.start("load");
  }

  setStorageAdapter() {
    const windowIsTop = () => {
      try {
        return window.self !== window.top;
      } catch (err) {
        return true;
      }
    };
    return new Promise<void>(async (fulfill) => {
      if (windowIsTop()) {
        const iframeStorage =
          new PhaserSuperStorage.StorageAdapters.IframeStorage(
            "",
            document.referrer,
          );
        try {
          await iframeStorage.init();
          this.game.storage.setAdapter(iframeStorage);
        } catch (error) {
          this.game.storage.forcePromises = true;
        }
        fulfill();
      } else {
        this.game.storage.forcePromises = true;
        return fulfill();
      }
    });
  }

  loadSettings() {
    return this.game.loadSettings();
  }

  initialize() {
    this.game.camera.reset = function () {
      this.target = null;
      this._shake.duration = 0;
      return this.resetFX();
    };
    if (this.game.gameConfig.type === "multi") {
      this.game.state.add("menu", MultiMenu);
    } else {
      this.game.state.add("menu", SingleMenu);
    }
    this.game.sound.volume = 0.1;
    this.game.sound.mute = !this.game.settings.fx;
    this.game.stage.disableVisibilityChange = true;
    this.game.onBlur.add(() => {
      this.game.sound.mute = true;
    });
    this.game.onPause.add(() => {
      this.game.sound.mute = true;
    });
    this.game.onFocus.add(() => {
      this.game.sound.mute = !this.game.settings.fx;
    });
    this.game.onResume.add(() => {
      this.game.sound.mute = !this.game.settings.fx;
    });
    this.game.camera.bounds = null;
    const width = 800;
    const height = 600;
    if (this.game.width < width || this.game.height < height) {
      this.game.camera.scale.set(
        Math.min(this.game.width / width, this.game.height / height),
      );
    }
    this.game.camera.x = -this.game.width / 2;
    this.game.camera.y = -this.game.height / 2;
    this.game.realWidth = this.game.width / this.game.camera.scale.x;
    this.game.realHeight = this.game.height / this.game.camera.scale.y;
    this.game.gameConfig.temples = this.game.gameConfig.temples;
    window.addEventListener("keydown", (ev) => {
      if (ev.keyCode === 40 || ev.keyCode === 38) {
        return ev.preventDefault();
      }
    });
    if (this.game.gameConfig.target === "cordova") {
      return new Promise((fulfill) => {
        document.addEventListener(
          "deviceready",
          () => this.doStart().then(fulfill),
          false,
        );
      });
    } else {
      return this.doStart();
    }
  }

  doStart() {
    this.game.progress = new ProgressModel(this.game);
    return new Promise<void>((fulfill) => {
      this.game.progress.on("sync", fulfill);
      this.game.progress.fetch();
    });
  }
}

export default Boot;
