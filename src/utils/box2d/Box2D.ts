import box2d, { XY } from "@box2d/core";
import { DebugDraw } from "@box2d/debug-draw";
import { b2ParticleSystem } from "@box2d/particles";
import {
  Color,
  Game,
  Group,
  Math,
  Physics,
  PIXI,
  Point,
  Signal,
  Sprite,
  Tilemap,
  TilemapLayer,
  Utils,
} from "phaser";
import Body from "./Body";
import DefaultContactListener from "./DefaultContactListener";
import PointProxy from "./PointProxy";
import Polygon from "./Polygon";
import QueryCallback, { AABBHit } from "./QueryCallback";
import RayCastCallback, {
  RayCastFilterFunction,
  RaycastHit,
} from "./RayCastCallback";

declare module "@box2d/core" {
  interface b2Body {
    parent: Body;
    world: box2d.b2World;
  }

  interface b2Fixture {
    id: number;
  }
}

class Box2D {
  static worldBoundsFilterCategory = 32768;
  game: Game;
  version: string;
  ptmRatio: number;
  world: box2d.b2World;
  debugDraw: DebugDraw | undefined;
  debugDrawColour: box2d.b2Color;
  debugDrawFlags = new DebugDrawFlags();
  contactListener: DefaultContactListener;
  nextBodyId: number;
  nextFixtureId: number;
  gravity: PointProxy;
  friction: number;
  restitution: number;
  density: number;
  frameRate: number;
  velocityIterations: number;
  positionIterations: number;
  particleIterations: number;
  useElapsedTime: boolean;
  paused: boolean;
  particleSystem: b2ParticleSystem | null;
  mouseJointBody: box2d.b2Body;
  mouseJoint: box2d.b2MouseJoint | null;
  walls: {
    left: any;
    right: any;
    top: any;
    bottom: any;
  };
  onBodyAdded: Signal<[Body]>;
  onBodyRemoved: Signal<[Body]>;
  private _toRemove: Body[];

  constructor(game: Game, config?: any) {
    this.game = game;
    this.version = "1.0.2";
    this.ptmRatio = 50;
    this.world = box2d.b2World.Create(new box2d.b2Vec2(0, 0));
    this.debugDrawColour = new box2d.b2Color(0, 0, 0, 1);
    this.contactListener = new DefaultContactListener();
    this.world.SetContactListener(this.contactListener);
    this.nextBodyId = 0;
    this.nextFixtureId = 0;
    this.gravity = new PointProxy(
      this,
      this.world,
      this.world.GetGravity,
      this.world.SetGravity,
    );
    this.friction = 0.2;
    this.restitution = 0;
    this.density = 1;
    this.frameRate = 1 / 60;
    this.velocityIterations = 8;
    this.positionIterations = 3;
    this.particleIterations = 3;
    this.useElapsedTime = false;
    this.paused = false;
    this.particleSystem = null;
    this.mouseJointBody = this.world.CreateBody({});
    this.mouseJoint = null;
    if (config.hasOwnProperty("mpx") && config.hasOwnProperty("pxm")) {
      this.mpx = config.mpx;
      this.pxm = config.pxm;
    }
    this.walls = {
      left: null,
      right: null,
      top: null,
      bottom: null,
    };
    this.onBodyAdded = new Signal();
    this.onBodyRemoved = new Signal();
    this._toRemove = [];
  }

  getNextBodyId() {
    var id = this.nextBodyId;
    this.nextBodyId += 1;
    return id;
  }

  getNextFixtureId() {
    var id = this.nextFixtureId;
    this.nextFixtureId += 1;
    return id;
  }

  removeBodyNextStep(body: Body) {
    this._toRemove.push(body);
  }

  preUpdate() {
    for (var i = this._toRemove.length; i--; ) {
      this.removeBody(this._toRemove[i]);
    }
    this._toRemove.length = 0;
  }

  enable(object: any, children = true) {
    var vLN1 = 1;
    if (Array.isArray(object)) {
      for (vLN1 = object.length; vLN1--; ) {
        if (object[vLN1] instanceof Group) {
          this.enable(object[vLN1].children, children);
        } else {
          this.enableBody(object[vLN1]);
          if (
            children &&
            object[vLN1].hasOwnProperty("children") &&
            object[vLN1].children.length > 0
          ) {
            this.enable(object[vLN1], true);
          }
        }
      }
    } else if (object instanceof Group) {
      this.enable(object.children, children);
    } else {
      this.enableBody(object);
      if (
        children &&
        object.hasOwnProperty("children") &&
        object.children.length > 0
      ) {
        this.enable(object.children, true);
      }
    }
  }

  enableBody(object: any) {
    if (object.hasOwnProperty("body") && object.body === null) {
      object.body = new Body(this.game, object, object.x, object.y, 2);
      object.anchor.set(0.5);
    }
  }

  setBoundsToWorld(
    left = true,
    right = true,
    top = true,
    bottom = true,
    collisionCategory = 1,
    collisionMask?: number,
  ) {
    if (collisionMask === undefined) {
      collisionCategory = 4294967295;
    }
    this.setBounds(
      this.game.world.bounds.x,
      this.game.world.bounds.y,
      this.game.world.bounds.width,
      this.game.world.bounds.height,
      left,
      right,
      top,
      bottom,
      collisionCategory,
      collisionMask,
    );
  }

  setBounds(
    x: number,
    y: number,
    width: number,
    height: number,
    left = true,
    right = true,
    top = true,
    bottom = true,
    _collisionCategory = 1,
    _collisionMask = 4294967295,
  ) {
    if (this.walls.left) {
      this.removeBody(this.walls.left);
    }
    if (this.walls.right) {
      this.removeBody(this.walls.right);
    }
    if (this.walls.top) {
      this.removeBody(this.walls.top);
    }
    if (this.walls.bottom) {
      this.removeBody(this.walls.bottom);
    }
    var v5 = new box2d.b2PolygonShape();
    var v6: box2d.b2FixtureDef = {
      shape: v5,
      filter: {
        categoryBits: Box2D.worldBoundsFilterCategory,
        maskBits: 65535,
      },
    };
    var v7 = this.pxm(100);
    var v8 = new PIXI.Rectangle(x, y, width, height);
    if (left) {
      this.walls.left = this.createBody(0, 0, 0);
      v5.SetAsBox(
        v7,
        this.pxm(v8.height) + v7,
        new box2d.b2Vec2(v7 - this.pxm(v8.x), -this.pxm(v8.y)),
        0,
      );
      var v12 = this.walls.left.data.CreateFixture(v6);
      v12.id = this.getNextFixtureId();
    }
    if (right) {
      this.walls.right = this.createBody(0, 0, 0);
      v5.SetAsBox(
        v7,
        this.pxm(v8.height) + v7,
        new box2d.b2Vec2(
          this.pxm(-v8.width) - v7 - this.pxm(v8.x),
          -this.pxm(v8.y),
        ),
        0,
      );
      var v12 = this.walls.right.data.CreateFixture(v6);
      v12.id = this.getNextFixtureId();
    }
    if (top) {
      this.walls.top = this.createBody(0, 0, 0);
      v5.SetAsBox(
        this.pxm(v8.width) + v7,
        v7,
        new box2d.b2Vec2(-this.pxm(v8.x), v7 - this.pxm(v8.y)),
        0,
      );
      var v12 = this.walls.top.data.CreateFixture(v6);
      v12.id = this.getNextFixtureId();
    }
    if (bottom) {
      this.walls.bottom = this.createBody(0, 0, 0);
      v5.SetAsBox(
        this.pxm(v8.width) + v7,
        v7,
        new box2d.b2Vec2(
          -this.pxm(v8.x),
          this.pxm(-v8.height) - v7 - this.pxm(v8.y),
        ),
        0,
      );
      var v12 = this.walls.bottom.data.CreateFixture(v6);
      v12.id = this.getNextFixtureId();
    }
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }

  update() {
    if (this.paused) return;
    if (this.useElapsedTime) {
      this.world.Step(this.game.time.physicsElapsed, {
        velocityIterations: this.velocityIterations,
        positionIterations: this.positionIterations,
        particleIterations: this.particleIterations,
      });
    } else {
      this.world.Step(this.frameRate, {
        velocityIterations: this.velocityIterations,
        positionIterations: this.positionIterations,
        particleIterations: this.particleIterations,
      });
    }
  }

  reset() {
    this.clear();
  }

  clear() {
    var v13 = this.world.GetGravity().Clone();
    this.world = box2d.b2World.Create(v13);
    this.world.SetContactListener(this.contactListener);
    this._toRemove = [];
  }

  destroy() {
    this.clear();
    // @ts-expect-error
    this.gravity = null;
    // @ts-expect-error
    this.world = null;
    // @ts-expect-error
    this.game = null;
  }

  createBody(x?: number, y?: number, density?: number) {
    return new Body(this.game, null, x, y, density, this);
  }

  createCircle(
    x?: number,
    y?: number,
    radius?: number,
    offsetX?: number,
    offsetY?: number,
  ) {
    return this.createBody(x, y, 2).setCircle(radius, offsetX, offsetY);
  }

  createRectangle(
    x?: number,
    y?: number,
    width?: number,
    height?: number,
    offsetX?: number,
    offsetY?: number,
    rotation?: number,
  ) {
    return this.createBody(x, y, 2).setRectangle(
      width,
      height,
      offsetX,
      offsetY,
      rotation,
    );
  }

  createPolygon(
    x: number,
    y: number,
    vertices: number[],
    firstIndex?: number,
    count?: number,
  ) {
    return this.createBody(x, y, 2).setPolygon(vertices, firstIndex, count);
  }

  addBody(body: Body) {
    if (body.data.world) return false;
    body.data = this.world.CreateBody(body.bodyDef);
    body.data.world = this.world;
    body.data.parent = body;
    this.onBodyAdded.dispatch(body);
    return true;
  }

  removeBody(body: Body) {
    if (body.data.world == this.world) {
      this.world.DestroyBody(body.data);
      this.onBodyRemoved.dispatch(body);
    }
    return body;
  }

  getBodies() {
    var vA = [];
    for (var v14 = this.world.GetBodyList(); v14; v14 = v14.GetNext()) {
      vA.push(v14);
    }
    return vA;
  }

  getBody(object: box2d.b2Body | Body | Sprite) {
    if (object instanceof box2d.b2Body) {
      return object;
    } else if (object instanceof Body) {
      return object.data;
    } else if (object.body && object.body.type === Physics.BOX2D) {
      return object.body.data;
    } else {
      return null;
    }
  }

  mpx(v: number) {
    return v * this.ptmRatio;
  }

  pxm(v: number) {
    return v / this.ptmRatio;
  }

  renderDebugDraw(context: CanvasRenderingContext2D) {
    if (this.game.physics.box2d) {
      const world = this.game.physics.box2d;
      world.debugDraw = new DebugDraw(context);
      const colour = new box2d.b2Color(0, 0, 0);
      let transform = new box2d.b2Transform();
      if (world.debugDrawFlags.shapes) {
        let body = world.world.GetBodyList();
        while (body !== null) {
          world.debugDraw.PushTransform(transform);
          let fixture = body.GetFixtureList();
          while (fixture !== null) {
            if (body.IsEnabled() === false) {
              colour.SetRGB(0.5, 0.5, 0.3);
              DrawShape(world.debugDraw, fixture, colour);
            } else if (body.GetType() === box2d.b2BodyType.b2_staticBody) {
              colour.SetRGB(0.5, 0.9, 0.5);
              DrawShape(world.debugDraw, fixture, colour);
            } else if (body.GetType() === box2d.b2BodyType.b2_kinematicBody) {
              colour.SetRGB(0.5, 0.5, 0.9);
              DrawShape(world.debugDraw, fixture, colour);
            } else if (body.IsAwake() === false) {
              colour.SetRGB(0.6, 0.6, 0.6);
              DrawShape(world.debugDraw, fixture, colour);
            } else {
              colour.SetRGB(0.9, 0.7, 0.7);
              DrawShape(world.debugDraw, fixture, colour);
            }
            fixture = fixture.GetNext();
          }
          world.debugDraw.PopTransform(transform);
          body = body.GetNext();
        }
      }
      if (this.debugDrawFlags.joints) {
        let joint = world.world.GetJointList();
        while (joint !== null) {
          DrawJoint(world.debugDraw, joint, colour);
          joint = joint.GetNext();
        }
      }
      if (this.debugDrawFlags.aabbs) {
        // colour.SetRGB(0.9, 0.3, 0.9);
        // const broadPhase = world.world.GetContactManager().m_broadPhase;
        // let body = world.world.GetBodyList();
        // while (body !== null) {
        //   if (body.IsEnabled() !== false) {
        //     let fixture = body.GetFixtureList();
        //     while (fixture !== null) {
        //       for (let i = 0; i < fixture.m_proxyCount; ++i) {
        //         let proxy = fixture.m_proxies[i];
        //         let aabb = broadPhase.GetFatAABB(proxy.proxy);
        //         world.debugDraw.DrawPolygon(
        //           [
        //             { x: aabb.lowerBound.x, y: aabb.lowerBound.y },
        //             { x: aabb.upperBound.x, y: aabb.lowerBound.y },
        //             { x: aabb.upperBound.x, y: aabb.upperBound.y },
        //             { x: aabb.lowerBound.x, y: aabb.upperBound.y },
        //           ],
        //           4,
        //           colour,
        //         );
        //       }
        //       fixture = fixture.GetNext();
        //     }
        //   }
        //   body = body.GetNext();
        // }
      }
      if (this.debugDrawFlags.centerOfMass) {
        let body = world.world.GetBodyList();
        while (body !== null) {
          transform.q.Copy(body.GetTransform().q);
          transform.p.Copy(body.GetWorldCenter());
          world.debugDraw.DrawTransform(transform);
          body = body.GetNext();
        }
      }
      if (this.debugDrawFlags.controllers) {
        // for (
        //   let controller = this.m_controllerList;
        //   controller;
        //   controller = controller.m_next
        // ) {
        //   controller.Draw(world.debugDraw);
        // }
      }
      world.debugDraw.Finish();
    }
  }

  renderBodyInfo(debug: Utils.Debug, body: Body) {
    debug.line(
      "Position: x: " + body.x.toFixed(3) + " y: " + body.y.toFixed(3),
    );
    debug.line("Rotation: " + body.rotation.toFixed(3) + " degrees");
    debug.line(
      "Velocity: x: " +
        body.velocity.x.toFixed(3) +
        " y: " +
        body.velocity.y.toFixed(3),
    );
    debug.line(
      "Angular velocity: " + body.angularVelocity.toFixed(3) + " degrees/sec",
    );
  }

  getFixturesAtPoint(
    x: number,
    y: number,
    onlyOne = false,
    onlyDynamic = false,
  ) {
    var v16 = this.pxm(-x);
    var v17 = this.pxm(-y);
    var v18 = new box2d.b2Vec2(v16, v17);
    var v19 = new box2d.b2AABB();
    var v20 = new box2d.b2Vec2();
    v20.Set(0.001, 0.001);
    b2SubVV(v18, v20, v19.lowerBound);
    b2AddVV(v18, v20, v19.upperBound);
    var vA2: box2d.b2Fixture[] = [];
    var vF = function (fixture: box2d.b2Fixture) {
      return (
        (!!onlyDynamic &&
          fixture.GetBody().GetType() !== box2d.b2BodyType.b2_dynamicBody) ||
        !fixture.TestPoint(v18) ||
        (vA2.push(fixture), !onlyOne)
      );
    };
    this.world.QueryAABB(v19, vF);
    return vA2;
  }

  getBodiesAtPoint(x: number, y: number, onlyOne = false, onlyDynamic = false) {
    var v21 = this.getFixturesAtPoint(x, y, onlyOne, onlyDynamic);
    if (v21.length < 1) {
      return v21;
    }
    var vA3: Body[] = [];
    for (var vLN0 = 0; vLN0 < v21.length; vLN0++) {
      vA3.push(v21[vLN0].GetBody().parent);
    }
    vA3.filter(function (body, index) {
      return vA3.indexOf(body) === index;
    });
    return vA3;
  }

  mouseDragStart(point: Point) {
    this.mouseDragEnd();
    var v22 = this.getFixturesAtPoint(point.x, point.y, true, true);
    if (!(v22.length < 1)) {
      var v23 = this.pxm(-point.x);
      var v24 = this.pxm(-point.y);
      var v25 = new box2d.b2Vec2(v23, v24);
      var v26 = new box2d.b2MouseJointDef();
      v26.bodyA = this.mouseJointBody;
      v26.bodyB = v22[0].GetBody();
      v26.target.Copy(v25);
      v26.maxForce = v26.bodyB.GetMass() * 1000;
      this.mouseJoint = this.world.CreateJoint(v26);
      v26.bodyB.SetAwake(true);
    }
  }

  mouseDragMove(point: Point) {
    if (this.mouseJoint) {
      var v27 = this.pxm(-point.x);
      var v28 = this.pxm(-point.y);
      var v29 = new box2d.b2Vec2(v27, v28);
      this.mouseJoint.SetTarget(v29);
    }
  }

  mouseDragEnd() {
    if (this.mouseJoint) {
      this.world.DestroyJoint(this.mouseJoint);
      this.mouseJoint = null;
    }
  }

  distanceJoint(
    bodyA: Body | Sprite,
    bodyB: Body | Sprite,
    length = 0,
    ax = 0,
    ay = 0,
    bx = 0,
    by = 0,
    _frequency = 0,
    damping = 0,
  ): box2d.b2DistanceJoint {
    ay = this.pxm(-ay);
    bx = this.pxm(-bx);
    by = this.pxm(-by);
    length = this.pxm(-length);
    if (bodyA instanceof Sprite) {
      bodyA = bodyA.body;
    }
    if (bodyB instanceof Sprite) {
      bodyB = bodyB.body;
    }
    var v30 = new box2d.b2DistanceJointDef();
    v30.bodyA = bodyA.data;
    v30.bodyB = bodyB.data;
    v30.localAnchorA.Set(ay, bx);
    v30.localAnchorB.Set(by, length);
    if (ax === null || ax === undefined) {
      var v31 = new box2d.b2Vec2();
      var v32 = new box2d.b2Vec2();
      v30.bodyA.GetWorldPoint(v30.localAnchorA, v31);
      v30.bodyB.GetWorldPoint(v30.localAnchorB, v32);
      v31.Subtract(v32);
      ax = v31.Length();
    } else {
      ax = this.pxm(ax);
    }
    v30.length = ax;
    // v30.frequencyHz = frequency;
    v30.damping = damping;
    return this.world.CreateJoint(v30);
  }

  // ropeJoint(
  //   bodyA: Body | Sprite,
  //   bodyB: Body | Sprite,
  //   length?: number,
  //   ax = 0,
  //   ay = 0,
  //   bx = 0,
  //   by = 0,
  // ): box2d.b2RopeJoint {
  //   ax = this.pxm(-ax);
  //   ay = this.pxm(-ay);
  //   bx = this.pxm(-bx);
  //   by = this.pxm(-by);
  //   if (bodyA instanceof Sprite) {
  //     bodyA = bodyA.body;
  //   }
  //   if (bodyB instanceof Sprite) {
  //     bodyB = bodyB.body;
  //   }
  //   var v33 = new box2d.b2RopeJointDef();
  //   v33.bodyA = bodyA.data;
  //   v33.bodyB = bodyB.data;
  //   v33.localAnchorA.Set(ax, ay);
  //   v33.localAnchorB.Set(bx, by);
  //   if (length === null || length === undefined) {
  //     var v34 = new box2d.b2Vec2();
  //     var v35 = new box2d.b2Vec2();
  //     v33.bodyA.GetWorldPoint(v33.localAnchorA, v34);
  //     v33.bodyB.GetWorldPoint(v33.localAnchorB, v35);
  //     v34.Subtract(v35);
  //     length = v34.Length();
  //   } else {
  //     length = this.pxm(length);
  //   }
  //   v33.maxLength = length;
  //   return this.world.CreateJoint(v33);
  // }

  revoluteJoint(
    bodyA: Body | Sprite,
    bodyB: Body | Sprite,
    ax = 0,
    ay = 0,
    bx = 0,
    by = 0,
    motorSpeed = 0,
    motorTorque = 0,
    motorEnabled = false,
    lowerLimit = 0,
    upperLimit = 0,
    limitEnabled = false,
  ): box2d.b2RevoluteJoint {
    ax = this.pxm(-ax);
    ay = this.pxm(-ay);
    bx = this.pxm(-bx);
    by = this.pxm(-by);
    if (bodyA instanceof Sprite) {
      bodyA = bodyA.body;
    }
    if (bodyB instanceof Sprite) {
      bodyB = bodyB.body;
    }
    var v36 = new box2d.b2RevoluteJointDef();
    v36.bodyA = bodyA.data;
    v36.bodyB = bodyB.data;
    v36.localAnchorA.Set(ax, ay);
    v36.localAnchorB.Set(bx, by);
    v36.motorSpeed = Math.degToRad(-motorSpeed);
    v36.maxMotorTorque = motorTorque;
    v36.enableMotor = motorEnabled;
    v36.lowerAngle = Math.degToRad(lowerLimit);
    v36.upperAngle = Math.degToRad(upperLimit);
    v36.enableLimit = limitEnabled;
    return this.world.CreateJoint(v36);
  }

  prismaticJoint(
    bodyA: Body | Sprite,
    bodyB: Body | Sprite,
    axisX = 1,
    axisY = 0,
    ax = 0,
    ay = 0,
    bx = 0,
    by = 0,
    motorSpeed = 0,
    motorForce = 0,
    motorEnabled = false,
    lowerLimit = 0,
    upperLimit = 0,
    limitEnabled = false,
    offsetAngle = 0,
  ): box2d.b2PrismaticJoint {
    axisX *= -1;
    axisY *= -1;
    ax = this.pxm(-ax);
    ay = this.pxm(-ay);
    bx = this.pxm(-bx);
    by = this.pxm(-by);
    motorSpeed = this.pxm(motorSpeed);
    lowerLimit = this.pxm(lowerLimit);
    upperLimit = this.pxm(upperLimit);
    if (bodyA instanceof Sprite) {
      bodyA = bodyA.body;
    }
    if (bodyB instanceof Sprite) {
      bodyB = bodyB.body;
    }
    var v37 = new box2d.b2PrismaticJointDef();
    v37.bodyA = bodyA.data;
    v37.bodyB = bodyB.data;
    v37.localAxisA.Set(axisX, axisY);
    v37.localAnchorA.Set(ax, ay);
    v37.localAnchorB.Set(bx, by);
    v37.motorSpeed = motorSpeed;
    v37.maxMotorForce = motorForce;
    v37.enableMotor = motorEnabled;
    v37.lowerTranslation = lowerLimit;
    v37.upperTranslation = upperLimit;
    v37.enableLimit = limitEnabled;
    v37.referenceAngle = Math.degToRad(-offsetAngle);
    return this.world.CreateJoint(v37);
  }

  frictionJoint(
    bodyA: Body | Sprite,
    bodyB: Body | Sprite,
    maxForce = 0,
    maxTorque = 0,
    ax = 0,
    ay = 0,
    bx = 0,
    by = 0,
  ): box2d.b2FrictionJoint {
    ax = this.pxm(-ax);
    ay = this.pxm(-ay);
    bx = this.pxm(-bx);
    by = this.pxm(-by);
    if (bodyA instanceof Sprite) {
      bodyA = bodyA.body;
    }
    if (bodyB instanceof Sprite) {
      bodyB = bodyB.body;
    }
    var v38 = new box2d.b2FrictionJointDef();
    v38.bodyA = bodyA.data;
    v38.bodyB = bodyB.data;
    v38.localAnchorA.Set(ax, ay);
    v38.localAnchorB.Set(bx, by);
    v38.maxForce = maxForce;
    v38.maxTorque = maxTorque;
    return this.world.CreateJoint(v38);
  }

  weldJoint(
    bodyA: Body | Sprite,
    bodyB: Body | Sprite,
    ax = 0,
    ay = 0,
    bx = 0,
    by = 0,
    _frequency = 0,
    damping = 0,
  ): box2d.b2WeldJoint {
    ax = this.pxm(-ax);
    ay = this.pxm(-ay);
    bx = this.pxm(-bx);
    by = this.pxm(-by);
    if (bodyA instanceof Sprite) {
      bodyA = bodyA.body;
    }
    if (bodyB instanceof Sprite) {
      bodyB = bodyB.body;
    }
    var v39 = new box2d.b2WeldJointDef();
    v39.bodyA = bodyA.data;
    v39.bodyB = bodyB.data;
    v39.localAnchorA.Set(ax, ay);
    v39.localAnchorB.Set(bx, by);
    // v39.frequencyHz = frequency;
    v39.damping = damping;
    return this.world.CreateJoint(v39);
  }

  motorJoint(
    bodyA: Body | Sprite,
    bodyB: Body | Sprite,
    ax = 0,
    ay = 0,
    bx = 1,
    by = 0,
    frequency = 0,
    damping = 0,
  ): box2d.b2MotorJoint {
    by = this.pxm(-by);
    frequency = this.pxm(-frequency);
    if (bodyA instanceof Sprite) {
      bodyA = bodyA.body;
    }
    if (bodyB instanceof Sprite) {
      bodyB = bodyB.body;
    }
    var v40 = new box2d.b2MotorJointDef();
    v40.bodyA = bodyA.data;
    v40.bodyB = bodyB.data;
    v40.linearOffset.Set(by, frequency);
    v40.maxForce = ax;
    v40.maxTorque = ay;
    v40.angularOffset = Math.degToRad(-damping);
    v40.correctionFactor = bx;
    return this.world.CreateJoint(v40);
  }

  wheelJoint(
    bodyA: Body | Sprite,
    bodyB: Body | Sprite,
    ax = 0,
    ay = 0,
    bx = 0,
    by = 0,
    axisX = 0,
    axisY = 1,
    _frequency = 0,
    damping = 0,
    motorSpeed = 0,
    motorTorque = 0,
    motorEnabled = false,
  ): box2d.b2WheelJoint {
    axisX *= -1;
    axisY *= -1;
    ax = this.pxm(-ax);
    ay = this.pxm(-ay);
    bx = this.pxm(-bx);
    by = this.pxm(-by);
    if (bodyA instanceof Sprite) {
      bodyA = bodyA.body;
    }
    if (bodyB instanceof Sprite) {
      bodyB = bodyB.body;
    }
    var v41 = new box2d.b2WheelJointDef();
    v41.bodyA = bodyA.data;
    v41.bodyB = bodyB.data;
    v41.localAxisA.Set(axisX, axisY);
    v41.localAnchorA.Set(ax, ay);
    v41.localAnchorB.Set(bx, by);
    v41.motorSpeed = Math.degToRad(-motorSpeed);
    v41.maxMotorTorque = motorTorque;
    v41.enableMotor = motorEnabled;
    // v41.frequencyHz = frequency;
    v41.damping = damping;
    return this.world.CreateJoint(v41);
  }

  pulleyJoint(
    bodyA: Body | Sprite,
    bodyB: Body | Sprite,
    ax = 0,
    ay = 0,
    bx = 0,
    by = 0,
    gax = 0,
    gay = 0,
    gbx = 0,
    gby = 0,
    ratio = 1,
    lengthA = 100,
    lengthB = 100,
  ): box2d.b2PulleyJoint {
    ax = this.pxm(-ax);
    ay = this.pxm(-ay);
    bx = this.pxm(-bx);
    by = this.pxm(-by);
    gax = this.pxm(-gax);
    gay = this.pxm(-gay);
    gbx = this.pxm(-gbx);
    gby = this.pxm(-gby);
    lengthA = this.pxm(lengthA);
    lengthB = this.pxm(lengthB);
    if (bodyA instanceof Sprite) {
      bodyA = bodyA.body;
    }
    if (bodyB instanceof Sprite) {
      bodyB = bodyB.body;
    }
    var v42 = new box2d.b2PulleyJointDef();
    v42.bodyA = bodyA.data;
    v42.bodyB = bodyB.data;
    v42.localAnchorA.Set(ax, ay);
    v42.localAnchorB.Set(bx, by);
    v42.groundAnchorA.Set(gax, gay);
    v42.groundAnchorB.Set(gbx, gby);
    v42.lengthA = lengthA;
    v42.lengthB = lengthB;
    v42.ratio = ratio;
    return this.world.CreateJoint(v42);
  }

  gearJoint(
    joint1: box2d.b2RevoluteJoint | box2d.b2PrismaticJoint,
    joint2: box2d.b2RevoluteJoint | box2d.b2PrismaticJoint,
    ratio = 1,
  ): box2d.b2GearJoint {
    var v43 = new box2d.b2GearJointDef();
    v43.joint1 = joint1;
    v43.joint2 = joint2;
    v43.ratio = -ratio;
    v43.bodyA = joint1.GetBodyA();
    v43.bodyB = joint2.GetBodyB();
    return this.world.CreateJoint(v43);
  }

  clearTilemapLayerBodies(map: Tilemap, layer: number | string | TilemapLayer) {
    layer = map.getLayer(layer);
    for (var v44 = map.layers[layer].bodies.length; v44--; ) {
      map.layers[layer].bodies[v44].destroy();
    }
    map.layers[layer].bodies.length = 0;
  }

  convertTilemap(
    map: Tilemap,
    layer: number | string | TilemapLayer,
    addToWorld = true,
    optimize = true,
  ): Body[] {
    layer = map.getLayer(layer);
    this.clearTilemapLayerBodies(map, layer);
    var vLN02 = 0;
    var vLN03 = 0;
    var vLN04 = 0;
    for (var vLN05 = 0, v45 = map.layers[layer].height; vLN05 < v45; vLN05++) {
      vLN02 = 0;
      for (var vLN06 = 0, v46 = map.layers[layer].width; vLN06 < v46; vLN06++) {
        var v47 = map.layers[layer].data[vLN05][vLN06];
        if (v47 && v47.index > -1 && v47.collides) {
          if (optimize) {
            var v48 = map.getTileRight(layer, vLN06, vLN05);
            if (vLN02 === 0) {
              vLN03 = v47.x * v47.width;
              vLN04 = v47.y * v47.height;
              vLN02 = v47.width;
            }
            if (v48 && v48.collides) {
              vLN02 += v47.width;
            } else {
              var v50 = new Body(this.game, null, vLN03, vLN04, 0);
              v50.addRectangle(vLN02, v47.height, vLN02 / 2, v47.height / 2, 0);
              if (addToWorld) {
                this.addBody(v50);
              }
              map.layers[layer].bodies.push(v50);
              vLN02 = 0;
            }
          } else {
            var v50 = this.createBody(v47.x * v47.width, v47.y * v47.height, 0);
            v50.addRectangle(
              v47.width,
              v47.height,
              v47.width / 2,
              v47.height / 2,
              0,
            );
            if (addToWorld) {
              this.addBody(v50);
            }
            map.layers[layer].bodies.push(v50);
          }
        }
      }
    }
    return map.layers[layer].bodies;
  }

  raycast(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    closestHitOnly = true,
    filterFunction: RayCastFilterFunction | null = null,
  ): RaycastHit[] {
    x1 = this.pxm(-x1);
    y1 = this.pxm(-y1);
    x2 = this.pxm(-x2);
    y2 = this.pxm(-y2);
    var v51 = new box2d.b2Vec2(x1, y1);
    var v52 = new box2d.b2Vec2(x2, y2);
    var vA4: RaycastHit[] = [];
    var v53 = new RayCastCallback(this, closestHitOnly, filterFunction);
    this.world.RayCast(v51, v52, v53.Callback);
    for (var vLN07 = 0; vLN07 < v53.hits.length; vLN07++) {
      var v54 = v53.hits[vLN07];
      v54.point = {
        x: this.mpx(-v54.point.x),
        y: this.mpx(-v54.point.y),
      };
      v54.normal = {
        x: -v54.normal.x,
        y: -v54.normal.y,
      };
      vA4.push(v54);
    }
    return vA4;
  }

  queryAABB(x: number, y: number, width: number, height: number): AABBHit[] {
    x = this.pxm(-x);
    y = this.pxm(-y);
    width = this.pxm(width);
    height = this.pxm(height);
    var v55 = new box2d.b2AABB();
    v55.lowerBound.Set(x - width, y - height);
    v55.upperBound.Set(x, y);
    var v56 = new QueryCallback(this);
    this.world.QueryAABB(v55, v56.ReportFixture);
    return v56.hits;
  }

  queryFixture(fixture: box2d.b2Fixture): AABBHit[] {
    var v57 = new QueryCallback(this);
    this.world.QueryFixtureShape(
      fixture.GetShape(),
      0,
      fixture.GetBody().GetTransform(),
      v57.ReportFixture,
    );
    return v57.hits;
  }

  setPTMRatio(newRatio: number) {
    this.ptmRatio = newRatio;
  }

  static renderBody(
    context: CanvasRenderingContext2D,
    body: Body,
    colour = "rgb(255,255,255)",
  ) {
    const world = body.world;
    const b2Body = body.data;
    const transform = new box2d.b2Transform();
    transform.SetPositionXY(
      b2Body.GetTransform().p.x - body.game.camera.x / world.ptmRatio,
      b2Body.GetTransform().p.y - body.game.camera.y / world.ptmRatio,
    );
    b2Body.SetTransform(transform);
    world.debugDraw = new DebugDraw(context);
    world.debugDraw.PushTransform(transform);
    var newColour = Color.webToColor(colour);
    const debugColour = world.debugDrawColour;
    debugColour.r = newColour.r / 255;
    debugColour.g = newColour.g / 255;
    debugColour.b = newColour.b / 255;
    for (
      let fixutre = b2Body.GetFixtureList();
      fixutre;
      fixutre = fixutre.GetNext()
    ) {
      DrawShape(world.debugDraw, fixutre, debugColour);
    }
    world.debugDraw.PopTransform(transform);
    world.debugDraw.Finish();
  }

  static Body = Body;
  static DefaultContactListener = DefaultContactListener;
  static DebugDraw = DebugDraw;
  static PointProxy = PointProxy;
  static Polygon = Polygon;
  static QueryCallback = QueryCallback;
  static RayCastCallback = RayCastCallback;
}

export function b2SubVV(a: XY, b: XY, c: XY) {
  c.x = a.x - b.x;
  c.y = a.y - b.y;
  return c;
}

export function b2AddVV(a: XY, b: XY, c: XY) {
  c.x = a.x + b.x;
  c.y = a.y + b.y;
  return c;
}

export function b2CrossVS(a: XY, b: number, c: XY) {
  var d = a.x;
  c.x = b * a.y;
  c.y = -b * d;
  return c;
}

export function b2DotVV(a: XY, b: XY) {
  return a.x * b.x + a.y * b.y;
}

function DrawShape(
  debugDraw: DebugDraw,
  fixture: box2d.b2Fixture,
  colour: box2d.b2Color,
) {
  const shape = fixture.GetShape();
  if (shape instanceof box2d.b2CircleShape) {
    debugDraw.DrawSolidCircle(
      shape.m_p,
      shape.m_radius,
      box2d.b2Vec2.UNITX,
      colour,
    );
  } else if (shape instanceof box2d.b2EdgeShape) {
    debugDraw.DrawSegment(shape.m_vertex1, shape.m_vertex2, colour);
  } else if (shape instanceof box2d.b2ChainShape) {
    let prev: box2d.b2Vec2 | null = null;
    for (const vertex of shape.m_vertices) {
      if (prev !== null) {
        debugDraw.DrawSegment(prev, vertex, colour);
        debugDraw.DrawCircle(vertex, 0.05, colour);
      }
      prev = vertex;
    }
  } else if (shape instanceof box2d.b2PolygonShape) {
    debugDraw.DrawSolidPolygon(shape.m_vertices, shape.m_count, colour);
  }
}

function DrawJoint(
  debugDraw: DebugDraw,
  joint: box2d.b2Joint,
  colour: box2d.b2Color,
) {
  const bodyA = joint.GetBodyA();
  const bodyB = joint.GetBodyB();
  const transformA = bodyA.GetTransform();
  const transformB = bodyB.GetTransform();
  const anchorA = joint.GetAnchorA(new box2d.b2Vec2());
  const anchorB = joint.GetAnchorB(new box2d.b2Vec2());
  colour.SetRGB(0.5, 0.8, 0.8);
  if (joint instanceof box2d.b2DistanceJoint) {
    debugDraw.DrawSegment(anchorA, anchorB, colour);
  } else if (joint instanceof box2d.b2PulleyJoint) {
    const groundAnchorA = joint.GetGroundAnchorA();
    const groundAnchorB = joint.GetGroundAnchorB();
    debugDraw.DrawSegment(groundAnchorA, anchorA, colour);
    debugDraw.DrawSegment(groundAnchorB, anchorB, colour);
    debugDraw.DrawSegment(groundAnchorA, groundAnchorB, colour);
  } else if (joint instanceof box2d.b2MouseJoint) {
    debugDraw.DrawSegment(anchorA, anchorB, colour);
  } else {
    debugDraw.DrawSegment(transformA.p, anchorA, colour);
    debugDraw.DrawSegment(anchorA, anchorB, colour);
    debugDraw.DrawSegment(transformB.p, anchorB, colour);
  }
}

class DebugDrawFlags {
  constructor(
    public shapes: boolean = true,
    public joints: boolean = false,
    public aabbs: boolean = false,
    public centerOfMass: boolean = true,
    public controllers: boolean = false,
  ) {}
}

export default Box2D;
