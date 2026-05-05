/// <amd-module name="States/Common/Button" />

import {
  BitmapData,
  BitmapText,
  Game,
  RenderTexture,
  Sprite,
} from "@azerion/phaser";
import { Sounds } from "../../utils/sound/sounds";

class Button extends Sprite {
  private readonly soundId: keyof Sounds | null;
  private readonly id: number;
  private disabled: boolean = false;

  readonly sprite?: Sprite;
  protected downFrameName?: string;
  protected upFrameName?: string;
  protected customEvents: boolean = false;
  protected isDown: boolean = false;
  protected label?: BitmapText;

  constructor(
    game: Game,
    x: number,
    y: number,
    textureFile: string | RenderTexture | BitmapData | PIXI.Texture,
    textureId: [string, string] | string | null,
    onClick: ((self: Button) => void) | null | undefined,
    soundId: keyof Sounds | null,
  ) {
    super(game, x, y, textureFile, "_default0000");
    this.destroy = this.destroy.bind(this);
    this.disable = this.disable.bind(this);
    this.enable = this.enable.bind(this);
    this.setUp = this.setUp.bind(this);
    this.setDown = this.setDown.bind(this);
    this.soundId = soundId;
    if (Array.isArray(textureId)) {
      this.downFrameName = textureId[1];
      this.upFrameName = textureId = textureId[0];
    }
    if (textureId) {
      this.sprite = game.make.sprite(0, 0, textureFile, textureId);
      this.sprite.anchor.set(0.5);
      this.addChild(this.sprite);
    }
    this.id = Math.random();
    if (this.customEvents) return;
    if (
      this.game.bowser.mobile ||
      this.game.bowser.tablet ||
      this.game.device.iPad
    ) {
      game.TouchManager.register(this, "touchstart", this.setDown);
      game.TouchManager.register(this, "touchend", (ev, clicked) => {
        if (clicked && this.isDown && onClick != null) {
          if (this.game.settings.vibrate && navigator.vibrate)
            navigator.vibrate(50);
          if (this.game.settings.fx && this.soundId)
            this.game.currentSounds[this.soundId]?.play();
          onClick(this);
        }
        this.setUp();
      });
    } else {
      game.TouchManager.register(this, "mousedown", this.setDown);
      game.TouchManager.register(this, "mouseup", (ev, clicked) => {
        if (clicked && this.isDown && onClick) {
          if (this.game.settings.fx && this.soundId)
            this.game.currentSounds[this.soundId]?.play();
          onClick(this);
        }
        this.setUp();
      });
    }
  }
  setDown() {
    this.isDown = true;
    if (!this.disabled && this.downFrameName && this.sprite) {
      this.sprite.frameName = this.downFrameName;
    }
    if (!this.disabled && this.label) {
      this.label.scale.set(0.95, 0.95);
    }
  }
  setUp() {
    this.isDown = false;
    if (!this.disabled && this.upFrameName && this.sprite) {
      this.sprite.frameName = this.upFrameName;
    }
    if (!this.disabled && this.label) {
      this.label.scale.set(1, 1);
    }
  }
  enable() {
    this.disabled = false;
  }
  disable() {
    this.disabled = true;
  }
  destroy(destroyChildren?: boolean) {
    if (
      this.game.bowser.mobile ||
      this.game.bowser.tablet ||
      this.game.device.iPad
    ) {
      this.game.TouchManager.unregister(this, "touchstart");
      this.game.TouchManager.unregister(this, "touchend");
    } else {
      this.game.TouchManager.unregister(this, "mousedown");
      this.game.TouchManager.unregister(this, "mouseup");
    }
    super.destroy.call(this, destroyChildren);
  }
}

export = Button;
