import { Game, Point, Signal } from "phaser";
import Button from "../Common/Button";
import { Characters } from "./character";

class CursorToggle extends Button {
  onChange: Signal;
  vtheta: number;
  atheta: number;
  current!: Characters;

  constructor(game: Game) {
    super(
      game,
      0,
      0,
      "PopupAssets",
      "CursorToggle0000",
      () => this.clicked(),
      null,
    );

    this.setChar = this.setChar.bind(this);
    this.clicked = this.clicked.bind(this);
    this.update = this.update.bind(this);
    this.getAngle = this.getAngle.bind(this);
    this.normalizeAngle = this.normalizeAngle.bind(this);
    this.layoutContent = this.layoutContent.bind(this);
    this.init = this.init.bind(this);

    this.game.layers.ui.addChild(this);
    this.anchor.set(0.5);
    this.y = this.game.realHeight / 2;
    this.onChange = new Signal();
    this.setChar("wg");
    this.vtheta = 0;
    this.atheta = 0;
    this.rotation = Math.PI;
  }

  init() {
    requestAnimationFrame(() => (this.rotation = this.getAngle()));
  }

  layoutContent() {
    this.y = this.game.realHeight / 2;
  }

  normalizeAngle(angle: number) {
    for (; angle > 2 * Math.PI; ) angle -= 2 * Math.PI;
    for (; angle < 0; ) angle += 2 * Math.PI;
    return angle;
  }

  getAngle() {
    let angle, sprite;
    if ("fb" === this.current) {
      sprite = this.game.level.pers1.sprite;
      angle = 0;
    } else {
      sprite = this.game.level.pers2.sprite;
      angle = Math.PI;
    }
    const distance = Math.atan2(
      sprite.world.y - this.world.y,
      sprite.world.x - this.world.x,
    );
    return this.normalizeAngle(angle + distance);
  }

  update() {
    const scale = 0.5;
    const angle = this.getAngle();

    let atheta = angle - this.rotation;
    atheta > Math.PI && (atheta -= 2 * Math.PI);
    atheta < -Math.PI && (atheta += 2 * Math.PI);
    this.atheta = 0.1 * atheta;
    this.vtheta += this.atheta;
    this.vtheta *= scale;
    this.rotation += this.vtheta;
    this.rotation = this.normalizeAngle(this.rotation);
  }

  clicked() {
    if (this.current === "wg") {
      this.setChar("fb");
      this.game.level.sounds.charToggle1?.play();
    } else {
      this.setChar("wg");
      this.game.level.sounds.charToggle2?.play();
    }
  }

  setChar(newCharacter: Characters, ev?: HammerInput) {
    if (this.current === newCharacter) return;
    if (ev && !this.game.input.hitTest(this, ev.center as any, new Point())) {
      return;
    }
    this.current = newCharacter;
    this.onChange.dispatch(this.current);
  }
}

export default CursorToggle;
