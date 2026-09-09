import { Game, Plugin, PluginManager } from "phaser";
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

export class CacheBuster extends Plugin {
  static version = 1;

  constructor(game: Game, manager: PluginManager) {
    super(game, manager);

    this.patchLoader();
  }

  patchLoader() {
    Phaser.Loader.prototype.transformUrl = function (url: string, file?: any) {
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

export type Fixture<UserData> = Omit<box2d.b2Fixture, "m_userData"> & {
  m_userData: UserData;
};
