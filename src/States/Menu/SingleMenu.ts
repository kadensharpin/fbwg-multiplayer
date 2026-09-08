/// <amd-module name="States/Menu/SingleMenu" />

import Menu from "./Menu";
import TempleHall from "./TempleHall";

class SingleMenu extends Menu {
  templeHall?: TempleHall;

  constructor() {
    super();
    this.layoutContent = this.layoutContent.bind(this);
    this.addContent = this.addContent.bind(this);
    this.preload = this.preload.bind(this);
  }

  layoutContent() {
    super.layoutContent();
    this.templeHall?.layoutContent();
  }

  addContent() {
    this.templeHall = this.templeHall = new TempleHall(this.game, 0, 0);
    this.root?.addChild(this.templeHall);
    this.templeHall.onStart.add(this.startTemple);
    this.onReady.dispatch();
    this.afterAddContent();
  }
}

export = SingleMenu;
