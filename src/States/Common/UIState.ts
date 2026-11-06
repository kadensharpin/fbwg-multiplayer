import { Sounds } from "@/utils/sound/sounds";
import { Group, Signal, State } from "phaser";

abstract class UIState extends State {
  readonly onReady: Signal;
  private sounds!: Sounds;
  started: boolean = false;
  root?: Group;

  constructor() {
    super();

    this.startMusic = this.startMusic.bind(this);
    this.updateMusic = this.updateMusic.bind(this);
    this.decodeAudio = this.decodeAudio.bind(this);
    this.create = this.create.bind(this);

    this.onReady = new Signal();
  }

  abstract layoutContent(): void;

  abstract addContent(): void;

  private decodeAudio() {
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
  }

  private updateMusic() {
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

  private startMusic() {
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
    this.decodeAudio();
    this.addContent();
  }
}

export default UIState;
