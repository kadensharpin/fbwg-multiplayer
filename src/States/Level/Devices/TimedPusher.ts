import { BitmapData, Game, Graphics, Sound, Tile, Timer } from "phaser";
import { Light } from "./Device";
import Pusher, { PusherOptions } from "./Pusher";

type TimedPusherOptions = {
  properties: {
    time: number;
  };
} & PusherOptions;

class TimedPusher extends Pusher<TimedPusherOptions> {
  readonly baseLight: Light;
  readonly clock: Graphics;
  private timer: Timer | null = null;
  private downState: 0 | 1;
  private sound?: Sound | null;
  private lastDrawnAngle?: number | null;

  constructor(game: Game, options: TimedPusherOptions) {
    super(game, options);

    this.drawDarkMask = this.drawDarkMask.bind(this);
    this.ocupy = this.ocupy.bind(this);
    this.checkState = this.checkState.bind(this);
    this.doRegister = this.doRegister.bind(this);
    this.destroy = this.destroy.bind(this);

    const baseSprite = this.game.make.sprite(
      0,
      0,
      "MechAssets",
      "timed_pusher_base0000",
    );
    baseSprite.anchor.set(0.5);
    this.base.addChild(baseSprite);
    const light = this.game.make.sprite(
      0,
      0,
      "MechAssets",
      "timed_pusher_light_off0000",
    ) as Light;
    light.anchor.set(0.5);
    this.base.addChild(light);
    light.offFrameName = "timed_pusher_light_off0000";
    light.onFrameName = "timed_pusher_light_off0000";
    this.lights.push(light);
    this.baseLight = this.game.make.sprite(
      0,
      0,
      "MechAssets",
      "timed_pusher_light_off0000",
    ) as Light;
    this.baseLight.anchor.set(0.5);
    this.base.addChild(this.baseLight);
    this.baseLight.offFrameName = "timed_pusher_light_off0000";
    this.baseLight.onFrameName = "timed_pusher_light_on0000";
    this.baseLight.cacheAsBitmap = true;
    this.lights.push(this.baseLight);
    this.clock = this.game.make.graphics(0, 27);
    this.clock.cacheAsBitmap = true;
    this.registerDevice();
    this.downState = 0;
  }

  static sounds() {
    return ["pusher", "clock"];
  }

  destroy(destroyChildren?: boolean, soft?: boolean) {
    this.sound?.stop();
    super.destroy(destroyChildren, soft);
  }

  doRegister() {}

  checkState() {
    const translation = this.joint.GetJointTranslation();
    if (0 === this.downState && translation > 0) {
      this.downState = 1;
      this.game.level.sounds.pusher.play();
      null != this.sound && this.sound.isPlaying && this.sound.stop();
    } else {
      if (1 === this.downState && translation <= 0) {
        this.downState = 0;
        this.game.level.sounds.pusher.play();
        null != this.sound && this.sound.isPlaying && this.sound.stop();
      }
    }
    if (translation > 0) {
      this.state = 1;
      this.signal.dispatch(this);
      if (null == this.timer) {
        this.timer = this.game.time.create(true);
        this.timer.add(this.options.properties.time, () => {
          this.state = 0;
          this.game.level.sounds.pusher.play();
          this.signal.dispatch(this);
          this.timer = null;
        });
      }
      this.timer.stop(false);
      this.timer.start();
    } else if (!this.timer && 1 === this.state && translation <= 0) {
      this.state = 0;
      this.signal.dispatch(this);
    }
    if (1 === this.state && this.timer) {
      if (null == this.baseLight.mask) {
        this.base.addChild(this.clock);
        this.baseLight.mask = this.clock;
      }
      if (
        0 === this.downState &&
        (this.sound == null || !this.sound.isPlaying)
      ) {
        this.sound = this.game.level.sounds.clock.play(
          null,
          (22796 - this.options.properties.time) / 1e3,
        );
      }
      let c = Math.max(
        0,
        Math.min(1, 1 - this.timer.ms / this.options.properties.time),
      );
      c = Math.ceil(12 * c) / 12;
      const angle = -2 * Math.PI * c - Math.PI / 2;
      console.log(
        "angling " +
          this.timer.ms +
          " " +
          this.options.properties.time +
          " " +
          (1 - this.timer.ms / this.options.properties.time),
      );
      if (this.lastDrawnAngle !== angle) {
        this.clock.clear();
        this.clock.beginFill(16777215, 1);
        this.clock.moveTo(0, 0);
        this.clock.arc(0, 0, 20, angle, -Math.PI / 2);
        this.clock.lineTo(0, 0);
        this.clock.cacheAsBitmap = true;
        this.lastDrawnAngle = angle;
      }
    } else if (this.lastDrawnAngle) {
      this.base.removeChild(this.clock);
      // @ts-ignore
      this.baseLight.mask = null;
      this.lastDrawnAngle = null;
    }
  }

  ocupy(tiles: Tile[][]) {
    const x = this.options.x / 32;
    const y = this.options.y / 32;
    this.ocupyTile(tiles, x, y);
    this.ocupyTile(tiles, x - 1, y);
    this.ocupyTile(tiles, x - 2, y);
    this.ocupyTile(tiles, x + 1, y);
    this.ocupyTile(tiles, x, y - 1);
    this.ocupyTile(tiles, x - 1, y - 1);
    this.ocupyTile(tiles, x - 2, y - 1);
    this.ocupyTile(tiles, x + 1, y - 1);
  }

  drawDarkMask(bitmapData: BitmapData & { offset: { x: number; y: number } }) {
    if (1 !== this.state) return;
    bitmapData.ctx.globalCompositeOperation = "lighter";
    const pos = {
      x: this.options.x + bitmapData.offset.x,
      y: this.options.y + bitmapData.offset.y + 12,
    };
    const gradient = bitmapData.ctx.createRadialGradient(
      pos.x,
      pos.y,
      20,
      pos.x,
      pos.y,
      80,
    );
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.5, "rgba(255,255,255,0.2)");
    gradient.addColorStop(1, "transparent");
    bitmapData.circle(pos.x, pos.y, 90, gradient);
  }
}

export default TimedPusher;
