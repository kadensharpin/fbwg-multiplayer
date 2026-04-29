import bowser from "bowser";
import { i18n } from "i18next";
import type TouchManager from "./TouchManager";
import Lang from "./utils/lang/Lang";

declare module "@azerion/phaser" {
  interface Game {
    bowser: bowser.IBowser;
    TouchManager: TouchManager;
    lang: Lang;
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
  }
}

declare global {
  interface Window {
    i18next: i18n;
  }
}
