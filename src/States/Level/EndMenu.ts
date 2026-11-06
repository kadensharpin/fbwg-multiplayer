import { EndState } from "@/ProgressModel";
import { Animation, Game } from "phaser";
import StoneButton from "../Common/StoneButton";
import FinishCounter from "./FinishCounter";
import IngameMenu from "./IngameMenu";

class EndMenu extends IngameMenu<EndState> {
  finishCheck!: FinishCounter;
  diamondsCheck!: FinishCounter;
  timeCheck!: FinishCounter;
  animationDone: boolean = false;

  constructor(game: Game, options: EndState) {
    super(game, options);

    this.gotoMenu = this.gotoMenu.bind(this);
    this.renderContent = this.renderContent.bind(this);
  }

  renderContent() {
    this.finishCheck = new FinishCounter(this.game, "", "FinishIcon0000");
    this.diamondsCheck = new FinishCounter(this.game, "", "DiamondsIcon0000");
    this.timeCheck =
      "puzzle" === this.options.data.type
        ? new FinishCounter(this.game, "", "SilverIcon0000")
        : new FinishCounter(this.game, "", "TimeIcon0000");

    const diamondsCollected: number = this.options.state.diamonds;
    const diamondsTotal: number = this.options.data.totalDiamonds;
    const timeSpent = this.options.state.time;
    const timeTarget =
      "single" === this.game.settings.controls
        ? this.options.data.mobileTime
        : this.options.data.time;
    this.board.addChild(this.finishCheck);
    this.board.addChild(this.diamondsCheck);
    this.board.addChild(this.timeCheck);
    this.layoutContent();
    const continueButton = new StoneButton(
      this.game,
      0,
      this.contentSize.halfHeight - 140,
      this.game.lang.locale("Continue"),
      this.gotoMenu,
    );
    continueButton.disable();
    this.board.addChild(continueButton);
    const arrow = this.game.make.sprite(
      5,
      -60,
      "PopupAssets",
      "popupArrow0000",
    );
    arrow.anchor.set(0.5);
    this.board.addChild(arrow);
    const texture =
      "puzzle" === this.options.data.type
        ? "FinishStonePuzzle"
        : "speed" === this.options.data.type
          ? "FinishStoneSpeed"
          : "dark" === this.options.data.type
            ? "FinishStoneDark"
            : "FinishStone";
    const sprite = this.game.make.sprite(
      180,
      -60,
      "PopupAssets",
      texture + "0000",
    );
    sprite.animations.add(
      "to_1",
      Animation.generateFrameNames(texture, 1, 7, "", 4),
      30,
      false,
    );
    sprite.animations.add(
      "to_2",
      Animation.generateFrameNames(texture, 8, 14, "", 4),
      30,
      false,
    );
    sprite.animations.add(
      "to_3",
      Animation.generateFrameNames(texture, 15, 21, "", 4),
      30,
      false,
    );
    sprite.anchor.set(0.5);
    this.board.addChild(sprite);
    const checkDelay = 700;
    return setTimeout(() => {
      this.finishCheck.setAchieved(true);
      if (!this.game?.level) return;
      this.game.level.sounds?.endPass?.play();
      setTimeout(
        () => {
          if (!this.game?.level) return;
          this.game.level.sounds?.endPass?.play();
          this.diamondsCheck.setAchieved(diamondsCollected >= diamondsTotal);
          setTimeout(
            () => {
              if (!this.game?.level) return;
              this.game.level.sounds?.endPass?.play();
              this.timeCheck.setAchieved(
                this.options.data.type === "puzzle"
                  ? this.options.state.silverDiamond > 0
                  : timeSpent <= timeTarget,
              );
              setTimeout(
                () => {
                  if (!this.game?.level) return;
                  this.game.level.sounds?.endDiamond?.play();
                  arrow.frameName = "popupArrow0001";
                  sprite.animations.play("to_" + this.options.state.stars);
                  this.animationDone = true;
                  continueButton.enable();
                },
                this.timeCheck.visible ? checkDelay : 0,
              );
            },
            this.diamondsCheck.visible ? checkDelay : 0,
          );
        },
        this.finishCheck.visible ? checkDelay : 0,
      );
    }, checkDelay);
  }

  layoutContent() {
    super.layoutContent();
    this.finishCheck.x = -200;
    this.diamondsCheck.x = -200;
    this.timeCheck.x = -200;
    if (this.options.data.type === "puzzle") {
      this.diamondsCheck.visible = false;
      this.finishCheck.y = 0.5 * -this.contentSize.halfHeight + 60;
      this.timeCheck.y = 0.5 * -this.contentSize.halfHeight + 140;
    } else if (this.options.data.type === "dark") {
      this.finishCheck.y = 0.5 * -this.contentSize.halfHeight + 60;
      this.timeCheck.y = 0.5 * -this.contentSize.halfHeight + 140;
      this.diamondsCheck.visible = false;
    } else {
      this.finishCheck.y = 0.5 * -this.contentSize.halfHeight + 20;
      this.diamondsCheck.y = 0.5 * -this.contentSize.halfHeight + 100;
      this.timeCheck.y = 0.5 * -this.contentSize.halfHeight + 180;
    }
  }

  gotoMenu() {
    if (this.animationDone)
      this.game.state.fade("levelMenu", true, false, this.game.currentTemple);
  }
}

export default EndMenu;
