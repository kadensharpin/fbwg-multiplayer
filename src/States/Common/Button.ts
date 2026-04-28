/// <amd-module name="States/Common/Button" />

import { BitmapText, Game, Sprite } from "@azerion/phaser";

class Button extends Sprite {
  private readonly soundId: string;
  private readonly downFrameName?: string;
  private readonly upFrameName?: string;
  private readonly sprite?: Sprite;
  private readonly id: number;
  private disabled: boolean = false;

  protected customEvents: boolean = false;
  protected isDown: boolean = false;
  protected label?: BitmapText;

  constructor(
    game: Game,
    x: number,
    y: number,
    key: string | Phaser.RenderTexture | Phaser.BitmapData | PIXI.Texture,
    textureId: [string, string] | string,
    onClick: (self: Button) => void,
    soundId: string,
  ) {
    textureId != null
      ? super(game, x, y, key, "_default0000")
      : super(game, x, y, key);
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
      this.sprite = game.make.sprite(0, 0, key, textureId);
      this.sprite.anchor.set(0.5);
      this.addChild(this.sprite);
    }
    this.id = Math.random();
    if (!this.customEvents) {
      if (
        this.game.bowser.mobile ||
        this.game.bowser.tablet ||
        this.game.device.iPad
      ) {
        game.TouchManager.register(this, "touchstart", this.setDown);
        game.TouchManager.register(this, "touchend", (ev, clicked) => {
          if (clicked && this.isDown && onClick != null) {
            (this.game.settings.vibrate &&
              navigator.vibrate &&
              navigator.vibrate(50),
              this.game.settings.fx &&
                this.soundId &&
                this.game.currentSounds[this.soundId].play());
            onClick(this);
          }
          this.setUp();
        });
      } else {
        game.TouchManager.register(this, "mousedown", this.setDown);
        game.TouchManager.register(this, "mouseup", (ev, clicked) => {
          return (
            clicked &&
              this.isDown &&
              null != onClick &&
              (this.game.settings.fx &&
                this.soundId &&
                this.game.currentSounds[this.soundId].play(),
              onClick(this)),
            this.setUp()
          );
        });
      }
    }
  }
  setDown() {
    this.isDown = true;
    if (
      (this.disabled ||
        null == this.downFrameName ||
        null == this.sprite ||
        (this.sprite.frameName = this.downFrameName),
      !this.disabled && this.label)
    )
      return this.label?.scale.set(0.95, 0.95);
  }
  setUp() {
    this.isDown = false;
    if (
      (this.disabled ||
        !this.upFrameName ||
        !this.sprite ||
        (this.sprite.frameName = this.upFrameName),
      !this.disabled && this.label)
    )
      return this.label?.scale.set(1, 1);
  }
  enable() {
    this.disabled = false;
  }
  disable() {
    this.disabled = true;
  }
  destroy(destroyChildren?: boolean) {
    return (
      this.game.bowser.mobile ||
      this.game.bowser.tablet ||
      this.game.device.iPad
        ? (this.game.TouchManager.unregister(this, "touchstart"),
          this.game.TouchManager.unregister(this, "touchend"))
        : (this.game.TouchManager.unregister(this, "mousedown"),
          this.game.TouchManager.unregister(this, "mouseup")),
      super.destroy.call(this, destroyChildren)
    );
  }
}

export = Button;
