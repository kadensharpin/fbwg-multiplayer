import { Particles, State } from "@azerion/phaser";
import GameCompleteMenu from "./GameCompleteMenu";

class Complete extends State {
  private levelState: any;
  private menu?: GameCompleteMenu;
  private emitter?: Particles.Arcade.Emitter;

  constructor() {
    super();
    this.doKill = this.doKill.bind(this);
    this.create = this.create.bind(this);
    this.preload = this.preload.bind(this);
    this.init = this.init.bind(this);
  }

  init(levelState: any) {
    this.levelState = levelState;
  }

  preload() {}

  create() {
    this.menu = new GameCompleteMenu(this.game, this.levelState);
    this.menu.show();
    this.menu.onClose.add(this.doKill);
    this.emitter = this.game.add.emitter(0, -this.game.realHeight / 2, 200);
    this.emitter.width = this.game.realWidth;
    this.emitter.makeParticles("PopupAssets", [
      "Confetti0000",
      "Confetti0001",
      "Confetti0002",
      "Confetti0003",
    ]);
    this.emitter.minParticleScale = 0.5;
    this.emitter.maxParticleScale = 1;
    this.emitter.setYSpeed(100, 200);
    this.emitter.setXSpeed(-5, 5);
    this.emitter.minRotation = 20;
    this.emitter.maxRotation = 50;
    this.emitter.start(false, 2500, 60, 0);
  }

  doKill() {
    this.menu?.destroy();
    this.emitter && (this.emitter.on = false);
    setTimeout(() => this.shutdown(), 5200);
  }
}

export default Complete;
