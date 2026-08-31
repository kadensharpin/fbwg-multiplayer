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

export type Fixture<UserData> = Omit<box2d.b2Fixture, "m_userData"> & {
  m_userData: UserData;
};
