import bowser from "bowser";
import { i18n } from "i18next";
import ProgressModel from "./ProgressModel";
import { Temple } from "./temple";
import type TouchManager from "./TouchManager";
import Lang from "./utils/lang/Lang";
import { Sounds } from "./utils/sound/sounds";

declare module "@azerion/phaser" {
  interface IGameConfig {
    devUnlock: boolean;
  }

  interface Game {
    bowser: bowser.IBowser;
    TouchManager: TouchManager;
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
      dust: Group & { sources: [] };
      ui: Group & {
        update(): void;
        alpha: number;
      };
    };
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
  }
}
