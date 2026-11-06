import { State } from "phaser";
import BuyMenu from "./BuyMenu";

class Buy extends State {
  menu?: BuyMenu | null;
  levelState?: { success: true };

  constructor() {
    super();

    this.doKill = this.doKill.bind(this);
    this.create = this.create.bind(this);
    this.init = this.init.bind(this);
  }

  init(levelState: { success: true }) {
    this.levelState = levelState;
  }

  create() {
    this.menu = new BuyMenu(this.game);
    this.menu.show();
    return this.menu.onClose.add(this.doKill);
  }

  doKill() {
    this.menu?.destroy();
    return setTimeout(this.shutdown, 1000);
  }
}

export default Buy;
