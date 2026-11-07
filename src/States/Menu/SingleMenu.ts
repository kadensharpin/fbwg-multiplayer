import ProgressModel from "@/ProgressModel";
import { BitmapText } from "phaser";
import Button from "../Common/Button";
import Menu from "./Menu";
import TempleHall from "./TempleHall";

const temples = [
  "forest",
  "light",
  "ice",
  "crystal",
  // "elements",
  "fairytales",
  "friends",
];

class SingleMenu extends Menu {
  templeHall?: TempleHall;
  templeControls?: [prev: Button, temple: BitmapText, next: Button];

  constructor() {
    super();

    this.layoutContent = this.layoutContent.bind(this);
    this.addContent = this.addContent.bind(this);
    this.prevTemple = this.prevTemple.bind(this);
    this.nextTemple = this.nextTemple.bind(this);
    this.setTemple = this.setTemple.bind(this);
  }

  layoutContent() {
    super.layoutContent();
    this.templeHall?.layoutContent();

    if (!this.templeControls) return;

    const [prev, temple, next] = this.templeControls;
    prev.y = this.game.realHeight / 2 - 100;
    next.y = this.game.realHeight / 2 - 100;
    temple.y = this.game.realHeight / 2 - temple.height - 90;
    temple.x = -temple.width / 2;
  }

  addContent() {
    this.templeHall = new TempleHall(this.game, 0, 0);
    this.root?.addChild(this.templeHall);
    const prevButton = new Button(
      this.game,
      -175,
      0,
      "MenuAssets",
      ["BackButton0000", "BackButton0001"],
      this.prevTemple,
      "pusher",
    );
    prevButton.scale.set(0.75);
    const nextButton = new Button(
      this.game,
      175,
      0,
      "MenuAssets",
      ["BackButton0000", "BackButton0001"],
      this.nextTemple,
      "pusher",
    );
    nextButton.scale.set(-0.75);
    const label = this.game.make.bitmapText(
      0,
      0,
      this.game.lang.font,
      this.game.gameConfig.id,
      28,
    );
    this.templeControls = [prevButton, label, nextButton];
    this.root?.addChild(prevButton);
    this.root?.addChild(label);
    this.root?.addChild(nextButton);
    this.templeHall.onStart.add(this.startTemple);
    this.onReady.dispatch();
    this.afterAddContent();
  }

  nextTemple() {
    const i = temples.indexOf(this.game.gameConfig.id) + 1;
    const temple = temples[i % temples.length];
    this.setTemple(temple);
  }

  prevTemple() {
    const i = temples.indexOf(this.game.gameConfig.id) - 1;
    const temple = temples[i >= 0 ? i : temples.length - 1];
    this.setTemple(temple);
  }

  setTemple(temple: string) {
    console.log("set temple", temple);
    this.game.progress.save();
    ProgressModel.lastTemple = temple;
    this.game.load.baseURL = temple + "/";
    this.game.transitions.fadeToBlack().then(() => {
      this.game.state.start("load");
    });
  }
}

export default SingleMenu;
