import { Key, Keyboard, State } from "phaser";
import { EndState } from "../ProgressModel";
import EndMenu from "./Level/EndMenu";
import GameOverMenu from "./Level/GameOverMenu";

class End extends State {
  levelState?: EndState;
  menu?: EndMenu | GameOverMenu;
  restartKey?: Key;

  constructor() {
    super();

    this.shutdown = this.shutdown.bind(this);
    this.pauseUpdate = this.pauseUpdate.bind(this);
    this.layoutContent = this.layoutContent.bind(this);
    this.create = this.create.bind(this);
    this.init = this.init.bind(this);
  }

  init(state: EndState) {
    this.levelState = state;
  }

  create() {
    if (!this.levelState) return;
    if (this.levelState.success) {
      this.game.progress.update(this.levelState);
      this.menu = new EndMenu(this.game, this.levelState);
      this.menu.show();
    } else {
      this.menu = new GameOverMenu(this.game, this.levelState);
      this.menu.show();
      this.restartKey = this.game.input.keyboard.addKey(Keyboard.R);
      this.restartKey.onDown.add(this.levelState.retry);
    }
  }

  layoutContent() {
    this.menu?.layoutContent();
  }

  pauseUpdate() {
    this.menu?.update();
    this.game.tweens.update();
  }

  shutdown() {
    console.log(
      "shuting down end, with levelstate ",
      this.game.state.states.level,
    );
    this.game.state.states.level.killAll();
  }
}

export default End;
