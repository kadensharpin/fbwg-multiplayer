/// <amd-module name="States/Level/character" />

import {
  BitmapData,
  Game,
  Group,
  Physics,
  Signal,
  Sprite,
} from "@azerion/phaser";
import { Fixture } from "../../utils/util";
import CharCursors from "./CharCursors";
import Door from "./Devices/Door";

export type Characters = "wg" | "fb";
export type CharacterSprite = Sprite & {
  character: Character;
  char: Characters;
};

class Character extends Group {
  data: { char: Characters; diamonds: 0; silverDiamond: 0 };
  snowCount = 0;
  facing = "left";
  feetFriction = 0.5;
  r1 = 0.48;
  r2 = 0.2;
  dr = 0.03;
  y1 = 0.2;
  y2 = -0.9;
  spriteScale = 0.95;
  jumpImpulse = 1;
  jumpVelocity = 15.5;
  jumpIceVelocity = 10;
  runForce = 50;
  floatForce = 30;
  defaultMaxSpeed = 8.5;
  waterIceMaxSpeed = 2;
  absoluteMaxSpeed = 40;
  maxSpeed: number;
  sprite: CharacterSprite;
  body: Physics.Box2D.Body;
  signal: Signal;
  cursors: CharCursors;
  char: Characters;
  portalSensor: Fixture<{ "portal-sensor": true }>;
  feetSensor: Fixture<"feet"> & {
    contacts: (box2d.b2Contact & { m_normal?: box2d.b2Vec2 })[];
  };
  prefix: "fire" | "water";
  bodySprite: Sprite;
  bodyParts: { legs: Sprite; ice: Sprite; head: Sprite };
  dying: boolean = false;
  isDead: boolean = false;
  dead: boolean = false;
  isOnLiquid: boolean = false;
  isOnIce: boolean = false;
  waterplaying: boolean = false;
  iceplaying: boolean = false;
  currentRunForce: number = 0;
  prohibitJump: boolean = false;

  constructor(game: Game, x: number, y: number, character: Characters) {
    super(game);

    this.drawDarkMask = this.drawDarkMask.bind(this);
    this.update = this.update.bind(this);
    this.setFriction = this.setFriction.bind(this);
    this.setOnIce = this.setOnIce.bind(this);
    this.animateStairs = this.animateStairs.bind(this);
    this.destroy = this.destroy.bind(this);
    this._doKill = this._doKill.bind(this);
    this.kill = this.kill.bind(this);
    this.liquidTouched = this.liquidTouched.bind(this);

    this.maxSpeed = this.defaultMaxSpeed;
    x += this.game.physics.box2d.mpx(1);
    y -= this.game.physics.box2d.mpx(1);
    this.data = { char: character, diamonds: 0, silverDiamond: 0 };
    this.sprite = this.game.make.sprite(
      x,
      y,
      "CharAssets",
      "_default0000",
    ) as CharacterSprite;
    this.sprite.character = this;
    this.sprite.scale.x = this.spriteScale;
    this.sprite.scale.y = this.spriteScale;
    this.game.layers.chars.addChild(this.sprite);
    this.game.physics.box2d.enable(this.sprite);
    this.body = this.sprite.body;
    this.body.clearFixtures();
    this.body.fixedRotation = true;
    this.body.data.m_userData = "pers";
    this.body.data.SetBullet(true);
    this.signal = new Signal();
    const createCircleFixture = (
      radius: number,
      pos: [number, number],
      friction: number,
    ) => {
      const shape = new box2d.b2CircleShape(radius);
      shape.m_p.SetXY(pos[0], pos[1]);
      const def = new box2d.b2FixtureDef();
      def.shape = shape;
      def.density = 0;
      def.filter.categoryBits = 16;
      def.filter.maskBits = 4353;
      def.friction = friction;
      const fixture = this.body.data.CreateFixture(def);
      fixture.id = this.body.world.getNextFixtureId();
      return fixture;
    };
    const createPolygonFixture = (
      x1: number,
      x2: number,
      y1: number,
      y2: number,
    ) => {
      const vertices = [];
      vertices.push(new box2d.b2Vec2(x1 - this.dr, y1));
      vertices.push(new box2d.b2Vec2(-x1 + this.dr, y1));
      vertices.push(new box2d.b2Vec2(x2 - this.dr, y2));
      vertices.push(new box2d.b2Vec2(-x2 + this.dr, y2));
      const shape = new box2d.b2PolygonShape();
      shape.Set(vertices);
      const def = new box2d.b2FixtureDef();
      def.shape = shape;
      def.friction = 0;
      def.density = 1.4;
      def.filter.categoryBits = 16;
      def.filter.maskBits = 4353;
      const fixture = this.body.data.CreateFixture(def);
      fixture.id = this.body.world.getNextFixtureId();
    };
    const portalSensorShape = new box2d.b2CircleShape(0.1);
    portalSensorShape.m_p.SetXY(0, 0);
    const portalSensorDef = new box2d.b2FixtureDef();
    portalSensorDef.shape = portalSensorShape;
    portalSensorDef.density = 0;
    portalSensorDef.filter.categoryBits = 4096;
    portalSensorDef.filter.maskBits = 4096;
    portalSensorDef.filter.groupIndex = -1;
    portalSensorDef.friction = 0;
    this.portalSensor = this.body.data.CreateFixture(portalSensorDef);
    this.portalSensor.id = this.body.world.getNextFixtureId();
    this.portalSensor.m_userData = { "portal-sensor": true };
    createCircleFixture(this.r1, [0, this.y1], 0);
    this.feetSensor = createCircleFixture(
      this.r2,
      [0, this.y2],
      this.feetFriction,
    ) as typeof this.feetSensor;
    createPolygonFixture(this.r1, this.r2, this.y1, this.y2);
    this.feetSensor.m_userData = "feet";
    this.feetSensor.contacts = [];
    this.prefix = "fb" === character ? "fire" : "water";
    this.bodySprite = game.make.sprite(0, 0, "CharAssets", "_default0000");
    this.sprite.addChild(this.bodySprite);
    const legSprite = game.make.sprite(0, 0, "CharAssets");
    legSprite.anchor.set(0.5);
    legSprite.animations.add(
      "running",
      Phaser.Animation.generateFrameNames(
        this.prefix + "_legs_running",
        0,
        7,
        "",
        4,
      ),
      30,
      true,
    );
    "wg" === this.data.char &&
      legSprite.animations.add(
        "onice",
        Phaser.Animation.generateFrameNames(
          this.prefix + "_legs_running",
          0,
          7,
          "",
          4,
        ),
        10,
        true,
      );
    legSprite.frameName = this.prefix + "_legs_idle0000";
    this.bodySprite.addChild(legSprite);
    const headSprite = game.make.sprite(0, 0, "CharAssets");
    headSprite.animations.add(
      "idle",
      Phaser.Animation.generateFrameNames(
        this.prefix + "_head_idle",
        0,
        29,
        "",
        4,
      ),
      30,
      true,
    );
    headSprite.animations.add(
      "falling",
      Phaser.Animation.generateFrameNames(
        this.prefix + "_head_falling",
        0,
        4,
        "",
        4,
      ),
      30,
      true,
    );
    headSprite.animations.add(
      "jumping",
      Phaser.Animation.generateFrameNames(
        this.prefix + "_head_jumping",
        0,
        10,
        "",
        4,
      ),
      30,
      true,
    );
    headSprite.animations.add(
      "rising",
      Phaser.Animation.generateFrameNames(
        this.prefix + "_head_rising",
        0,
        4,
        "",
        4,
      ),
      30,
      true,
    );
    headSprite.anchor.set(0.5);
    headSprite.animations.play("idle");
    this.bodySprite.addChild(headSprite);
    const iceSprite = game.make.sprite(0, 0, "CharAssets");
    iceSprite.anchor.set(0.5);
    iceSprite.animations.add(
      "loop",
      Phaser.Animation.generateFrameNames(
        this.prefix + "_ice_legs",
        0,
        4,
        "",
        4,
      ),
      10,
      true,
    );
    iceSprite.visible = false;
    this.bodySprite.addChild(iceSprite);
    this.bodyParts = {
      legs: legSprite,
      ice: iceSprite,
      head: headSprite,
    };
    this.bodySprite.hitArea = new PIXI.Circle(0, 0, 0.65 * legSprite.height);
    this.body.setFixtureContactCallback(
      this.feetSensor,
      (_body1, _body2, _fixture1, fixture2, begin, contact) => {
        if (fixture2.m_isSensor) {
          if (
            null != fixture2.m_userData &&
            "liquid_death" === fixture2.m_userData.type
          ) {
            if (begin) {
              this.liquidTouched(fixture2.m_userData.liquidType);
              this.isOnLiquid = true;
            } else {
              this.isOnLiquid = false;
            }
          }
        } else {
          if (begin && contact.m_manifold.localNormal.Length() > 0) {
            this.feetSensor.contacts.push(contact);
            return;
          }
          const i = this.feetSensor.contacts.indexOf(contact);
          if (i >= 0) return this.feetSensor.contacts.splice(i, 1);
        }
      },
      this,
    );
    this.cursors = new CharCursors(this.game, character);
    this.sprite.char = this.char = character;
  }

  liquidTouched(liquidType: 5 | 6 | 7) {
    if (
      7 === liquidType ||
      ("wg" === this.char && 6 === liquidType) ||
      ("fb" === this.char && 5 === liquidType)
    ) {
      this.kill();
    }
  }

  kill() {
    if (!this.dying) {
      this.dying = true;
      setTimeout(this._doKill, 0);
    }
  }

  _doKill() {
    this.game.level.sounds.death?.play();
    this.game.level.sounds.levelMusic?.stop();
    this.game.level.sounds.levelMusicOver?.play();
    const smokeSprite = this.game.make.sprite(
      0,
      -0.7 * this.game.physics.box2d.mpx(1),
      "CharAssets",
    );
    const smokeAnimation = smokeSprite.animations.add(
      "play",
      Phaser.Animation.generateFrameNames("death_smoke", 0, 45, "", 4),
      30,
      false,
    );
    if (this.body.data.GetLinearVelocity().x < 0) {
      smokeSprite.scale.x = -1;
    }
    smokeSprite.animations.play("play");
    smokeSprite.anchor.set(0.5);
    smokeAnimation.onComplete.add(() => {
      this.sprite.visible = false;
      this.isDead = true;
      this.signal.dispatch();
    });
    this.sprite.addChild(smokeSprite);
    this.dead = true;
  }

  destroy(destroyChildren?: boolean, soft?: boolean) {
    super.destroy(destroyChildren, soft);
    this.cursors.destroy();
  }

  animateStairs(door: Door) {
    this.bodyParts.head.visible = false;
    this.bodyParts.legs.visible = false;
    const stairSprite = this.game.make.sprite(0, 0, "CharAssets");
    stairSprite.animations.add(
      "up",
      Phaser.Animation.generateFrameNames(
        this.prefix + "_stairs",
        0,
        30,
        "",
        4,
      ),
      25,
      false,
    );
    stairSprite.anchor.set(0.5, 1);
    this.game.add
      .tween(stairSprite.scale)
      .to({ x: 0.8, y: 0.8 }, 360, Phaser.Easing.Linear.None, true, 0);
    this.sprite.addChild(stairSprite);
    this.body.x = door.pos.x;
    this.body.y = door.pos.y + 4;
    return stairSprite.animations.play("up");
  }

  setOnIce(isOnIce: boolean) {
    if (isOnIce === this.isOnIce) return;
    this.isOnIce = isOnIce;
    this.setFriction();
  }

  setFriction() {
    if (this.isOnIce) {
      if ("fb" === this.data.char) {
        this.feetSensor.m_friction = 0;
        this.maxSpeed = this.defaultMaxSpeed;
      } else if ("wg" === this.data.char) {
        this.feetSensor.m_friction = 0.7;
        this.maxSpeed = this.waterIceMaxSpeed;
      }
    } else {
      this.feetSensor.m_friction = this.feetFriction;
      this.maxSpeed = this.defaultMaxSpeed;
    }
    this.feetSensor.Refilter();
    let edge = this.feetSensor.m_body.m_contactList;
    while (edge != null) {
      edge.contact.ResetFriction();
      edge = edge.next;
    }
  }

  update() {
    if (
      (this.game.level == null || !this.game.level.ended) &&
      !this.game.physics.box2d.paused
    ) {
      if (this.dying) {
        this.bodySprite.visible = false;
        this.bodyParts.legs.visible = false;
        this.bodyParts.head.visible = false;
        if (this.dead) {
          this.body.data.SetLinearVelocity(new box2d.b2Vec2(0, 0));
        }
        return;
      }
      if (
        (this.cursors.right.isDown || this.cursors.left.isDown) &&
        this.isOnLiquid
      ) {
        if (!this.waterplaying && this.game.level?.sounds.waterSteps) {
          this.waterplaying = true;
          this.game.level.sounds.waterSteps.loop = true;
          this.game.level.sounds.waterSteps.volume = 0.5;
          this.game.level.sounds.waterSteps.play();
        }
      } else if (this.waterplaying === true) {
        this.waterplaying = false;
        this.game.level.sounds.waterSteps?.stop();
      }
      const iceSteps = ("iceSteps_" + this.data.char) as "iceSteps_fb";
      if (
        (this.cursors.right.isDown || this.cursors.left.isDown) &&
        this.isOnIce
      ) {
        if (!this.iceplaying) {
          this.iceplaying = true;
          if (this.game.level.sounds[iceSteps]) {
            this.game.level.sounds[iceSteps].loop = true;
            this.game.level.sounds[iceSteps].play();
          }
        }
      } else if (this.iceplaying === true) {
        this.iceplaying = false;
        this.game.level.sounds[iceSteps]?.stop();
      }
      let normalForce: box2d.b2Vec2 | null | undefined = null;
      if (this.feetSensor.contacts.length > 0) {
        this.feetSensor.contacts.forEach((contact) => {
          contact.m_normal ||= new box2d.b2Vec2();
          contact.m_fixtureA.m_body.GetWorldVector(
            contact.m_manifold.localNormal,
            contact.m_normal,
          );
        });
        const down = new box2d.b2Vec2(0, -1);
        this.feetSensor.contacts.sort(
          (contactA, contactB) =>
            contactA.m_normal!.Dot(down) - contactB.m_normal!.Dot(down),
        );
        normalForce = this.feetSensor.contacts[0]!.m_normal;
      }
      const secondsElapsed = this.game.time.elapsed / 1000;
      let runForce = (secondsElapsed * 130) / this.currentRunForce;
      if (
        this.body.data.GetLinearVelocity().Length() < 1 &&
        this.currentRunForce > this.runForce * 0.5
      ) {
        runForce = this.runForce;
      }
      let acceleration: box2d.b2Vec2;
      if (this.cursors.left.isDown) {
        if (normalForce != null) {
          if (this.currentRunForce < this.runForce) {
            this.currentRunForce = Math.min(
              this.currentRunForce + runForce,
              this.runForce,
            );
          }
          const normalY = normalForce.y > 0.6 ? normalForce.y : 0;
          acceleration = normalForce
            .Clone()
            .SelfCrossSV(-this.currentRunForce)
            .SelfMul(Math.max(0, Math.sqrt(normalY)));
          if (normalY > 0.6 && acceleration.y >= 0 && acceleration.y < 20) {
            acceleration.y += 20;
          }
        } else {
          acceleration = new box2d.b2Vec2(this.floatForce, 0);
        }
      } else if (this.cursors.right.isDown) {
        if (normalForce != null) {
          if (this.currentRunForce < this.runForce) {
            this.currentRunForce = Math.min(
              this.currentRunForce + runForce,
              this.runForce,
            );
          }
          const normalY = normalForce.y > 0.6 ? normalForce.y : 0;
          acceleration = normalForce
            .Clone()
            .SelfCrossSV(this.currentRunForce)
            .SelfMul(Math.max(0, Math.sqrt(normalY)));
          if (normalY > 0.6 && acceleration.y >= 0 && acceleration.y < 20) {
            acceleration.y += 20;
          }
        } else {
          acceleration = new box2d.b2Vec2(-this.floatForce, 0);
        }
      } else {
        this.currentRunForce = this.runForce * 0.475;
        if (this.isOnIce && this.data.char === "wg") {
          acceleration = new box2d.b2Vec2(
            -this.body.data.GetLinearVelocity().x * 20,
            0,
          );
          this.body.data.SetLinearVelocity(new box2d.b2Vec2(0, 0));
        } else {
          acceleration = new box2d.b2Vec2(
            -this.body.data.GetLinearVelocity().x * 7,
            0,
          );
        }
      }
      if (this.prohibitJump && !this.cursors.up.isDown) {
        this.prohibitJump = false;
      }
      let jumping = false;
      if (
        !this.prohibitJump &&
        this.cursors.up.isDown &&
        normalForce != null &&
        (normalForce.y > 0.2 || this.feetSensor.contacts.length >= 2)
      ) {
        this.body.data.ApplyLinearImpulse(
          new box2d.b2Vec2(0, this.jumpImpulse),
          new box2d.b2Vec2(0, 0),
        );
        let velocity: box2d.b2Vec2;
        if (this.isOnIce) {
          if (this.data.char === "fb") {
            if (normalForce.y > 0.9) {
              velocity = new box2d.b2Vec2(
                this.body.data.GetLinearVelocity().x,
                normalForce.y * 3,
              );
              this.body.data.SetLinearVelocity(velocity);
            } else {
              velocity = new box2d.b2Vec2(normalForce.x * 3, normalForce.y * 3);
              this.body.data.SetLinearVelocity(velocity);
            }
          } else {
            velocity = new box2d.b2Vec2(
              this.body.data.GetLinearVelocity().x,
              this.jumpIceVelocity,
            );
            this.body.data.SetLinearVelocity(velocity);
          }
        } else {
          velocity =
            normalForce.y > 0.65
              ? new box2d.b2Vec2(
                  this.body.data.GetLinearVelocity().x,
                  this.jumpVelocity,
                )
              : new box2d.b2Vec2(
                  this.body.data.GetLinearVelocity().x,
                  Math.sqrt(Math.sqrt(normalForce.y)) * this.jumpVelocity,
                );
          if (velocity.Length() > this.jumpVelocity) {
            velocity.SelfNormalize().SelfMul(this.jumpVelocity);
          }
          this.body.data.SetLinearVelocity(velocity);
          jumping = true;
        }
        let edge = this.feetSensor.m_body.m_contactList;
        const down = new box2d.b2Vec2(0, -1);
        while (edge != null) {
          const pulleyPlatformBody = edge.contact.m_fixtureA.m_body;
          if (pulleyPlatformBody.m_userData === "reactable") {
            pulleyPlatformBody.ApplyLinearImpulse(
              down,
              new box2d.b2Vec2(0, 0),
              true,
            );
          }
          edge = edge.next;
        }
        this.prohibitJump = true;
        if (this.char === "wg") {
          this.game.level.sounds.jump_wg?.play();
        } else {
          this.game.level.sounds.jump_fb?.play();
        }
      }
      if (jumping) {
        acceleration.y = 0;
        jumping = false;
      }
      if (this.isOnIce) {
        if (this.data.char === "fb") {
          acceleration.SelfMul(0.2);
        }
        if (this.data.char === "wg") {
          acceleration.SelfMul(1);
        }
        const velocity = this.body.data.GetLinearVelocity();
        if (velocity.Length() > this.maxSpeed) {
          velocity.SelfNormalize().SelfMul(this.maxSpeed);
          this.body.data.SetLinearVelocity(velocity);
        }
      }
      let velocity = this.body.data.GetLinearVelocity();
      if (acceleration.x > 0 && velocity.x < this.maxSpeed) {
        this.body.data.ApplyForce(acceleration, new box2d.b2Vec2(0, 0));
      }
      if (acceleration.x < 0 && velocity.x > -this.maxSpeed) {
        this.body.data.ApplyForce(acceleration, new box2d.b2Vec2(0, 0));
      }
      if (velocity.Length() > this.absoluteMaxSpeed) {
        velocity.SelfNormalize().SelfMul(this.absoluteMaxSpeed);
        this.body.data.SetLinearVelocity(velocity);
      }
      velocity = this.body.data.GetLinearVelocity();
      const velocityDirection = velocity.Clone().SelfNormalize();
      let headRotation = Math.atan2(
        Math.max(-0.333, velocityDirection.y),
        velocityDirection.x,
      );
      let animationState: "jumping" | "idle" | "rising" | "falling";
      let headScaleX: -1 | 1;
      if (normalForce != null) {
        if (this.cursors.left.isDown) {
          animationState = "jumping";
          headScaleX = -1;
          headRotation = Math.atan2(normalForce.y, normalForce.x) - Math.PI / 2;
          headRotation = Math.max(
            Math.min(headRotation, Math.PI * 0.25),
            -Math.PI * 0.1,
          );
        } else if (this.cursors.right.isDown) {
          animationState = "jumping";
          headScaleX = 1;
          headRotation = Math.atan2(normalForce.y, normalForce.x) - Math.PI / 2;
          headRotation = Math.max(
            Math.min(headRotation, Math.PI * 0.1),
            -Math.PI * 0.25,
          );
        } else {
          animationState = "idle";
          headScaleX = 1;
          headRotation = 0;
        }
      } else if (velocity.x > 4) {
        animationState = "jumping";
        headScaleX = -1;
      } else if (velocity.x < -4) {
        animationState = "jumping";
        headScaleX = 1;
        headRotation += Math.PI;
      } else if (velocity.y > 3) {
        animationState = "rising";
        headScaleX = 1;
        headRotation = 0;
      } else if (velocity.y < -3) {
        animationState = "falling";
        headScaleX = 1;
        headRotation = 0;
      } else if (this.cursors.left.isDown) {
        animationState = "jumping";
        headScaleX = -1;
        headRotation = this.bodyParts.head.rotation;
      } else if (this.cursors.right.isDown) {
        animationState = "jumping";
        headScaleX = 1;
        headRotation = this.bodyParts.head.rotation;
      } else {
        animationState = "idle";
        headScaleX = 1;
        headRotation = 0;
      }
      this.bodyParts.head.scale.set(headScaleX, 1);
      this.bodyParts.head.rotation = headRotation;
      this.bodyParts.head.animations.play(animationState);
      if (animationState === "rising") {
        if (
          this.bodyParts.legs.renderOrderID < this.bodyParts.head.renderOrderID
        ) {
          this.sprite.removeChild(this.bodyParts.legs);
          this.sprite.addChild(this.bodyParts.legs);
        }
      } else if (
        this.bodyParts.legs.renderOrderID > this.bodyParts.head.renderOrderID
      ) {
        this.sprite.removeChild(this.bodyParts.head);
        this.sprite.addChild(this.bodyParts.head);
      }
      if (animationState === "jumping") {
        if (headScaleX === -1 && this.facing !== "left") {
          this.bodyParts.legs.scale.set(-1, 1);
          this.bodyParts.ice.scale.set(-1, 1);
          this.facing = "left";
        }
        if (headScaleX === 1 && this.facing !== "right") {
          this.bodyParts.legs.scale.set(1, 1);
          this.bodyParts.ice.scale.set(1, 1);
          this.facing = "right";
        }
        if (this.isOnIce) {
          this.bodyParts.ice.animations.play("loop");
          this.bodyParts.ice.visible = true;
        } else {
          this.bodyParts.ice.animations.stop();
          this.bodyParts.ice.visible = false;
        }
        if (this.data.char === "wg" && this.isOnIce) {
          this.bodyParts.legs.animations.play("onice");
        } else {
          this.bodyParts.legs.animations.play("running");
        }
      } else if (this.facing !== "idle") {
        this.bodyParts.ice.animations.stop();
        this.bodyParts.ice.visible = false;
        this.bodyParts.legs.animations.stop();
        this.bodyParts.legs.frameName = this.prefix + "_legs_idle0000";
        this.facing = "idle";
      }
    }
  }

  drawDarkMask(bmd: BitmapData & { offset: { x: number; y: number } }) {
    bmd.ctx.globalCompositeOperation = "lighter";
    const pos = {
      x: this.sprite.x + bmd.offset.x,
      y: this.sprite.y + bmd.offset.y,
    };
    const gradient = bmd.ctx.createRadialGradient(
      pos.x,
      pos.y,
      20,
      pos.x,
      pos.y,
      180,
    );
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.5, "rgba(255,255,255,0.3)");
    gradient.addColorStop(1, "transparent");
    bmd.circle(pos.x, pos.y, 220, gradient);
  }
}

// @ts-ignore
export = Character;
