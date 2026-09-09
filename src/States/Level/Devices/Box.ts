import { Game } from "phaser";
import BoxPrototype, { BoxPrototypeOptions } from "./BoxPrototype";

class Box extends BoxPrototype {
  constructor(game: Game, options: BoxPrototypeOptions) {
    super(game, options);
  }
}

export default Box;
