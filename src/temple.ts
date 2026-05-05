type LevelType = "puzzle" | "speed" | "dark";

export type Temple = {
  index: number;
  id: "forest";
  label: "forest temple";
  color: "#5B4610";
  type: "tree";
  levels: LevelData[];
  edges: { id: `${number}`; source: number; target: number }[];
  minRequired: number;
  softLocked: boolean;
  locked: boolean;
  hasNew: boolean;
};

export type LevelData = {
  id: number;
  x: number;
  y: number;
  filename: string;
  time: number;
  mobileTime: number;
  required: number;
  initial: boolean;
  _id: number;
  locked: boolean;
  state: LevelState;
  played: boolean;
  skipped: boolean;
  totalDiamonds: number;
  isNew: boolean;
  type?: LevelType;
  best?: LevelResult;
};

export type LevelResult = {
  diamonds: number;
  time: number;
  silverDiamond: number;
  stars: number;
};

export const LevelState = {
  Locked: 0,
  Initial: 1,
  OneStar: 2,
  TwoStars: 3,
  ThreeStars: 4,
} as const;

export type LevelState = (typeof LevelState)[keyof typeof LevelState];
