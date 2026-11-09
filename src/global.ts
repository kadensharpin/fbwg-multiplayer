import bowser from "bowser";
import { i18n } from "i18next";
import GameLogic from "./GameLogic";
import ProgressModel from "./ProgressModel";
import CharCursors from "./States/Level/CharCursors";
import CursorToggle from "./States/Level/CursorToggle";
import Beamer from "./States/Level/Devices/Beamer";
import Liquid from "./States/Level/Devices/Liquid";
import Portal from "./States/Level/Devices/Portal";
import Snow from "./States/Level/Devices/Snow";
import Level from "./States/Level/Level";
import LevelUI from "./States/Level/LevelUI";
import MechManager from "./States/Level/MechManager";
import Transitions from "./States/Transitions";
import { Temple } from "./temple";
import type TouchManager from "./TouchManager";
import { SimpleFixture, SimpleFixtureDef } from "./utils/Fixture";
import Lang from "./utils/lang/Lang";
import { Sounds } from "./utils/sound/sounds";
import { NamespaceStorage } from "./utils/storage/NamespaceStorage";

declare module "phaser" {
  interface IGameConfig {
    showFps: boolean;
    devUnlock: boolean;
    simulateCordova: boolean;
    multiTexture: boolean;
    log: boolean;
  }

  interface Camera {
    _shake: { duration: number };
  }

  interface Game {
    bowser: bowser.IBowser;
    TouchManager: TouchManager;
    MechManager: MechManager;
    lang: Lang;
    transitions: Transitions;
    progress: ProgressModel;
    logic: GameLogic;
    bounds: Rectangle;
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
      liquids: Omit<Group, "children"> & {
        update(): void;
        children: (Liquid | Snow | Portal)[];
      };
      dust: Omit<Group, "children"> & {
        sources: Beamer[];
        maskGraphics: Graphics;
        children: Sprite[];
      };
      ui: Omit<Group, "children"> & {
        update(): void;
        alpha: number;
        children: (LevelUI | CharCursors | CursorToggle)[];
      };
      darkGradients?: Group & {
        update(): void;
      };
    };
    level: Level;
    storage: NamespaceStorage;
    currentSounds: Sounds;
    menuMusic?: Sound | undefined | null;
    currentTemple: Temple;
    gameConfig: {
      id: string;
      type: "legacy" | "multi";
      assets: string | string[];
      temples: string | string[];
      title: string;
      target: null | "cordova";
    };
  }

  namespace PIXI {
    interface RenderSession {
      resolution: number;
    }
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
}

declare module "@box2d/core" {
  interface b2Body {
    SetPosition(pos: b2Vec2): void;
    SetPositionXY(x: number, y: number): void;
    CreateFixture<T>(def: SimpleFixtureDef<T>): SimpleFixture<T>;
  }
  interface b2Vec2 {
    SelfNormalize(): this;
    SelfCrossSV(s: number): this;
    SelfCrossVS(s: number): this;
  }
}
