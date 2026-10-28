import box2d from "@box2d/core";
import Body from "./Body";
import Box2D from "./Box2D";

export default class QueryCallback {
  world: Box2D;
  hits: AABBHit[];

  constructor(world: Box2D) {
    this.ReportFixture = this.ReportFixture.bind(this);

    this.world = world;
    this.hits = [];
  }

  ReportFixture: box2d.b2QueryCallback = (fixture: box2d.b2Fixture) => {
    var vO4 = {
      body: fixture.GetBody().parent,
      fixture: fixture,
    };
    this.hits.push(vO4);
    return true;
  };
}

export type AABBHit = {
  body: Body;
  fixture: box2d.b2Fixture;
};
