import { Game } from "@azerion/phaser";
import { Temple } from "../../temple";
import LevelMenuButtons from "./LevelMenuButtons";

class LevelMenuGrid extends LevelMenuButtons {
  constructor(game: Game, templeData: Temple) {
    super(game, templeData);
  }
}

export default LevelMenuGrid;
