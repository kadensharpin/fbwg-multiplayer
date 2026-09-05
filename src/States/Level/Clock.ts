/// <amd-module name="States/Level/Clock" />

import { BitmapText, Game, Sprite } from "@azerion/phaser";

class Clock extends Sprite {
  private readonly text: BitmapText;
  private startTime?: number;
  private pauseTime?: number | null;
  private stopped: boolean = false;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, "TempleAssets", "Clock0000");

    this.getElapsedSeconds = this.getElapsedSeconds.bind(this);
    this.resume = this.resume.bind(this);
    this.stop = this.stop.bind(this);
    this.pause = this.pause.bind(this);
    this.update = this.update.bind(this);
    this.start = this.start.bind(this);

    this.text = game.make.bitmapText(0, 0, "font_en", "00:00", 24);
    this.text.anchor.set(0);
    this.text.x = -this.text.textWidth / 2;
    this.text.y = -this.height / 2 + this.text.textHeight + 20;
    this.addChild(this.text);
    this.text.text = this.secondsToString(0);
  }

  start() {
    if (this.game != null) {
      this.startTime = this.game.time.now;
    }
  }

  update() {
    if (this.startTime != null && !this.stopped && this.pauseTime == null) {
      this.text.text = this.secondsToString(this.getElapsedSeconds());
      this.text.x = -this.text.textWidth / 2;
      this.text.y = -this.height / 2 + this.text.textHeight + 20;
    }
  }

  pause() {
    if (this.pauseTime == null) {
      this.pauseTime = this.game.time.now;
    }
  }

  stop() {
    this.stopped = true;
  }

  resume() {
    if (!this.game || this.startTime == null || this.pauseTime == null) return;
    this.startTime = this.startTime + (this.game.time.now - this.pauseTime);
    this.pauseTime = null;
  }

  getElapsedSeconds() {
    if (this.startTime == null) return 0;
    return Math.round((this.game.time.now - this.startTime) / 1000);
  }

  secondsToString(seconds: number) {
    const pad = (n: number) => (n < 10 ? "0" : "") + n;
    const remainingSeconds = seconds % 60;
    const minutes = (seconds - remainingSeconds) / 60;
    return pad(minutes) + ":" + pad(remainingSeconds);
  }
}

export = Clock;
