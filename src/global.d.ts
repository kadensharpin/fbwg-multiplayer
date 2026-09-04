import bowser from "bowser";
import { i18n } from "i18next";
import PhaserSuperStorage from "phaser-super-storage";
import ProgressModel from "./ProgressModel";
import Beamer from "./States/Level/Devices/Beamer";
import { Level } from "./States/Level/level";
import { Temple } from "./temple";
import type TouchManager from "./TouchManager";
import Lang from "./utils/lang/Lang";
import { Sounds } from "./utils/sound/sounds";
import MechManager = require("./States/Level/MechManager");

declare module "@azerion/phaser" {
  interface IGameConfig {
    devUnlock: boolean;
  }

  interface Game {
    bowser: bowser.IBowser;
    TouchManager: TouchManager;
    MechManager: MechManager;
    lang: Lang;
    progress: ProgressModel;
    layers: {
      background: Group;
      tutorial: Group;
      underGround: Group;
      lights: Group;
      ground: Group;
      overGround: Group;
      chars: Group;
      overChars: Group;
      decorations: Group;
      liquids: Group & { update(): void };
      dust: Group & { sources: Beamer[] };
      ui: Group & {
        update(): void;
        alpha: number;
      };
    };
    level: Level;
    storage: PhaserSuperStorage.StoragePlugin;
    currentSounds: Sounds;
    menuMusic?: Sound | undefined | null;
    currentTemple: Temple;
    gameConfig: {
      id: string | string[];
      type: "legacy" | "multi";
      assets: string | string[];
      temples: string | string[];
      title: string;
    };
  }
}

declare global {
  interface Window {
    i18next: i18n;

    Devices: {
      BackgroundCover: typeof import("./States/Level/Devices/BackgroundCover");
      Ball: typeof import("./States/Level/Devices/Ball");
      Beamer: typeof import("./States/Level/Devices/Beamer");
      Box: typeof import("./States/Level/Devices/Box");
      BoxedDevice: typeof import("./States/Level/Devices/BoxedDevice");
      BoxHeavy: typeof import("./States/Level/Devices/BoxHeavy");
      BoxMirror: typeof import("./States/Level/Devices/BoxMirror");
      BoxPrototype: typeof import("./States/Level/Devices/BoxPrototype");
      Device: typeof import("./States/Level/Devices/Device");
      Diamond: typeof import("./States/Level/Devices/Diamond");
      Door: typeof import("./States/Level/Devices/Door");
      Hanging: typeof import("./States/Level/Devices/Hanging");
      InfiniteMirror: typeof import("./States/Level/Devices/InfiniteMirror");
      Lever: typeof import("./States/Level/Devices/Lever");
      LightPusher: typeof import("./States/Level/Devices/LightPusher");
      Liquid: typeof import("./States/Level/Devices/Liquid");
      MovingPlatform: typeof import("./States/Level/Devices/MovingPlatform");
      Portal: typeof import("./States/Level/Devices/Portal");
      Pulley: typeof import("./States/Level/Devices/Pulley");
      Pusher: typeof import("./States/Level/Devices/Pusher");
      Roman: typeof import("./States/Level/Devices/Roman");
      RotMirror: typeof import("./States/Level/Devices/RotMirror");
      Slider: typeof import("./States/Level/Devices/Slider");
      Snow: typeof import("./States/Level/Devices/Snow");
      TimedPusher: typeof import("./States/Level/Devices/TimedPusher");
      Wind: typeof import("./States/Level/Devices/Wind");
      Window: typeof import("./States/Level/Devices/Window");
    };
  }

  namespace box2d {
    interface b2Fixture {
      id: number;
    }
  }
}
