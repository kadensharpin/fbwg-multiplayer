import { Game } from "@azerion/phaser";
import { Model } from "backbone";
import { LevelData, LevelResult, LevelState, Temple } from "./temple";
import { deepObjectExtend } from "./utils/util";

class ProgressModel extends Model {
  readonly game: Game;
  myKeys = [];
  firstComplete!: boolean;
  totalStars!: number;

  constructor(game: Game) {
    super();
    this.save = this.save.bind(this);
    this.getStored = this.getStored.bind(this);
    this.erase = this.erase.bind(this);
    this.betterThan = this.betterThan.bind(this);
    this.setPlayed = this.setPlayed.bind(this);
    this.update = this.update.bind(this);
    this.setStates = this.setStates.bind(this);
    this.process = this.process.bind(this);
    this.fetch = this.fetch.bind(this);
    this.on("sync", this.process);
    this.game = game;
    this.url = () => "";
  }

  fetch(): any {
    let keys = this.game.gameConfig.temples;
    if (!Array.isArray(keys)) keys = [keys];
    const requests = keys.map((temple) =>
      window
        .fetch(`./data/${temple}/temple.json`)
        .then((res) => res.json() as Promise<Temple>),
    );
    return Promise.allSettled(requests).then(async (responses) => {
      const temples: Temple[] = [];
      for (const response of responses) {
        if (response.status === "rejected") {
          alert("An error occurred while loading. Please refresh");
          return;
        }
        temples.push(response.value);
      }

      const store = (await this.getStored()) || {};
      this.setTemples(deepObjectExtend(temples, store));
      this.myKeys = [];
      this.trigger("sync");
    });
  }

  process() {
    let totalStars = 0;
    let complete = true;
    for (const temple of this.getTemples()) {
      for (const level of temple.levels) {
        if (level.best) {
          totalStars += level.best.stars;
        }
        if (!level.best || level.best.stars < 3) {
          complete = false;
        }
        temple.minRequired = Math.min(
          level.required || 0,
          temple.minRequired || 0,
        );
      }
    }
    if (complete && !this.isComplete()) {
      this.firstComplete = true;
    }
    this.setComplete(complete);
    this.totalStars = totalStars;
    for (const temple of this.getTemples()) {
      temple.softLocked = this.totalStars < temple.minRequired;
    }
    for (const temple of this.getTemples()) {
      this.setStates(temple);
    }
    for (const temple of this.getTemples()) {
      temple.hasNew = false;
      for (const level of temple.levels) {
        if (level.played || level.initial || level.locked) {
          level.isNew = false;
        } else {
          level.isNew = true;
          if (level.state > LevelState.Locked) temple.hasNew = true;
        }
      }
    }
    this.save();
  }

  setStates(temple: Temple) {
    const findLevel = (id: number) =>
      temple.levels.find((temple) => temple._id == id);
    if (temple.type === "tree") {
      for (const level of temple.levels) {
        if (level.best) {
          if (level.best.stars === 3) {
            level.state = LevelState.ThreeStars;
          } else if (level.best.stars === 2) {
            level.state = LevelState.TwoStars;
          } else if (level.best.stars === 1) {
            level.state = LevelState.OneStar;
          }
        } else {
          level.state = level.initial ? LevelState.Initial : LevelState.Locked;
          if (this.game.config.devUnlock) {
            level.state = Math.max(level.state, 1) as LevelState;
          }
        }
      }
      for (const edge of temple.edges) {
        const source = findLevel(edge.source);
        const target = findLevel(edge.target);

        if (!source) {
          alert("Invalid temple edge source id: " + edge.source);
          console.error("Invalid temple edge source id:", edge.source);
          continue;
        }

        if (!target) {
          alert("Invalid temple edge target id: " + edge.target);
          console.error("Invalid temple edge target id:", edge.target);
          continue;
        }

        if (
          (source.state > LevelState.Initial || source.skipped) &&
          target.state === LevelState.Locked
        ) {
          target.state = LevelState.Initial;
        } else if (
          (target.state > LevelState.Initial || target.skipped) &&
          source.state === LevelState.Locked
        ) {
          source.state = LevelState.Initial;
        }
      }
      return;
    }
    for (const level of temple.levels) {
      if (level.best && level.best.stars > 0) {
        if (level.best.stars === 3) {
          level.state = LevelState.ThreeStars;
        } else if (level.best.stars === 2) {
          level.state = LevelState.TwoStars;
        } else if (level.best.stars === 1) {
          level.state = LevelState.OneStar;
        }
      } else {
        level.state =
          this.game.progress.totalStars >= level.required && !level.locked
            ? LevelState.Initial
            : LevelState.Locked;
        if (this.game.config.devUnlock) {
          level.state = Math.max(level.state, 1) as LevelState;
        }
      }
    }
  }

  update(endState: EndState) {
    const targetTime =
      this.game.settings.controls === "single"
        ? endState.data.mobileTime
        : endState.data.time;
    let stars;
    if (endState.data.type === "puzzle") {
      stars = endState.state.silverDiamond > 0 ? 3 : 0;
    } else if (endState.data.type === "dark") {
      stars = endState.state.time <= targetTime ? 3 : 2;
    } else {
      stars = 1;
      if (endState.state.diamonds >= endState.data.totalDiamonds) stars++;
      if (endState.state.time <= targetTime) stars++;
    }
    endState.state.stars = stars;
    if (
      endState.state.stars > 0 &&
      (!endState.data.best ||
        this.betterThan(endState.state, endState.data.best))
    ) {
      endState.data.best = endState.state;
      this.process();
    }
  }

  setPlayed(level: LevelData) {
    if (level.played) return;
    level.played = true;
    this.process();
  }

  betterThan(thisResult: LevelResult, bestResult: LevelResult) {
    if (thisResult.stars !== bestResult.stars)
      return thisResult.stars > bestResult.stars;
    if (thisResult.diamonds !== bestResult.diamonds)
      return thisResult.diamonds > bestResult.diamonds;
    return thisResult.time < bestResult.time;
  }

  erase() {
    this.game.storage.setNamespace("fb-" + this.game.gameConfig.id);
    this.game.storage.clear();
  }

  getStored() {
    this.game.storage.setNamespace("fb-" + this.game.gameConfig.id);
    return this.game.storage
      .getItem("progress")
      .then(JSON.parse)
      .catch(() => null);
  }

  save() {
    this.game.storage.setNamespace("fb-" + this.game.gameConfig.id);
    this.game.storage.setItem("progress", JSON.stringify(this.toJSON()));
  }

  private getTemples(): Temple[] {
    return super.get("temples");
  }

  private setTemples(temples: Temple[]) {
    super.set("temples", temples);
  }

  private isComplete(): boolean {
    return super.get("gameComplete");
  }

  private setComplete(complete: boolean) {
    super.set("gameComplete", complete);
  }
}

export default ProgressModel;

export type EndState = {
  success: boolean;
  data: LevelData;
  state: LevelResult;

  retry(): void;
};
