/// <amd-module name="States/Settings/SettingsMenu" />

import { Game, Signal } from "@azerion/phaser";
import StoneButton from "../Common/StoneButton";
import IngameMenu from "../Level/IngameMenu";
import ToggleControlButton from "./ToggleControlButton";
import ToggleSettingButton from "./ToggleSettingButton";

class SettingsMenu extends IngameMenu {
  onClose: Signal;
  music!: ToggleSettingButton<"music">;
  fx!: ToggleSettingButton<"fx">;
  single!: ToggleControlButton<"single">;
  dual!: ToggleControlButton<"dual">;
  vibrate!: ToggleSettingButton<"vibrate">;
  button!: StoneButton;

  constructor(game: Game, options: any) {
    super(game, options);

    this.changeControls = this.changeControls.bind(this);
    this.changeSetting = this.changeSetting.bind(this);
    this.setState = this.setState.bind(this);
    this.show = this.show.bind(this);
    this.close = this.close.bind(this);
    this.renderContent = this.renderContent.bind(this);

    this.onClose = new Signal();
  }

  renderContent() {
    if (this.game.settings.controls === "keyboard") {
      this.music = new ToggleSettingButton(
        this.game,
        this.contentSize.halfWidth / 3,
        0,
        "MusicButton",
        "music",
        this.changeSetting,
      );
      this.music.anchor.set(0.5);
      this.board.addChild(this.music);

      this.fx = new ToggleSettingButton(
        this.game,
        -this.contentSize.halfWidth / 3,
        0,
        "FxButton",
        "fx",
        this.changeSetting,
      );
      this.fx.anchor.set(0.5);
      this.board.addChild(this.fx);
    } else {
      this.single = new ToggleControlButton(
        this.game,
        -120,
        -this.contentSize.halfHeight / 3,
        "ToggleControlButtonSingle",
        "single",
        this.changeControls,
      );
      this.single.anchor.set(0.5);
      this.board.addChild(this.single);

      const text = this.game.make.bitmapText(
        0,
        -this.contentSize.halfHeight / 3,
        this.game.lang.font,
        "or",
        18,
      );
      text.anchor.set(0.5);
      this.board.addChild(text);

      this.dual = new ToggleControlButton(
        this.game,
        120,
        -this.contentSize.halfHeight / 3,
        "ToggleControlButtonDual",
        "dual",
        this.changeControls,
      );

      this.dual.anchor.set(0.5);
      this.board.addChild(this.dual);
      this.vibrate = new ToggleSettingButton(
        this.game,
        -this.contentSize.halfWidth / 2,
        this.contentSize.halfHeight / 6,
        "VibrateButton",
        "vibrate",
        this.changeSetting,
      );
      this.vibrate.anchor.set(0.5);
      this.board.addChild(this.vibrate);
      this.music = new ToggleSettingButton(
        this.game,
        0,
        this.contentSize.halfHeight / 6,
        "MusicButton",
        "music",
        this.changeSetting,
      );
      this.music.anchor.set(0.5);
      this.board.addChild(this.music);
      this.fx = new ToggleSettingButton(
        this.game,
        this.contentSize.halfWidth / 2,
        this.contentSize.halfHeight / 6,
        "FxButton",
        "fx",
        this.changeSetting,
      );
      this.fx.anchor.set(0.5);
      this.board.addChild(this.fx);
    }
    this.setState();
    this.button = new StoneButton(
      this.game,
      0,
      (1.1 * this.contentSize.halfHeight) / 2,
      this.game.lang.locale("Ok"),
      this.close,
    );
    this.button.anchor.set(0.5);
    this.board.addChild(this.button);
  }

  close() {
    this.hide();
    setTimeout(() => this.onClose.dispatch(), 1000);
  }

  setState() {
    if (this.dual && this.single) {
      const dual = this.game.settings.controls === "dual";
      this.dual.setSelected(dual);
      this.single.setSelected(!dual);
    }
    if (this.vibrate) this.vibrate.setSelected(this.game.settings.vibrate);
    this.music.setSelected(this.game.settings.music);
    this.fx.setSelected(this.game.settings.fx);
  }

  changeSetting(setting: "vibrate" | "music" | "fx") {
    this.game.settings[setting] = !this.game.settings[setting];
    this.game.saveSettings();
    this.game.settingsSignal.dispatch(setting);
    this.setState();
  }

  changeControls(controls: any) {
    this.game.settings.controls = controls;
    this.game.saveSettings();
    this.game.settingsSignal.dispatch("controls");
    this.setState();
  }
}

export = SettingsMenu;

declare module "@azerion/phaser" {
  interface Game {
    saveSettings(): void;
    settingsSignal: Signal;
    settings: {
      controls: "keyboard" | "dual" | "single";
      vibrate: boolean;
      music: boolean;
      fx: boolean;
    };
  }
}
