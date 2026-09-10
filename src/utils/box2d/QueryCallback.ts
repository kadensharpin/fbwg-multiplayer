import * as box2d from "phaser-box2d";
import Body from "./Body";
import Box2D from "./Box2D";

export default class QueryCallback implements box2d.b2QueryCallback {
  world: Box2D;
  hits: AABBHit[];

  constructor(world: Box2D) {
    this.world = world;
    this.hits = [];
  }

  ReportFixture(fixture: box2d.b2Fixture) {
    var vO4 = {
      body: fixture.GetBody().parent,
      fixture: fixture,
    };
    this.hits.push(vO4);
    return true;
  }
}

export type AABBHit = {
  body: Body;
  fixture: box2d.b2Fixture;
};
