import { Game, Group, Keyboard, Signal, Sprite } from "phaser";
import TouchButton from "../Common/TouchButton";

class CharCursors extends Signal {
  game: Game;
  character: string;
  buttons: Sprite | Group | null = null;

  right = { isDown: false };
  left = { isDown: false };
  up = { isDown: false };

  constructor(game: Game, character: string) {
    super();

    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);
    this.updateDowns = this.updateDowns.bind(this);
    this.onSettingChange = this.onSettingChange.bind(this);
    this.destroy = this.destroy.bind(this);

    this.game = game;
    this.character = character;
    this.active = false;
    this.game.settingsSignal.add(this.onSettingChange);
    this.setup();
  }

  destroy() {
    this.game.settingsSignal.remove(this.onSettingChange);
  }
  onSettingChange(key: keyof Game["settings"]) {
    if (key === "controls") {
      if (this.buttons) {
        this.buttons.destroy();
        this.buttons = null;
      }
      this.setup();
    }
  }
  isOnDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  }
  setup() {
    this.left = { isDown: false };
    this.right = { isDown: false };
    this.up = { isDown: false };
    if (this.game.settings.controls === "dual") {
      const scale = 0.35 * window.devicePixelRatio;
      this.buttons = this.game.make.sprite(0, 0);
      const left = new TouchButton(this.game, 0, 0, "left", this.character);
      left.scale.set(scale);
      left.onDown = () => ((this.left.isDown = true), this.updateDowns());
      left.onUp = () => ((this.left.isDown = false), this.updateDowns());
      const right = new TouchButton(this.game, 0, 0, "right", this.character);
      right.scale.set(scale);
      right.onDown = () => ((this.right.isDown = true), this.updateDowns());
      right.onUp = () => ((this.right.isDown = false), this.updateDowns());
      const jump = new TouchButton(this.game, 0, 0, "up", this.character);
      jump.scale.set(scale);
      jump.onDown = () => ((this.up.isDown = true), this.updateDowns());
      jump.onUp = () => ((this.up.isDown = false), this.updateDowns());
      this.buttons.addChild(left);
      this.buttons.addChild(right);
      this.buttons.addChild(jump);
      left.x = (-1.2 * scale * left.sprite!.width) / 2;
      right.x = (1.2 * scale * right.sprite!.width) / 2;
      jump.y = (-1.2 * scale * jump.sprite!.width) / 2;
      if (this.character === "wg") {
        this.buttons.x =
          -this.game.realWidth / 2 + (2 * left.sprite!.width) / 3;
        this.buttons.y = this.game.realHeight / 2 - left.sprite!.height / 4;
      } else {
        this.buttons.x = this.game.realWidth / 2 - (2 * left.sprite!.width) / 3;
        this.buttons.y = this.game.realHeight / 2 - left.sprite!.height / 4;
      }
      this.game.layers.ui.addChild(this.buttons);
    } else if (this.game.settings.controls === "single") {
      const scale = 0.5 * window.devicePixelRatio;
      this.buttons = this.game.make.group();
      const left = new TouchButton(this.game, 0, 0, "left", this.character);
      left.scale.set(scale);
      const right = new TouchButton(this.game, 0, 0, "right", this.character);
      right.scale.set(scale);

      left.onDown = () => {
        if (this.right.isDown) {
          this.up.isDown = true;
        } else {
          this.left.isDown = true;
          right.setState("up");
        }
        this.updateDowns();
      };
      left.onUp = () => {
        if (left.sprite!.frameName !== left.initialFrame) {
          this.up.isDown = false;
          if (!this.right.isDown) {
            left.setState("left");
          }
        } else {
          this.left.isDown = false;
          if (!this.up.isDown) {
            right.setState("right");
          }
        }
        this.updateDowns();
      };
      right.onDown = () => {
        if (this.left.isDown) {
          this.up.isDown = true;
        } else {
          this.right.isDown = true;
          left.setState("up");
        }
        this.updateDowns();
      };
      right.onUp = () => {
        if (right.sprite!.frameName !== right.initialFrame) {
          this.up.isDown = false;
          if (!this.left.isDown) {
            right.setState("right");
          }
        } else {
          this.right.isDown = false;
          if (!this.up.isDown) {
            left.setState("left");
          }
        }
        this.updateDowns();
      };

      left.x =
        -this.game.realWidth / 2 + (0.7 * scale * left.sprite!.width) / 2;
      left.y =
        this.game.realHeight / 2 - (0.7 * scale * left.sprite!.height) / 2;
      right.x =
        this.game.realWidth / 2 - (0.7 * scale * right.sprite!.width) / 2;
      right.y =
        this.game.realHeight / 2 - (0.7 * scale * right.sprite!.height) / 2;

      if (this.character === "fb") {
        this.buttons.visible = false;
      }
      this.buttons.addChild(left);
      this.buttons.addChild(right);
      this.game.layers.ui.addChild(this.buttons);
    } else {
      if (this.character === "wg") {
        this.up = this.game.input.keyboard.addKey(Keyboard.W);
        this.left = this.game.input.keyboard.addKey(Keyboard.A);
        this.right = this.game.input.keyboard.addKey(Keyboard.D);
      } else {
        this.up = this.game.input.keyboard.addKey(Keyboard.UP);
        this.left = this.game.input.keyboard.addKey(Keyboard.LEFT);
        this.right = this.game.input.keyboard.addKey(Keyboard.RIGHT);
      }
    }
  }
  updateDowns() {
    this.active = this.left.isDown || this.right.isDown || this.up.isDown;
  }
  show() {
    if (this.buttons) this.buttons.visible = true;
  }
  hide() {
    if (this.buttons) this.buttons.visible = false;
  }
  update() {}
  layoutContent() {}
}

export default CharCursors;
