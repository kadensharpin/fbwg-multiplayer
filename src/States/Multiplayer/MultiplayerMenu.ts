import { Game, Signal } from "phaser";
import StoneButton from "../Common/StoneButton";
import IngameMenu from "../Level/IngameMenu";
import CodeCharacter from "./CodeCharacter";

class MultiplayerMenu extends IngameMenu<undefined> {
  private static readonly ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  private characters: CodeCharacter[] = Array(8);
  onClose: Signal;

  constructor(
    game: Game,
    private readonly shouldCreate: boolean,
  ) {
    super(game, undefined);

    this.createRoom = this.createRoom.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.close = this.close.bind(this);
    this.show = this.show.bind(this);
    this.renderContent = this.renderContent.bind(this);
    this.onClose = new Signal();

    if (shouldCreate) {
      this.createRoom();
    }
  }

  renderContent() {
    for (let i = 0; i < this.characters.length; i++) {
      this.characters[i] = new CodeCharacter(
        this.game,
        -420 + i * 105,
        (-0.8 * this.contentSize.halfHeight) / 2,
      );
      this.board.addChild(this.characters[i]);

      if (this.game.logic.multiplayerRoom) {
        this.characters[i].character =
          this.game.logic.multiplayerRoom[i] ?? null;
      }
    }

    const cancelButton = new StoneButton(
      this.game,
      -120,
      (1.1 * this.contentSize.halfHeight) / 2,
      "Cancel",
      this.close,
    );
    this.board.addChild(cancelButton);
    const okButton = new StoneButton(
      this.game,
      120,
      (1.1 * this.contentSize.halfHeight) / 2,
      this.shouldCreate ? "Ok" : "Join",
      this.joinRoom,
    );
    okButton.label!.tint = 0x444444;
    okButton.label!.alpha = 0.7;
    okButton.disable();
    this.board.addChild(okButton);

    if (this.shouldCreate) return;
    this.game.input.keyboard.onPressCallback = (key) => {
      key = key.toUpperCase();
      if (!MultiplayerMenu.ALPHABET.includes(key)) return;

      for (const character of this.characters) {
        if (character.character) continue;

        character.character = key;
        break;
      }

      if (this.characters.at(-1)?.character) {
        okButton.label!.tint = 0xffffff;
        okButton.label!.alpha = 1.0;
        okButton.enable();
      }
    };

    this.game.input.keyboard.onDownCallback = (ev) => {
      if (ev.code !== "Backspace") return;

      for (let i = 0; i < this.characters.length; i++) {
        const thisChar = this.characters[i];
        const nextChar = this.characters[i + 1];

        if (nextChar?.character) continue;
        thisChar.character = null;
        break;
      }

      if (!this.characters.at(-1)?.character) {
        okButton.label!.tint = 0x444444;
        okButton.label!.alpha = 0.7;
        okButton.disable();
      }
    };
  }

  close() {
    this.game.input.keyboard.onPressCallback = undefined;
    this.game.input.keyboard.onDownCallback = undefined;
    this.hide();
    setTimeout(() => this.onClose.dispatch(), 1000);
  }

  createRoom() {
    let code = "";
    for (let i = 0; i < this.characters.length; i++) {
      const index = Math.random() * MultiplayerMenu.ALPHABET.length;
      const char = MultiplayerMenu.ALPHABET[Math.floor(index)];
      code += char;
    }

    this.game.logic.startMultiplayer(code).then(() => this.close());
  }

  joinRoom(button: StoneButton) {
    if (button.isDisabled) return;
    button.label!.tint = 0x444444;
    button.label!.alpha = 0.7;
    button.disable();

    let code = "";
    for (let i = 0; i < this.characters.length; i++) {
      code += this.characters[i].character;
    }

    this.game.logic.startMultiplayer(code).then(() => this.close());
  }
}

export default MultiplayerMenu;
