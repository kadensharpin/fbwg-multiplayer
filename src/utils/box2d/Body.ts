import { Game, Image, Math, Physics, Point, Sprite } from "phaser";
import * as box2d from "phaser-box2d";
import Box2D from "./Box2D";
import PointProxy from "./PointProxy";
import Polygon from "./Polygon";

export default class Body {
  game: Game;
  world: Box2D;
  id: number;
  sprite: Sprite | null;
  type: number;
  offset: Point;
  bodyDef: box2d.b2BodyDef;
  data: box2d.b2Body;
  velocity: PointProxy;
  removeNextStep: boolean;
  _fixtureContactCallbacks: Record<number, Function>;
  _fixtureContactCallbackContext: Record<number, any>;
  _bodyContactCallbacks: Record<number, Function>;
  _bodyContactCallbackContext: Record<number, any>;
  _categoryContactCallbacks: Record<number, Function>;
  _categoryContactCallbackContext: Record<number, any>;
  _fixturePresolveCallbacks: Record<number, Function>;
  _fixturePresolveCallbackContext: Record<number, any>;
  _bodyPresolveCallbacks: Record<number, Function>;
  _bodyPresolveCallbackContext: Record<number, any>;
  _categoryPresolveCallbacks: Record<number, Function>;
  _categoryPresolveCallbackContext: Record<number, any>;
  _fixturePostsolveCallbacks: Record<number, Function>;
  _fixturePostsolveCallbackContext: Record<number, any>;
  _bodyPostsolveCallbacks: Record<number, Function>;
  _bodyPostsolveCallbackContext: Record<number, any>;
  _categoryPostsolveCallbacks: Record<number, Function>;
  _categoryPostsolveCallbackContext: Record<number, any>;

  constructor(
    game: Game,
    sprite: Sprite | null = null,
    x: number = 0,
    y: number = 0,
    density: number = 2,
    // @ts-ignore
    world: Box2D = game.physics.box2d,
  ) {
    this.game = game;
    this.world = world;
    this.id = this.world.getNextBodyId();
    this.sprite = sprite;
    this.type = Physics.BOX2D;
    this.offset = new Point();
    this.bodyDef = new box2d.b2BodyDef();
    this.bodyDef.position.SetXY(-this.world.pxm(x), -this.world.pxm(y));
    if (density === 0) {
      this.bodyDef.type = box2d.b2BodyType.b2_staticBody;
    } else if (density === 1) {
      this.bodyDef.type = box2d.b2BodyType.b2_kinematicBody;
    } else if (density === 2) {
      this.bodyDef.type = box2d.b2BodyType.b2_dynamicBody;
    } else if (density === 3) {
      this.bodyDef.type = box2d.b2BodyType.b2_bulletBody;
    }
    this.data = this.world.world.CreateBody(this.bodyDef);
    this.data.world = this.world.world;
    this.data.parent = this;
    this.velocity = new PointProxy(
      this.world,
      this.data,
      this.data.GetLinearVelocity,
      this.data.SetLinearVelocity,
    );
    this.removeNextStep = false;
    this._fixtureContactCallbacks = {};
    this._fixtureContactCallbackContext = {};
    this._bodyContactCallbacks = {};
    this._bodyContactCallbackContext = {};
    this._categoryContactCallbacks = {};
    this._categoryContactCallbackContext = {};
    this._fixturePresolveCallbacks = {};
    this._fixturePresolveCallbackContext = {};
    this._bodyPresolveCallbacks = {};
    this._bodyPresolveCallbackContext = {};
    this._categoryPresolveCallbacks = {};
    this._categoryPresolveCallbackContext = {};
    this._fixturePostsolveCallbacks = {};
    this._fixturePostsolveCallbackContext = {};
    this._bodyPostsolveCallbacks = {};
    this._bodyPostsolveCallbackContext = {};
    this._categoryPostsolveCallbacks = {};
    this._categoryPostsolveCallbackContext = {};
    if (sprite) {
      this.setRectangleFromSprite(sprite);
    }
  }
  setBodyContactCallback(
    object: Sprite | Body,
    callback: Function,
    callbackContext: any,
  ) {
    var v65 = -1;
    if (object instanceof Body) {
      v65 = object.id;
    } else if (object.body) {
      v65 = object.body.id;
    }
    if (v65 > -1) {
      if (callback === null) {
        delete this._bodyContactCallbacks[v65];
        delete this._bodyContactCallbackContext[v65];
      } else {
        this._bodyContactCallbacks[v65] = callback;
        this._bodyContactCallbackContext[v65] = callbackContext;
      }
    }
  }
  setFixtureContactCallback(
    fixture: box2d.b2Fixture,
    callback: (
      body1: Body,
      body2: Body,
      fixture1: box2d.b2Fixture,
      fixture2: box2d.b2Fixture,
      begin: boolean,
      contact: box2d.b2Contact,
    ) => void,
    callbackContext?: any,
  ) {
    var v66 = fixture.id;
    if (v66 > -1) {
      if (callback === null) {
        delete this._fixtureContactCallbacks[v66];
        delete this._fixtureContactCallbackContext[v66];
      } else {
        this._fixtureContactCallbacks[v66] = callback;
        this._fixtureContactCallbackContext[v66] = callbackContext;
      }
    }
  }
  setCategoryContactCallback(
    category: number,
    callback: Function,
    callbackContext: any,
  ) {
    if (callback === null) {
      delete this._categoryContactCallbacks[category];
      delete this._categoryContactCallbackContext[category];
    } else {
      this._categoryContactCallbacks[category] = callback;
      this._categoryContactCallbackContext[category] = callbackContext;
    }
  }
  setBodyPresolveCallback(
    object: Sprite | Body,
    callback: Function,
    callbackContext: any,
  ) {
    var v67 = -1;
    if (object instanceof Body) {
      v67 = object.id;
    } else if (object.body) {
      v67 = object.body.id;
    }
    if (v67 > -1) {
      if (callback === null) {
        delete this._bodyPresolveCallbacks[v67];
        delete this._bodyPresolveCallbackContext[v67];
      } else {
        this._bodyPresolveCallbacks[v67] = callback;
        this._bodyPresolveCallbackContext[v67] = callbackContext;
      }
    }
  }
  setFixturePresolveCallback(
    fixture: box2d.b2Fixture,
    callback: Function,
    callbackContext: any,
  ) {
    var v68 = fixture.id;
    if (v68 > -1) {
      if (callback === null) {
        delete this._fixturePresolveCallbacks[v68];
        delete this._fixturePresolveCallbackContext[v68];
      } else {
        this._fixturePresolveCallbacks[v68] = callback;
        this._fixturePresolveCallbackContext[v68] = callbackContext;
      }
    }
  }
  setCategoryPresolveCallback(
    category: number,
    callback: Function,
    callbackContext: any,
  ) {
    if (callback === null) {
      delete this._categoryPresolveCallbacks[category];
      delete this._categoryPresolveCallbackContext[category];
    } else {
      this._categoryPresolveCallbacks[category] = callback;
      this._categoryPresolveCallbackContext[category] = callbackContext;
    }
  }
  setBodyPostsolveCallback(
    object: Sprite | Body,
    callback: Function,
    callbackContext: any,
  ) {
    var v69 = -1;
    if (object instanceof Body) {
      v69 = object.id;
    } else if (object.body) {
      v69 = object.body.id;
    }
    if (v69 > -1) {
      if (callback === null) {
        delete this._bodyPostsolveCallbacks[v69];
        delete this._bodyPostsolveCallbackContext[v69];
      } else {
        this._bodyPostsolveCallbacks[v69] = callback;
        this._bodyPostsolveCallbackContext[v69] = callbackContext;
      }
    }
  }
  setFixturePostsolveCallback(
    fixture: box2d.b2Fixture,
    callback: Function,
    callbackContext: any,
  ) {
    var v70 = fixture.id;
    if (v70 > -1) {
      if (callback === null) {
        delete this._fixturePostsolveCallbacks[v70];
        delete this._fixturePostsolveCallbackContext[v70];
      } else {
        this._fixturePostsolveCallbacks[v70] = callback;
        this._fixturePostsolveCallbackContext[v70] = callbackContext;
      }
    }
  }
  setCategoryPostsolveCallback(
    category: number,
    callback: Function,
    callbackContext: any,
  ) {
    if (callback === null) {
      delete this._categoryPostsolveCallbacks[category];
      delete this._categoryPostsolveCallbackContext[category];
    } else {
      this._categoryPostsolveCallbacks[category] = callback;
      this._categoryPostsolveCallbackContext[category] = callbackContext;
    }
  }
  setCollisionCategory(category: number, fixture?: box2d.b2Fixture) {
    if (fixture === undefined) {
      for (var v71 = this.data.GetFixtureList(); v71; v71 = v71.GetNext()) {
        var v73 = v71.GetFilterData();
        v73.categoryBits = category;
      }
    } else {
      var v73 = fixture.GetFilterData();
      v73.categoryBits = category;
    }
  }
  setCollisionMask(mask: number, fixture?: box2d.b2Fixture) {
    if (fixture === undefined) {
      for (var v74 = this.data.GetFixtureList(); v74; v74 = v74.GetNext()) {
        var v76 = v74.GetFilterData();
        v76.maskBits = mask;
      }
    } else {
      var v76 = fixture.GetFilterData();
      v76.maskBits = mask;
    }
  }
  applyForce(x: number, y: number) {
    this.data.ApplyForce(
      new box2d.b2Vec2(-x, -y),
      this.data.GetWorldCenter(),
      true,
    );
  }
  setZeroRotation() {
    this.data.SetAngularVelocity(0);
  }
  setZeroVelocity() {
    this.data.SetLinearVelocity(box2d.b2Vec2.ZERO);
  }
  setZeroDamping() {
    this.data.SetLinearDamping(0);
    this.data.SetAngularDamping(0);
  }
  toLocalPoint(out: box2d.b2Vec2, worldPoint: box2d.b2Vec2) {
    out.x = this.world.pxm(-worldPoint.x);
    out.y = this.world.pxm(-worldPoint.y);
    this.data.GetLocalPoint(out, out);
    out.x = this.world.mpx(-out.x);
    out.y = this.world.mpx(-out.y);
    return out;
  }
  toWorldPoint(out: box2d.b2Vec2, localPoint: box2d.b2Vec2) {
    out.x = this.world.pxm(-localPoint.x);
    out.y = this.world.pxm(-localPoint.y);
    this.data.GetWorldPoint(out, out);
    out.x = this.world.mpx(-out.x);
    out.y = this.world.mpx(-out.y);
    return out;
  }
  toLocalVector(out: box2d.b2Vec2, worldVector: box2d.b2Vec2) {
    out.x = this.world.pxm(-worldVector.x);
    out.y = this.world.pxm(-worldVector.y);
    this.data.GetLocalVector(out, out);
    out.x = this.world.mpx(-out.x);
    out.y = this.world.mpx(-out.y);
    return out;
  }
  toWorldVector(out: box2d.b2Vec2, localVector: box2d.b2Vec2) {
    out.x = this.world.pxm(-localVector.x);
    out.y = this.world.pxm(-localVector.y);
    this.data.GetWorldVector(out, out);
    out.x = this.world.mpx(-out.x);
    out.y = this.world.mpx(-out.y);
  }
  rotateLeft(speed: number) {
    this.data.SetAngularVelocity(this.world.pxm(-speed));
  }
  rotateRight(speed: number) {
    this.data.SetAngularVelocity(this.world.pxm(speed));
  }
  moveForward(speed: number) {
    var v77 = this.world.pxm(speed);
    var v78 = new box2d.b2Vec2();
    this.toWorldVector(v78, new box2d.b2Vec2(0, v77));
    this.data.SetLinearVelocity(v78);
  }
  moveBackward(speed: number) {
    var v79 = this.world.pxm(-speed);
    var v80 = new box2d.b2Vec2();
    this.toWorldVector(v80, new box2d.b2Vec2(0, v79));
    this.data.SetLinearVelocity(v80);
  }
  thrust(power: number) {
    var v81 = this.world.pxm(power) * this.data.GetMass();
    var v82 = new box2d.b2Vec2();
    this.toWorldVector(v82, new box2d.b2Vec2(0, v81));
    this.data.ApplyForce(v82, this.data.GetWorldCenter(), true);
  }
  reverse(power: number) {
    var v83 = -this.world.pxm(power) * this.data.GetMass();
    var v84 = new box2d.b2Vec2();
    this.toWorldVector(v84, new box2d.b2Vec2(0, v83));
    this.data.ApplyForce(v84, this.data.GetWorldCenter(), true);
  }
  moveLeft(speed: number) {
    this.velocity.x = -speed;
  }
  moveRight(speed: number) {
    this.velocity.x = speed;
  }
  moveUp(speed: number) {
    this.velocity.y = -speed;
  }
  moveDown(speed: number) {
    this.velocity.y = speed;
  }
  preUpdate() {
    if (this.removeNextStep) {
      this.removeFromWorld();
      this.removeNextStep = false;
    }
  }
  postUpdate() {
    if (this.sprite) {
      this.sprite.x = this.world.mpx(-this.data.GetPosition().x);
      this.sprite.y = this.world.mpx(-this.data.GetPosition().y);
      this.sprite.rotation = this.data.GetAngle();
    }
  }
  kill() {
    this.data.SetActive(false);
  }
  reset(x: number, y: number) {
    this.data.SetPositionXY(this.world.pxm(-x), this.world.pxm(-y));
    this.data.SetActive(true);
  }
  removeFromWorld() {
    if (this.data.world === this.game.physics.box2d.world) {
      // @ts-ignore
      this.game.physics.box2d.removeBodyNextStep(this);
    }
  }
  destroy() {
    this.removeFromWorld();
    this._bodyContactCallbacks = {};
    this._bodyContactCallbackContext = {};
    this._bodyPresolveCallbacks = {};
    this._bodyPresolveCallbackContext = {};
    this._bodyPostsolveCallbacks = {};
    this._bodyPostsolveCallbackContext = {};
    this._categoryContactCallbacks = {};
    this._categoryContactCallbackContext = {};
    this._categoryPresolveCallbacks = {};
    this._categoryPresolveCallbackContext = {};
    this._categoryPostsolveCallbacks = {};
    this._categoryPostsolveCallbackContext = {};
    this.sprite = null;
  }
  clearFixtures() {
    var vA5 = [];
    for (var v85 = this.data.GetFixtureList(); v85; v85 = v85.GetNext()) {
      vA5.push(v85);
    }
    for (var v86 = vA5.length; v86--; ) {
      this.data.DestroyFixture(vA5[v86]);
    }
  }
  addCircle(radius: number, offsetX = 0, offsetY = 0) {
    var v87 = new box2d.b2CircleShape(this.world.pxm(radius));
    v87.m_p.SetXY(this.world.pxm(-offsetX), this.world.pxm(-offsetY));
    var v88 = new box2d.b2FixtureDef();
    v88.shape = v87;
    v88.friction = this.world.friction;
    v88.restitution = this.world.restitution;
    v88.density = this.world.density;
    var v89 = this.data.CreateFixture(v88);
    v89.id = this.world.getNextFixtureId();
    return v89;
  }
  addRectangle(
    width = 16,
    height = 16,
    offsetX = 0,
    offsetY = 0,
    rotation = 0,
  ) {
    width = this.world.pxm(width);
    height = this.world.pxm(height);
    var v90 = new box2d.b2PolygonShape();
    v90.SetAsOrientedBox(
      width * 0.5,
      height * 0.5,
      new box2d.b2Vec2(this.world.pxm(-offsetX), this.world.pxm(-offsetY)),
      rotation,
    );
    var v91 = new box2d.b2FixtureDef();
    v91.shape = v90;
    v91.friction = this.world.friction;
    v91.restitution = this.world.restitution;
    v91.density = this.world.density;
    var v92 = this.data.CreateFixture(v91);
    v92.id = this.world.getNextFixtureId();
    return v92;
  }
  addEdge(x1 = 0, y1 = 0, x2 = 0, y2 = 0) {
    var v93 = new box2d.b2EdgeShape();
    v93.Set(
      new box2d.b2Vec2(this.world.pxm(-x1), this.world.pxm(-y1)),
      new box2d.b2Vec2(this.world.pxm(-x2), this.world.pxm(-y2)),
    );
    var v94 = new box2d.b2FixtureDef();
    v94.shape = v93;
    v94.friction = this.world.friction;
    v94.restitution = this.world.restitution;
    v94.density = this.world.density;
    var v95 = this.data.CreateFixture(v94);
    v95.id = this.world.getNextFixtureId();
    return v95;
  }
  addChain(
    vertices: number[],
    firstIndex?: number,
    count?: number,
    loop?: boolean,
  ) {
    if (vertices === undefined) {
      return null;
    }
    if (vertices.length < 4) {
      return null;
    }
    if (firstIndex === undefined) {
      firstIndex = 0;
    }
    if (count === undefined) {
      count = (vertices.length - firstIndex) / 2;
    }
    var vA6 = [];
    for (var vP264 = firstIndex; vP264 < firstIndex + count; vP264++) {
      vA6.push(
        new box2d.b2Vec2(
          this.world.pxm(-vertices[vP264 * 2]),
          this.world.pxm(-vertices[vP264 * 2 + 1]),
        ),
      );
    }
    var v96 = new box2d.b2ChainShape();
    if (loop) {
      v96.CreateLoop(vA6, vA6.length);
    } else {
      v96.CreateChain(vA6, vA6.length);
    }
    var v97 = new box2d.b2FixtureDef();
    v97.shape = v96;
    v97.friction = this.world.friction;
    v97.restitution = this.world.restitution;
    v97.density = this.world.density;
    var v98 = this.data.CreateFixture(v97);
    v98.id = this.world.getNextFixtureId();
    return v98;
  }
  addLoop(vertices: number[], firstIndex?: number, count?: number) {
    return this.addChain(vertices, firstIndex, count, true);
  }
  addPolygon(vertices: number[], firstIndex?: number, count?: number) {
    if (vertices === undefined) {
      return null;
    }
    if (vertices.length < 6) {
      return null;
    }
    if (firstIndex === undefined) {
      firstIndex = 0;
    }
    if (count === undefined) {
      count = (vertices.length - firstIndex) / 2;
    }
    var vA7: { x: number; y: number }[] = [];
    for (var vLN08 = firstIndex; vLN08 < firstIndex + count; vLN08++) {
      vA7.push({
        x: this.world.pxm(-vertices[vLN08 * 2]),
        y: this.world.pxm(-vertices[vLN08 * 2 + 1]),
      });
    }
    var v99 = new Polygon();
    v99.setFromXYObjects(vA7);
    var v100 = v99.decompose();
    var v101 = null;
    for (var vLN08 = 0; vLN08 < v100.length; vLN08++) {
      var v102 = new box2d.b2PolygonShape();
      v102.Set(v100[vLN08] as box2d.b2Vec2[], v100[vLN08].length);
      var v103 = new box2d.b2FixtureDef();
      v103.shape = v102;
      v103.friction = this.world.friction;
      v103.restitution = this.world.restitution;
      v103.density = this.world.density;
      v101 = this.data.CreateFixture(v103);
      v101.id = this.world.getNextFixtureId();
    }
    return v101;
  }
  removeFixture(fixture: box2d.b2Fixture): boolean {
    if (fixture.GetBody() == this.data) {
      this.data.DestroyFixture(fixture);
      return true;
    }
    return false;
  }
  setCircle(radius = 32, offsetX = 0, offsetY = 0): box2d.b2Fixture {
    this.clearFixtures();
    return this.addCircle(radius, offsetX, offsetY);
  }
  setRectangle(
    width?: number,
    height?: number,
    offsetX?: number,
    offsetY?: number,
    rotation?: number,
  ): box2d.b2Fixture {
    this.clearFixtures();
    return this.addRectangle(width, height, offsetX, offsetY, rotation);
  }
  setRectangleFromSprite(
    sprite: Sprite | null = this.sprite,
  ): box2d.b2Fixture | null {
    if (!sprite) return null;
    this.clearFixtures();
    return this.addRectangle(
      sprite.width,
      sprite.height,
      0,
      0,
      sprite.rotation,
    );
  }
  setEdge(x1 = 0, y1 = 0, x2 = 0, y2 = 0): box2d.b2Fixture {
    this.clearFixtures();
    return this.addEdge(x1, y1, x2, y2);
  }
  setChain(
    vertices: number[],
    firstIndex?: number,
    count?: number,
    loop?: boolean,
  ): box2d.b2Fixture | null {
    if (vertices === undefined) {
      return null;
    } else if (vertices.length < 4) {
      return null;
    } else {
      if (firstIndex === undefined) {
        firstIndex = 0;
      }
      if (count === undefined) {
        count = (vertices.length - firstIndex) / 2;
      }
      this.clearFixtures();
      return this.addChain(vertices, firstIndex, count, loop);
    }
  }
  setLoop(
    vertices: number[],
    firstIndex?: number,
    count?: number,
  ): box2d.b2Fixture | null {
    return this.setChain(vertices, firstIndex, count, true);
  }
  setPolygon(
    vertices: number[],
    firstIndex?: number,
    count?: number,
  ): box2d.b2Fixture | null {
    if (vertices === undefined) {
      return null;
    } else if (vertices.length < 4) {
      return null;
    } else {
      if (firstIndex === undefined) {
        firstIndex = 0;
      }
      if (count === undefined) {
        count = (vertices.length - firstIndex) / 2;
      }
      this.clearFixtures();
      return this.addPolygon(vertices, firstIndex, count);
    }
  }
  loadPolygon(
    key: string,
    object: string,
    sprite: Sprite | Image | null = null,
  ): boolean {
    for (
      var v104 = this.game.cache.getPhysicsData(key, object), vLN09 = 0;
      vLN09 < v104.length;
      vLN09++
    ) {
      var vA8 = [];
      for (var vLN010 = 0; vLN010 < v104[vLN09].shape.length; vLN010 += 2) {
        vA8.push(
          new box2d.b2Vec2(
            this.world.pxm(-v104[vLN09].shape[vLN010]),
            this.world.pxm(-v104[vLN09].shape[vLN010 + 1]),
          ),
        );
      }
      if (sprite) {
        var v105 = this.world.pxm(sprite.width * -0.5);
        var v106 = this.world.pxm(sprite.height * -0.5);
        for (var vLN011 = 0; vLN011 < vA8.length; vLN011++) {
          vA8[vLN011].x -= v105;
          vA8[vLN011].y -= v106;
        }
      }
      var v107 = new box2d.b2PolygonShape();
      v107.Set(vA8, vA8.length);
      var v108 = new box2d.b2FixtureDef();
      v108.shape = v107;
      v108.friction = v104[vLN09].friction;
      v108.restitution = v104[vLN09].bounce;
      v108.density = v104[vLN09].density;
      v108.filter.categoryBits = v104[vLN09].filter.categoryBits;
      v108.filter.maskBits = v104[vLN09].filter.maskBits;
      this.data.CreateFixture(v108).id = this.world.getNextFixtureId();
    }
    return true;
  }
  containsPoint(point: Point): boolean {
    var v109 = this.world.pxm(-point.x);
    var v110 = this.world.pxm(-point.y);
    var v111 = new box2d.b2Vec2(v109, v110);
    for (var v112 = this.data.GetFixtureList(); v112; v112 = v112.GetNext()) {
      if (v112.TestPoint(v111)) {
        return true;
      }
    }
    return false;
  }

  get static() {
    return this.data.GetType() === box2d.b2BodyType.b2_staticBody;
  }
  set static(p301) {
    if (p301 && this.data.GetType() !== box2d.b2BodyType.b2_staticBody) {
      this.data.SetType(box2d.b2BodyType.b2_staticBody);
    } else if (
      !p301 &&
      this.data.GetType() === box2d.b2BodyType.b2_staticBody
    ) {
      this.data.SetType(box2d.b2BodyType.b2_dynamicBody);
    }
  }
  get dynamic() {
    return this.data.GetType() === box2d.b2BodyType.b2_dynamicBody;
  }
  set dynamic(p302) {
    if (p302 && this.data.GetType() !== box2d.b2BodyType.b2_dynamicBody) {
      this.data.SetType(box2d.b2BodyType.b2_dynamicBody);
    } else if (
      !p302 &&
      this.data.GetType() === box2d.b2BodyType.b2_dynamicBody
    ) {
      this.data.SetType(box2d.b2BodyType.b2_staticBody);
    }
  }
  get kinematic() {
    return this.data.GetType() === box2d.b2BodyType.b2_kinematicBody;
  }
  set kinematic(p303) {
    if (p303 && this.data.GetType() !== box2d.b2BodyType.b2_kinematicBody) {
      this.data.SetType(box2d.b2BodyType.b2_kinematicBody);
    } else if (
      !p303 &&
      this.data.GetType() === box2d.b2BodyType.b2_kinematicBody
    ) {
      this.data.SetType(box2d.b2BodyType.b2_staticBody);
    }
  }
  get angle() {
    return Math.wrapAngle(Math.radToDeg(this.data.GetAngle()));
  }
  set angle(p304) {
    this.data.SetAngle(Math.degToRad(Math.wrapAngle(p304)));
  }
  get linearDamping() {
    return this.data.GetLinearDamping();
  }
  set linearDamping(p305) {
    this.data.SetLinearDamping(p305);
  }
  get angularDamping() {
    return this.data.GetAngularDamping();
  }
  set angularDamping(p306) {
    this.data.SetAngularDamping(p306);
  }
  get angularVelocity() {
    return this.data.GetAngularVelocity();
  }
  set angularVelocity(p307) {
    this.data.SetAngularVelocity(p307);
  }
  get fixedRotation() {
    return this.data.IsFixedRotation();
  }
  set fixedRotation(p308) {
    this.data.SetFixedRotation(p308);
  }
  get gravityScale() {
    return this.data.GetGravityScale();
  }
  set gravityScale(p309) {
    this.data.SetGravityScale(p309);
  }
  get friction() {
    var v113 = this.data.GetFixtureList();
    if (v113) {
      return v113.GetFriction();
    } else {
      return 0;
    }
  }
  set friction(p310) {
    for (var v114 = this.data.GetFixtureList(); v114; v114 = v114.GetNext()) {
      v114.SetFriction(p310);
      v114.Refilter();
    }
  }
  get restitution() {
    var v115 = this.data.GetFixtureList();
    if (v115) {
      return v115.GetRestitution();
    } else {
      return 0;
    }
  }
  set restitution(p311) {
    for (var v116 = this.data.GetFixtureList(); v116; v116 = v116.GetNext()) {
      v116.SetRestitution(p311);
      v116.Refilter();
    }
  }
  get sensor() {
    var v117 = this.data.GetFixtureList();
    if (v117) {
      return v117.IsSensor();
    } else {
      return false;
    }
  }
  set sensor(p312: boolean) {
    for (var v118 = this.data.GetFixtureList(); v118; v118 = v118.GetNext()) {
      v118.SetSensor(p312);
      v118.Refilter();
    }
  }
  get bullet() {
    return this.data.IsBullet();
  }
  set bullet(p313) {
    this.data.SetBullet(p313);
  }
  get mass() {
    return this.data.GetMass();
  }
  set mass(p314) {
    if (p314 === 0) {
      this.data.SetType(box2d.b2BodyType.b2_staticBody);
    } else {
      if (this.data.GetType() !== box2d.b2BodyType.b2_dynamicBody) {
        this.data.SetType(box2d.b2BodyType.b2_dynamicBody);
      }
      var v119 = this.data.GetMass();
      var v120 = p314 / v119;
      for (var v121 = this.data.GetFixtureList(); v121; v121 = v121.GetNext()) {
        var v122 = v121.GetDensity();
        v121.SetDensity(v122 * v120);
      }
      this.data.ResetMassData();
    }
  }
  get rotation() {
    return this.data.GetAngle();
  }
  set rotation(p315) {
    this.data.SetAngle(p315);
  }
  get x() {
    return this.world.mpx(-this.data.GetPosition().x);
  }
  set x(p316) {
    this.data.SetPositionXY(this.world.pxm(-p316), this.data.GetPosition().y);
  }
  get y() {
    return this.world.mpx(-this.data.GetPosition().y);
  }
  set y(p317) {
    this.data.SetPositionXY(this.data.GetPosition().x, this.world.pxm(-p317));
  }
  get collideWorldBounds() {
    for (var v123 = this.data.GetFixtureList(); v123; v123 = v123.GetNext()) {
      if (v123.GetFilterData().maskBits & Box2D.worldBoundsFilterCategory) {
        return true;
      }
    }
    return false;
  }
  set collideWorldBounds(p318) {
    for (var v124 = this.data.GetFixtureList(); v124; v124 = v124.GetNext()) {
      var v125 = v124.GetFilterData();
      if (p318) {
        v125.maskBits |= Box2D.worldBoundsFilterCategory;
      } else {
        v125.maskBits &= ~Box2D.worldBoundsFilterCategory;
      }
    }
  }
}
