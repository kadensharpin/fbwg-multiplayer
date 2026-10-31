import box2d from "@box2d/core";
import Phaser, { Game, Loader, Plugin, PluginManager } from "phaser";
import _ from "underscore";

export function deepObjectExtend(target: any, source: any) {
  for (const key in source) {
    if (
      target[key] != null &&
      typeof target[key] === "object" &&
      typeof source[key] === "object"
    ) {
      deepObjectExtend(target[key], source[key]);
    } else if (target[key] == null) {
      target[key] = _.clone(source[key]);
    }
  }
  return target;
}

export function degToRad(deg: number | undefined | null): number {
  return Phaser.Math.degToRad(deg || 0);
}

export function radToDeg(rad: number | undefined | null): number {
  return Phaser.Math.radToDeg(rad || 0);
}

export function debug(game: Game) {
  game.raf.stop();
  debugger;
  game.raf.start();
}

export class CacheBuster extends Plugin {
  static version = 1;

  constructor(game: Game, manager: PluginManager) {
    super(game, manager);

    this.patchLoader();
  }

  patchLoader() {
    Loader.prototype.transformUrl = function (url: string, file?: any) {
      if (!url) {
        return "";
      }
      if (!url.startsWith("data:")) {
        url += "?v=" + CacheBuster.version;
      }
      if (url.match(/^(?:blob:|data:|http:\/\/|https:\/\/|\/\/)/) || !file) {
        return url;
      } else {
        return this.baseURL + file.path + url;
      }
    };
  }
}

export type Fixture<UserData> = Omit<
  box2d.b2Fixture,
  "m_userData" | "GetUserData" | "SetUserData"
> & {
  readonly m_userData: UserData;
  GetUserData(): UserData;
  SetUserData(userData: UserData): void;
};
