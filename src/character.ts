import { Group } from "@azerion/phaser";

export type Characters = "wg" | "fb";

export declare class Character extends Group {
  snowCount: number;
  data: { char: Characters; diamonds: 0; silverDiamond: 0 };

  setOnIce(onIce: boolean): void;
}
