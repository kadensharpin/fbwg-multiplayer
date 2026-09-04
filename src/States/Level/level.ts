import { Game, Group, State } from "@azerion/phaser";
import { Sounds } from "../../utils/sound/sounds";
import Character from "./character";

export declare class Level extends State {
  game: Game;
  root: Group;
  size: { width: number; height: number };
  pers1: Character;
  pers2: Character;
  debug: boolean;
  ended: boolean;
  sounds: Sounds;

  togglePause(): void;
  quit(): void;
  retry(): void;
}
