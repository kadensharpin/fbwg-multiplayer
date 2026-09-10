import * as box2d from "phaser-box2d";
import Body from "./Body";
import Box2D from "./Box2D";
import { AABBHit } from "./QueryCallback";

export default class RayCastCallback implements box2d.b2RayCastCallback {
  world: Box2D;
  closestHitOnly: boolean;
  filterFunction: RayCastFilterFunction | null;
  hits: RaycastHit[];

  constructor(
    world: Box2D,
    closestHitOnly: boolean,
    filterFunction: RayCastFilterFunction | null,
  ) {
    this.world = world;
    this.closestHitOnly = closestHitOnly;
    this.filterFunction = filterFunction;
    this.hits = [];
  }

  ReportFixture(
    fixture: box2d.b2Fixture,
    point: box2d.b2Vec2,
    normal: box2d.b2Vec2,
    number: number,
  ): number {
    if (this.filterFunction !== null) {
      var vO = {
        x: this.world.mpx(-point.x),
        y: this.world.mpx(-point.y),
      };
      var vO2 = {
        x: -normal.x,
        y: -normal.y,
      };
      var v58 = fixture.GetBody().parent;
      if (!this.filterFunction.call(this, v58, fixture, vO, vO2)) {
        return -1;
      }
    }
    if (this.closestHitOnly) {
      this.hits = [];
    }
    var vO3: RaycastHit = {
      body: fixture.GetBody().parent,
      fixture: fixture,
      point: { x: point.x, y: point.y },
      normal: { x: normal.x, y: normal.y },
    };
    this.hits.push(vO3);
    if (this.closestHitOnly) {
      return number;
    } else {
      return 1;
    }
  }
}

export type RayCastFilterFunction = (
  this: RayCastCallback,
  body: Body,
  fixture: box2d.b2Fixture,
  point: { x: number; y: number },
  normal: { x: number; y: number },
) => boolean;

export type RaycastHit = AABBHit & {
  point: { x: number; y: number };
  normal: { x: number; y: number };
};
