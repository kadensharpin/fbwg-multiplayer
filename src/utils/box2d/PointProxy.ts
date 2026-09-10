import Box2D from "./Box2D";

export default class PointProxy {
  world: Box2D;
  object: any;
  gettor: Function;
  settor: Function;

  constructor(world: Box2D, object: any, gettor: Function, settor: Function) {
    this.world = world;
    this.object = object;
    this.gettor = gettor;
    this.settor = settor;
  }
  get x() {
    return this.world.mpx(-this.gettor.call(this.object).x);
  }
  set x(newX) {
    var point = this.gettor.call(this.object);
    point.x = this.world.pxm(-newX);
    this.settor.call(this.object, point);
  }
  get y() {
    return this.world.mpx(-this.gettor.call(this.object).y);
  }
  set y(newY) {
    var point = this.gettor.call(this.object);
    point.y = this.world.pxm(-newY);
    this.settor.call(this.object, point);
  }
}
