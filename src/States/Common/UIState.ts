import { Group, Signal, State } from "phaser";
import { Sounds } from "../../utils/sound/sounds";
import MuteButton from "./MuteButton";

class UIState extends State {
  readonly onReady: Signal;
  private sounds!: Sounds;
  started: boolean = false;
  root?: Group;
  muteButton?: MuteButton;
  constructor() {
    super();

    this.layoutContent = this.layoutContent.bind(this);
    this.startMusic = this.startMusic.bind(this);
    this.updateMusic = this.updateMusic.bind(this);
    this.decodeAudio = this.decodeAudio.bind(this);
    this.preload = this.preload.bind(this);

    this.onReady = new Signal();
  }
  decodeAudio(callback: () => void) {
    const sounds: Sounds = {};
    for (const sound of ["menuMusic", "pusher"] as const) {
      sounds[sound] = this.game.add.audio(sound);
    }
    this.sounds = sounds;
    this.game.currentSounds = sounds;
    this.game.sound.setDecodedCallback(
      Object.values(this.sounds),
      () => {
        this.startMusic();
        this.started = true;
      },
      this,
    );
    callback();
  }
  updateMusic() {
    this.sounds.menuMusic?.stop();
    if (!this.game.settings.music) {
      this.game.menuMusic?.stop();
      return;
    }
    if (!this.game.menuMusic) {
      this.game.menuMusic = this.sounds.menuMusic?.play();
    } else {
      this.game.menuMusic.play();
    }
  }
  startMusic() {
    if (!this.game.settings.music) return;
    if (!this.game.menuMusic?.isPlaying && this.sounds.menuMusic) {
      this.sounds.menuMusic.loop = true;
      this.sounds.menuMusic.allowMultiple = false;
      this.game.menuMusic = this.sounds.menuMusic.play();
    }
  }
  create() {
    this.root = this.game.make.group();
    this.game.add.existing(this.root);
    this.game.stage.backgroundColor = "#000000";
    this.decodeAudio(() => this.addContent());
  }
  addContent() {
    throw new Error("Method not implemented.");
  }
  layoutContent() {
    if (this.muteButton) {
      this.muteButton.x = this.game.realWidth / 2;
      this.muteButton.y = -this.game.realHeight / 2;
    }
  }
}

export default UIState;
