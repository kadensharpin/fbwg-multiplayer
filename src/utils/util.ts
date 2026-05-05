import _ from "underscore";

export function deepObjectExtend(target: any, source: any) {
  for (const field in source) {
    if (target[field] == null) continue;

    if (
      typeof target[field] === "object" &&
      typeof source[field] === "object"
    ) {
      deepObjectExtend(target[field], source[field]);
    } else {
      target[field] = _.clone(source[field]);
    }
  }
  return target;
}
