/// <amd-module name="States/Menu/MultiMenu" />

import Menu from "./Menu";
import MultiHall from "./MultiHall";

class MultiMenu extends Menu {
  inputEnableChildren: boolean = false;
  templeHall?: MultiHall;

  constructor() {
    super();

    this.shutdown = this.shutdown.bind(this);
    this.layoutContent = this.layoutContent.bind(this);
    this.update = this.update.bind(this);
    this.addContent = this.addContent.bind(this);
    this.preload = this.preload.bind(this);
  }

  preload() {
    super.preload();
  }

  addContent() {
    this.inputEnableChildren = true;
    this.templeHall = new MultiHall(this.game, 0, 0);
    this.root?.addChild(this.templeHall);
    this.templeHall.onStart.add(this.startTemple);
    this.afterAddContent();
    this.onReady.dispatch();
  }

  update() {
    if (this.templeHall != null) {
      this.templeHall.update();
    }
  }

  layoutContent() {
    super.layoutContent();
    this.templeHall?.layoutContent();
  }

  shutdown() {
    this.templeHall?.destroy();
  }
}

export = MultiMenu;
