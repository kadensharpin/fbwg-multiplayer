import bowser from "bowser";
import {
  AUTO,
  Device,
  Game,
  IGameConfig,
  Rectangle,
  Signal,
  Sound,
  Sprite,
} from "phaser";
import _ from "underscore";
import Boot from "./States/Boot";
import Clock from "./States/Level/Clock";
import Load from "./States/Load";
import TouchManager from "./TouchManager";
import Lang from "./utils/lang/Lang";
import { deepObjectExtend } from "./utils/util";

const defaultSettings = {
  vibrate: false,
  music: true,
  fx: true,
  controls: null,
};

const gameConfig: IGameConfig = {
  width: window.innerWidth,
  height: window.innerHeight,
  renderer: AUTO,
  parent: "container",
  transparent: false,
  multiTexture: false,
  antialias: true,
  resolution: window.devicePixelRatio,
  enableDebug: false,
  showFps: false,
  devUnlock: false,
  simulateCordova: false,
  log: false,
  forceSetTimeOut: false,
};

if (!gameConfig.log) {
  console.log = () => {};
}

const game = new Game(gameConfig);

Device.whenReady(() => {
  game.stage.disableVisibilityChange = true;
  const event =
    game.device.desktop || !game.device.iPad ? "click" : "touchstart";
  document
    .getElementById("container")
    ?.addEventListener(event, (ev) => game.gameResumed(ev));
  game.bowser = bowser;
  game.settingsSignal = new Signal();
  game.settingsSignal.add(
    (setting: "vibrate" | "music" | "fx" | "controls") => {
      if (setting === "fx") {
        if (!game.paused) {
          game.sound.mute = !game.settings.fx;
        }
      }
      if (setting === "music") {
        const state = game.state.states[game.state.current];
        if (state.updateMusic != null) return state.updateMusic();
      }
    },
  );
  game.lang = new Lang();
  game.saveSettings = async function () {
    this.storage.setNamespace("fb-" + this.gameConfig.id);
    return this.storage.setItem("settings", JSON.stringify(this.settings));
  };
  game.loadSettings = async function () {
    this.storage.setNamespace("fb-" + this.gameConfig.id);
    const settings = await this.storage.getItem("settings");
    if (settings) {
      this.settings = JSON.parse(settings);
    } else {
      this.settings = {
        ...defaultSettings,
        controls:
          this.bowser.tablet || this.bowser.mobile || this.device.iPad
            ? "single"
            : "keyboard",
      };
    }
  };
  game.state.add("load", Load);
  game.state.add("boot", Boot);
  game.TouchManager = new TouchManager();
  game.TouchManager.start(game);
  game.state.start("boot");
  const createFadeOverlay = (opts: { showText: boolean }) => {
    const sprite = game.make.sprite(0, 0);
    const graphics = game.make.graphics(0, 0);
    graphics.beginFill(0, 1);
    graphics.drawRect(0, 0, game.realWidth, game.realHeight);
    graphics.endFill();
    sprite.addChild(graphics);
    if (opts.showText) {
      const text = game.make.bitmapText(
        0,
        0,
        game.lang.font,
        game.lang.locale("loading"),
        Math.min(30, 36 / Math.max(1, game.resolution)),
      );
      text.anchor.set(0);
      text.alpha = 0;
      text.x = window.innerWidth / 2 - text.textWidth / 2;
      text.y = window.innerHeight / 2 - text.textHeight / 2;
      sprite.addChild(text);
      // graphics.text = text;
      const startTime = game.time.time;
      const progress = function () {
        const elapsed = game.time.elapsedSince(startTime);
        const alpha = 800;
        if (elapsed > alpha) {
          text.alpha = 1;
        }
        const state = Math.floor((elapsed - alpha) / 300) % 4;
        if (state === 0) {
          text.text = game.lang.locale("loading") + "...";
        }
        if (state === 1) {
          text.text = game.lang.locale("loading");
        }
        if (state === 2) {
          text.text = game.lang.locale("loading") + ".";
        }
        if (state === 3) {
          text.text = game.lang.locale("loading") + "..";
        }
        if (game.state.fading) {
          return requestAnimationFrame(progress);
        }
      };
      requestAnimationFrame(progress);
    }
    game.stage.addChild(sprite);
    return sprite;
  };
  const fadeIn = (overlay: Sprite, onComplete: () => void) => {
    game.paused = false;
    overlay.alpha = 0;
    const animation = game.add.tween(overlay);
    animation.to({ alpha: 1 }, 500);
    animation.onComplete.add(function () {
      game.stage.backgroundColor = "#000000";
      game.tweens.remove(animation);
      return onComplete();
    });
    return animation.start();
  };
  const fadeOut = (overlay: Sprite, onComplete: () => void) => {
    game.stage.backgroundColor = "#000000";
    game.paused = false;
    const animation = game.add.tween(overlay);
    animation.to({ alpha: 0 }, 500);
    animation.onComplete.add(function () {
      game.tweens.remove(animation);
      onComplete();
      return overlay.kill();
    });
    return animation.start();
  };
  game.state.actualFadeToState = function (
    state,
    clearWorld,
    clearCache,
    ...args
  ) {
    this.game.state.start(state, clearWorld, clearCache, ...args);
    this.game.paused = false;
    const onReady = () => {
      this.fading = false;
      if (this.overlay != null) {
        this.overlay?.kill();
      }
      const overlay = createFadeOverlay({
        showText: false,
      });
      this.overlay = overlay;
      overlay.alpha = 1;
      return requestAnimationFrame(() => {
        return fadeOut(overlay, () => {
          this.fading = false;
          this.game.state.states[state].start?.();
        });
      });
    };
    if (this.game.state.states[state].onReady != null) {
      return this.game.state.states[state].onReady.addOnce(onReady);
    } else {
      return requestAnimationFrame(() => onReady());
    }
  };
  game.state.fade = function (state, clearWorld, clearCache, ...args) {
    if (!this.fading) {
      this.fading = true;
      const overlay = createFadeOverlay({
        showText: true,
      });
      this.overlay = overlay;
      return fadeIn(overlay, function () {
        game.state.actualFadeToState(state, clearWorld, clearCache, ...args);
      });
    }
  };
  _.deepObjectExtend = deepObjectExtend;
  game.secondsToString = Clock.secondsToString;
  Sound.prototype.playInstance = function () {
    this.instances ||= 0;
    if (this.instances === 0 || this.loop) {
      this.play();
    } else {
      this.restart();
    }
    this.instances++;
    return this;
  };
  Sound.prototype.stopInstance = function () {
    if (--this.instances === 0) {
      return this.stop();
    }
  };
  const onResize = _.debounce(() => {
    console.log("_resize to height: ", window.innerWidth);
    game.TouchManager.resize();
    game.scale.setGameSize(window.innerWidth, window.innerHeight);
    if (game.width < 800 || game.height < 600) {
      game.camera.scale.set(Math.min(game.width / 800, game.height / 600));
    } else {
      game.camera.scale.set(1, 1);
    }
    game.camera.x = -game.width / 2;
    game.camera.y = -game.height / 2;
    game.realWidth = game.width / game.camera.scale.x;
    game.realHeight = game.height / game.camera.scale.y;
    game.bounds = new Rectangle(0, 0, game.width, game.height);
    game.state.states[game.state.current]?.layoutContent?.();
    return game.camera.update();
  }, 200);
  window.addEventListener("resize", onResize);
  return onResize();
});

declare module "phaser" {
  interface Sound {
    instances: number;

    playInstance(): Sound;

    stopInstance(): void;
  }

  interface StateManager {
    fading?: boolean;
    overlay?: Sprite;

    actualFadeToState(
      state: "level" | "levelMenu" | "menu",
      clearWorld: boolean,
      clearCache: boolean,
      ...args: any[]
    ): void;

    fade(
      state: "level" | "levelMenu" | "menu",
      clearWorld: boolean,
      clearCache: boolean,
      ...args: any[]
    ): void;
  }
}
