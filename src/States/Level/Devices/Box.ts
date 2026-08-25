/// <amd-module name="States/Level/Devices/Box" />

import { Game } from "@azerion/phaser";
import BoxPrototype, { BoxPrototypeOptions } from "./BoxPrototype";

class Box extends BoxPrototype {
  constructor(game: Game, options: BoxPrototypeOptions) {
    super(game, options);
  }
}

export = Box;
