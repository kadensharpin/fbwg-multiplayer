/// <amd-module name="States/LevelMenu/LevelMenuTree" />

import { Game } from "@azerion/phaser";
import { Temple } from "../../temple";
import LevelMenuButtons from "./LevelMenuButtons";

class LevelMenuTree extends LevelMenuButtons {
  constructor(game: Game, templeData: Temple) {
    super(game, templeData);
  }
}

export = LevelMenuTree;
