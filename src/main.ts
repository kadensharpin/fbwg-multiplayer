import { b2Body, b2BodyType, b2Fixture, b2Vec2 } from "@box2d/core";
import bowser from "bowser";
import Phaser, {
  Device,
  Game,
  IGameConfig,
  Physics,
  Rectangle,
  Signal,
  Sound,
} from "phaser";
import _ from "underscore";
import ProgressModel from "./ProgressModel";
import Load from "./States/Load";
import Transitions from "./States/Transitions";
import TouchManager from "./TouchManager";
import Box2D from "./utils/box2d/Box2D";
import Lang from "./utils/lang/Lang";

const defaultSettings = {
  vibrate: false,
  music: true,
  fx: true,
  controls: null,
};

const gameConfig: IGameConfig = {
  width: window.innerWidth,
  height: window.innerHeight,
  renderer: Phaser.AUTO,
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
  // @ts-ignore
  Physics.Box2D = Box2D;
  game.stage.disableVisibilityChange = true;
  const event =
    game.device.desktop || !game.device.iPad ? "click" : "touchstart";
  document
    .getElementById("container")
    ?.addEventListener(event, (ev) => game.gameResumed(ev));
  game.bowser = bowser;
  game.settingsSignal = new Signal();
  game.settingsSignal.add((setting) => {
    if (setting === "fx") {
      if (!game.paused) {
        game.sound.mute = !game.settings.fx;
      }
    }
    if (setting === "music") {
      const state = game.state.states[game.state.current];
      if (state.updateMusic != null) return state.updateMusic();
    }
  });
  game.lang = new Lang();
  game.saveSettings = function () {
    this.storage.namespace = "fb-" + this.gameConfig.id;
    this.storage.setItem("settings", JSON.stringify(this.settings));
  };
  game.loadSettings = function () {
    this.storage.namespace = "fb-" + this.gameConfig.id;
    const settings = this.storage.getItem("settings");
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
  game.camera.reset = function () {
    this.target = null;
    this._shake.duration = 0;
    return this.resetFX();
  };
  game.sound.volume = 0.1;
  game.stage.disableVisibilityChange = true;
  game.onBlur.add(() => {
    game.sound.mute = true;
  });
  game.onPause.add(() => {
    game.sound.mute = true;
  });
  game.onFocus.add(() => {
    game.sound.mute = !game.settings?.fx;
  });
  game.onResume.add(() => {
    game.sound.mute = !game.settings?.fx;
  });
  game.camera.bounds = null;
  const width = 800;
  const height = 600;
  if (game.width < width || game.height < height) {
    game.camera.scale.set(Math.min(game.width / width, game.height / height));
  }
  game.camera.x = -game.width / 2;
  game.camera.y = -game.height / 2;
  game.realWidth = game.width / game.camera.scale.x;
  game.realHeight = game.height / game.camera.scale.y;
  window.addEventListener("keydown", (ev) => {
    if (ev.keyCode === 40 || ev.keyCode === 38) {
      return ev.preventDefault();
    }
  });
  game.progress = new ProgressModel(game);
  game.state.add("load", Load);
  game.TouchManager = new TouchManager(game);
  game.load.baseURL = ProgressModel.lastTemple + "/";
  game.transitions = new Transitions(game);
  game.state.fade = game.transitions.fade;
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
  b2Body.prototype.SetPosition = function (pos) {
    this.SetTransformVec(pos, this.GetAngle());
  };
  b2Body.prototype.SetPositionXY = function (x, y) {
    this.SetTransformXY(x, y, this.GetAngle());
  };
  b2Vec2.prototype.SelfNormalize = function () {
    this.Normalize();
    return this;
  };
  b2Vec2.prototype.SelfCrossSV = function (s) {
    const x = this.x;
    this.x = -s * this.y;
    this.y = s * x;
    return this;
  };
  b2Vec2.prototype.SelfCrossVS = function (s) {
    const x = this.x;
    this.x = s * this.y;
    this.y = -s * x;
    return this;
  };
  const originalResetMassData = b2Body.prototype.ResetMassData;
  b2Body.prototype.ResetMassData = function () {
    originalResetMassData.call(this);
    if (this.GetType() === b2BodyType.b2_dynamicBody && this.GetMass() <= 0) {
      (this as any as Omit<b2Body, "m_mass"> & { m_mass: number }).m_mass = 1;
      (
        this as any as Omit<b2Body, "m_invMass"> & { m_invMass: number }
      ).m_invMass = 1;
    }
  };
  b2Fixture.prototype.SetUserData = function (data) {
    (
      this as any as Omit<b2Fixture, "m_userData"> & { m_userData: any }
    ).m_userData = data;
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
  game.state.start("load");
  return onResize();
});

declare module "phaser" {
  interface Sound {
    instances: number;

    playInstance(): Sound;

    stopInstance(): void;
  }

  interface StateManager {
    fade: Transitions["fade"];
  }
}
