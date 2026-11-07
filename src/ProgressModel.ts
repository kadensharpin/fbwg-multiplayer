import { Game } from "phaser";
import { LevelData, LevelResult, LevelState, Temple } from "./temple";

type GameData = { temples: Temple[]; gameComplete: boolean };

class ProgressModel {
  private data: null | GameData = null;
  firstComplete!: boolean;
  totalStars!: number;

  constructor(readonly game: Game) {
    this.save = this.save.bind(this);
    this.getStored = this.getStored.bind(this);
    this.erase = this.erase.bind(this);
    this.betterThan = this.betterThan.bind(this);
    this.setPlayed = this.setPlayed.bind(this);
    this.update = this.update.bind(this);
    this.setStates = this.setStates.bind(this);
    this.process = this.process.bind(this);
    this.fetch = this.fetch.bind(this);
  }

  get temples(): Temple[] {
    return this.data?.temples ?? [];
  }

  set temples(value: Temple[]) {
    this.data ??= { temples: [], gameComplete: false };
    this.data.temples = value;
  }

  get gameComplete(): boolean {
    return this.data?.gameComplete ?? false;
  }

  set gameComplete(value: boolean) {
    this.data ??= { temples: [], gameComplete: false };
    this.data.gameComplete = value;
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
      endState.data.skipped ||
      this.betterThan(endState.state, endState.data.best)
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

  erase() {
    this.game.storage.namespace = "fb-" + this.game.gameConfig.id;
    this.game.storage.clear();
  }

  save() {
    if (!this.data) return;
    this.game.storage.namespace = "fb-" + this.game.gameConfig.id;
    this.game.storage.setItem("progress", JSON.stringify(this.data));
  }

  async fetch(): Promise<void> {
    this.data = this.getStored();
    if (this.data && this.temples.length > 0) return;
    let temples = this.game.gameConfig.temples;
    if (!Array.isArray(temples)) temples = [temples];
    const baseUrl = this.game.load.baseURL;
    const requests = temples.map((temple) =>
      window
        .fetch(`${baseUrl}data/${temple}/temple.json`)
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
      this.temples = temples;
    });
  }

  private process() {
    let totalStars = 0;
    let complete = true;
    for (const temple of this.temples) {
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
    if (complete && !this.gameComplete) {
      this.firstComplete = true;
    }
    this.gameComplete = complete;
    this.totalStars = totalStars;
    for (const temple of this.temples) {
      temple.softLocked = this.totalStars < temple.minRequired;
    }
    for (const temple of this.temples) {
      this.setStates(temple);
    }
    for (const temple of this.temples) {
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

  private setStates(temple: Temple) {
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
          this.totalStars >= level.required && !level.locked
            ? LevelState.Initial
            : LevelState.Locked;
        if (this.game.config.devUnlock) {
          level.state = Math.max(level.state, 1) as LevelState;
        }
      }
    }
  }

  private betterThan(thisResult: LevelResult, bestResult?: LevelResult) {
    if (thisResult.stars === 0) return false;
    if (!bestResult) return true;
    if (thisResult.stars !== bestResult.stars)
      return thisResult.stars > bestResult.stars;
    if (thisResult.diamonds !== bestResult.diamonds)
      return thisResult.diamonds > bestResult.diamonds;
    return thisResult.time < bestResult.time;
  }

  private getStored(): GameData | null {
    this.game.storage.namespace = "fb-" + this.game.gameConfig.id;
    const item = this.game.storage.getItem("progress");
    if (item == null) return null;
    try {
      return JSON.parse(item);
    } catch (error) {
      return null;
    }
  }

  static get lastTemple(): string {
    return localStorage.getItem("last-temple") ?? "forest";
  }

  static set lastTemple(value: string) {
    localStorage.setItem("last-temple", value);
  }
}

export default ProgressModel;

export type EndState = {
  success: boolean;
  data: LevelData;
  state: LevelResult;

  retry(): void;
};
