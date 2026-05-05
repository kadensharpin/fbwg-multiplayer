import { Sound } from "@azerion/phaser";

export type Sounds = {
  levelMusic?: Sound;
  levelMusicOver?: Sound;
  levelMusicFinish?: Sound;
  levelMusic_dark?: Sound;
  levelMusic_speed?: Sound;
  levelMusicFinish_speed?: Sound;

  charToggle1?: Sound;
  charToggle2?: Sound;

  endPass?: Sound;
  endFail?: Sound;
  endDiamond?: Sound;

  jump_fb?: Sound;
  jump_wg?: Sound;

  waterSteps?: Sound;
  iceSteps_fb?: Sound;
  iceSteps_wg?: Sound;

  death?: Sound;
  diamond?: Sound;
  door?: Sound;
  freeze?: Sound;
  melt?: Sound;

  menuMusic?: Sound;
  pusher?: Sound;
};
