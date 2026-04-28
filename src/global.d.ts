import bowser from "bowser";
import type TouchManager from "./TouchManager";

declare module "@azerion/phaser" {
  interface Game {
    bowser: bowser.IBowser;
    TouchManager: TouchManager;
  }
}
