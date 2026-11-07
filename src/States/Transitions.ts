import { BitmapText, Game, Signal, Sprite } from "phaser";

export type States =
  | "menu"
  | "levelMenu"
  | "endGame"
  | "level"
  | "gameComplete"
  | "buy";

type FadeOverlay = Sprite & { text: BitmapText };
export default class Transitions {
  /** Used when initially loading the game to skip fading out */
  private isInitial = true;
  private overlay: FadeOverlay | null = null;
  private fadeOut: Promise<void> | null = null;
  private fadeIn: Promise<void> | null = null;

  constructor(readonly game: Game) {
    this.fade = this.fade.bind(this);
    this.fadeToBlack = this.fadeToBlack.bind(this);
    this.fadeToGame = this.fadeToGame.bind(this);
  }

  fade(
    state: States,
    clearWorld: boolean = true,
    clearCache: boolean = false,
    ...args: any[]
  ): void {
    let duration: number | undefined = undefined;
    if (this.isInitial) {
      this.isInitial = false;
      duration = 1;
    }
    this.fadeToBlack(duration).then(() => {
      this.game.state.start(state, clearWorld, clearCache, ...args);
      this.game.paused = false;

      const currentState = this.game.state.states[state];
      if ("onReady" in currentState && currentState.onReady instanceof Signal) {
        currentState.onReady.addOnce(this.fadeToGame);
      } else {
        requestAnimationFrame(this.fadeToGame);
      }
    });
  }

  private createFadeOverlay(): FadeOverlay {
    const sprite = this.game.make.sprite(0, 0) as FadeOverlay;
    sprite.name = "loading-overlay";
    const graphics = this.game.make.graphics(0, 0);
    graphics.beginFill(0, 1);
    graphics.drawRect(0, 0, this.game.realWidth, this.game.realHeight);
    graphics.endFill();
    sprite.addChild(graphics);
    sprite.text = this.game.make.bitmapText(
      0,
      0,
      this.game.lang.font,
      this.game.lang.locale("loading"),
      Math.min(30, 36 / Math.max(1, this.game.resolution)),
    );
    sprite.text.anchor.set(0);
    sprite.text.alpha = 0;
    sprite.text.x = window.innerWidth / 2 - sprite.text.textWidth / 2;
    sprite.text.y = window.innerHeight / 2 - sprite.text.textHeight / 2;
    sprite.addChild(sprite.text);
    const startTime = this.game.time.time;
    const progress = () => {
      const elapsed = this.game.time.elapsedSince(startTime);
      const alpha = 1200;
      if (elapsed > alpha) {
        sprite.text.alpha = 1;
      }
      const state = Math.floor((elapsed - alpha) / 300) % 4;
      if (state === 0) {
        sprite.text.text = this.game.lang.locale("loading") + "...";
      }
      if (state === 1) {
        sprite.text.text = this.game.lang.locale("loading");
      }
      if (state === 2) {
        sprite.text.text = this.game.lang.locale("loading") + ".";
      }
      if (state === 3) {
        sprite.text.text = this.game.lang.locale("loading") + "..";
      }
      return requestAnimationFrame(progress);
    };
    requestAnimationFrame(progress);
    this.game.stage.addChild(sprite);
    return sprite;
  }

  async fadeToBlack(duration: number = 300): Promise<void> {
    // Fading back in - wait until fully faded back
    if (this.fadeIn != null) await this.fadeIn;
    // Already fading out
    if (this.fadeOut != null) return this.fadeOut;
    // Already faded out
    if (this.overlay != null) return;

    let onComplete: () => void;
    this.fadeOut = new Promise<void>((s) => (onComplete = s));

    this.overlay = this.createFadeOverlay();
    this.overlay.alpha = 0;

    this.game.paused = false;
    const animation = this.game.add.tween(this.overlay);
    animation.to({ alpha: 1 }, duration);
    animation.onComplete.add(() => {
      console.log("faded to black");
      this.game.tweens.remove(animation);
      this.overlay!.alpha = 1;
      this.fadeOut = null;
      onComplete();
    });
    animation.start();
    console.log("fading to black");
    return this.fadeOut;
  }

  async fadeToGame(duration: number = 300) {
    // Fading out to black - wait until fully faded out
    if (this.fadeOut != null) await this.fadeOut;
    // Already fading back in
    if (this.fadeIn != null) return this.fadeIn;
    // Already faded in
    if (this.overlay == null) return;

    let onComplete: () => void;
    this.fadeIn = new Promise<void>((s) => (onComplete = s));

    const thisOverlay = this.overlay;
    thisOverlay.text.destroy(true);

    this.game.paused = false;
    const fadeInAnimation = this.game.add.tween(thisOverlay);
    fadeInAnimation.to({ alpha: 0 }, duration);
    fadeInAnimation.onComplete.add(() => {
      console.log("faded back to game");
      thisOverlay.destroy(true);
      this.overlay = null;
      this.fadeIn = null;
      onComplete();
    });
    fadeInAnimation.start();
    console.log("fading back to game");
    return this.fadeIn;
  }
}
