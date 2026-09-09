import { Game } from "@azerion/phaser";
import BoxPrototype, { BoxPrototypeOptions } from "./BoxPrototype";

class BoxHeavy extends BoxPrototype {
  constructor(game: Game, options: BoxPrototypeOptions) {
    options.frameName ??= "movingbox20000";
    options.density ??= 0.8;
    options.circleFriction ??= 0.05;

    super(game, options);
  }
}

export default BoxHeavy;
