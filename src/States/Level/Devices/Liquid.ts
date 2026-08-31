/// <amd-module name="States/Level/Devices/Liquid" />

import { Animation, Game, Group, Physics, Sprite } from "@azerion/phaser";
import { Fixture } from "utils/util";
import { CharacterSprite } from "../character";

type LiquidOptions = {
  width: number;
  x: number;
  y: number;

  type: number;
  startFrozen: boolean;
};

class Liquid extends Sprite {
  declare body: Physics.Box2D.Body;
  readonly options: LiquidOptions;
  readonly sensorFixture: box2d.b2Fixture;
  readonly iceFixture: box2d.b2Fixture;
  readonly killFixture: Fixture<{
    type: "liquid_death";
    liquidType: 5 | 6 | 7 | 55;
    lightProperties: { type: "transparent" };
  }>;
  readonly liquidGraphics: Group;
  readonly iceGraphics?: Group;
  readonly nearBodies: Record<number, { body: Physics.Box2D.Body }>;
  readonly frozenBodies: Record<number, { body: Physics.Box2D.Body }>;
  private ready: boolean = false;
  private frozen: boolean = false;

  constructor(
    game: Game,
    x: number,
    y: number,
    options: Partial<LiquidOptions>,
  ) {
    super(game, x, y, "GroundAssets", "_default0000");

    this.melt = this.melt.bind(this);
    this.freeze = this.freeze.bind(this);
    this.initialFreeze = this.initialFreeze.bind(this);
    this.shouldMelt = this.shouldMelt.bind(this);
    this.shouldFreeze = this.shouldFreeze.bind(this);
    this.update = this.update.bind(this);
    this.createIceGraphics = this.createIceGraphics.bind(this);
    this.createLiquidGraphics = this.createLiquidGraphics.bind(this);

    if (55 === options.type) {
      options.type = 5;
      options.startFrozen = true;
    }
    this.options = options as LiquidOptions;
    this.options.x = x;
    this.options.y = y;
    this.game.layers.liquids.addChild(this);
    this.game.physics.box2d.enable(this);
    this.body.clearFixtures();
    this.body.mass = 0;
    this.body.data.SetPosition(new box2d.b2Vec2(-x, -y));

    const width = this.options.width;
    const sensorShape = new box2d.b2PolygonShape();
    const sensorVertices = [];
    sensorVertices.push(new box2d.b2Vec2(0, -0.15));
    sensorVertices.push(new box2d.b2Vec2(-width, -0.15));
    sensorVertices.push(new box2d.b2Vec2(-width, -1 / 2));
    sensorVertices.push(new box2d.b2Vec2(0, -1 / 2));
    sensorShape.Set(sensorVertices);
    const sensorFixtureDef = new box2d.b2FixtureDef();
    sensorFixtureDef.shape = sensorShape;
    sensorFixtureDef.filter.categoryBits = 1;
    sensorFixtureDef.filter.maskBits = 61695;
    sensorFixtureDef.friction = 0.7;
    sensorFixtureDef.isSensor = true;
    sensorFixtureDef.userData = {
      type: "liquid",
      liquidType: options.type,
      lightProperties: { type: "normal", sensor: true },
    };
    this.sensorFixture = this.body.data.CreateFixture(sensorFixtureDef);
    this.sensorFixture.id = this.body.world.getNextFixtureId();
    const iceShape = new box2d.b2PolygonShape();
    const iceVertices = [];
    iceVertices.push(new box2d.b2Vec2(0, 0));
    iceVertices.push(new box2d.b2Vec2(-width, 0));
    iceVertices.push(new box2d.b2Vec2(-width, -1 / 2));
    iceVertices.push(new box2d.b2Vec2(0, -1 / 2));
    iceShape.Set(iceVertices);
    const iceFixtureDef = new box2d.b2FixtureDef();
    iceFixtureDef.shape = iceShape;
    iceFixtureDef.filter.categoryBits = 1;
    iceFixtureDef.filter.maskBits = 0;
    iceFixtureDef.friction = 0;
    iceFixtureDef.userData = {
      type: "ice",
      liquidType: options.type,
      lightProperties: { type: "transparent" },
    };
    this.iceFixture = this.body.data.CreateFixture(iceFixtureDef);
    this.iceFixture.id = this.body.world.getNextFixtureId();
    this.body.setFixtureContactCallback(
      this.iceFixture,
      (
        body1: Physics.Box2D.Body,
        body2: Physics.Box2D.Body,
        _fixture1: box2d.b2Fixture,
        _fixture2: box2d.b2Fixture,
        begin: boolean,
      ) => {
        const sprite1 = body1.sprite as CharacterSprite;
        const sprite2 = body2.sprite as CharacterSprite;
        const character = sprite1.character || sprite2.character;
        if (!character) return;

        character.snowCount ||= 0;
        if (begin) {
          character.snowCount += 1;
        } else {
          character.snowCount -= 1;
        }
        character.setOnIce(0 !== character.snowCount);
      },
      this,
    );
    const killShape = new box2d.b2PolygonShape();
    const killVertices = [];
    killVertices.push(new box2d.b2Vec2(0, -0.18));
    killVertices.push(new box2d.b2Vec2(-width, -0.18));
    killVertices.push(new box2d.b2Vec2(-width, -1));
    killVertices.push(new box2d.b2Vec2(0, -1));
    killShape.Set(killVertices);
    const killFixtureDef3 = new box2d.b2FixtureDef();
    killFixtureDef3.shape = killShape;
    killFixtureDef3.filter.categoryBits = 1;
    killFixtureDef3.filter.maskBits = 4369;
    killFixtureDef3.friction = 0.7;
    killFixtureDef3.isSensor = true;
    killFixtureDef3.userData = {
      type: "liquid_death",
      liquidType: options.type,
      lightProperties: { type: "transparent" },
    };
    this.killFixture = this.body.data.CreateFixture(killFixtureDef3);
    this.killFixture.id = this.body.world.getNextFixtureId();
    this.liquidGraphics = this.game.make.group();
    this.liquidGraphics.position.y = 2;
    this.createLiquidGraphics();
    this.addChild(this.liquidGraphics);
    if (options.type === 5) {
      this.iceGraphics = this.game.make.group();
      this.iceGraphics.position.y = 4;
      this.createIceGraphics();
      this.addChild(this.iceGraphics);
      this.iceGraphics.visible = false;
    }
    this.nearBodies = {};
    this.frozenBodies = {};
    this.body.setFixtureContactCallback(
      this.sensorFixture,
      (
        _body1: Physics.Box2D.Body,
        body2: Physics.Box2D.Body,
        _fixture1: box2d.b2Fixture,
        _fixture2: box2d.b2Fixture,
        begin: boolean,
      ) => {
        if (begin && !this.nearBodies[body2.id]) {
          this.nearBodies[body2.id] = { body: body2 };
        } else if (!begin && this.nearBodies[body2.id]) {
          delete this.nearBodies[body2.id];
        }
      },
      this,
    );
    if (options.startFrozen) setTimeout(this.initialFreeze, 10);
  }

  createLiquidGraphics() {
    let prefix: string;
    switch (this.options.type) {
      case 5:
        prefix = "WaterBox";
        break;
      case 6:
        prefix = "FireBox";
        break;
      case 7:
        prefix = "GreenBox";
        break;
      default:
        return;
    }
    const leftSprite = this.game.make.sprite(0, 0, "GroundAssets");
    leftSprite.anchor.set(0.5);
    leftSprite.animations.add(
      "loop",
      Animation.generateFrameNames(prefix + "Left", 0, 14, "", 4),
      30,
      true,
    );
    this.liquidGraphics.addChild(leftSprite);
    leftSprite.x = this.body.world.mpx(0.5);
    leftSprite.y = this.body.world.mpx(0.5);
    leftSprite.animations.play("loop");
    if (this.options.width > 2) {
      for (let i = 0; i < this.options.width - 2; ++i) {
        const sprite = this.game.make.sprite(0, 0, "GroundAssets");
        sprite.anchor.set(0.5);
        sprite.animations.add(
          "loop",
          Animation.generateFrameNames(prefix, 0, 14, "", 4),
          30,
          true,
        );
        this.liquidGraphics.addChild(sprite);
        sprite.x = this.body.world.mpx(i + 1.5);
        sprite.y = this.body.world.mpx(0.5);
        sprite.animations.play("loop");
      }
    }
    const rightSprite = this.game.make.sprite(0, 0, "GroundAssets");
    rightSprite.anchor.set(0.5);
    rightSprite.animations.add(
      "loop",
      Animation.generateFrameNames(prefix + "Right", 0, 14, "", 4),
      30,
      true,
    );
    this.liquidGraphics.addChild(rightSprite);
    rightSprite.x = this.body.world.mpx(this.options.width - 0.5);
    rightSprite.y = this.body.world.mpx(0.5);
    rightSprite.animations.play("loop");
  }

  createIceGraphics() {
    const prefix = "IceBox";
    const leftSprite = this.game.make.sprite(
      0,
      0,
      "GroundAssets",
      prefix + "Left0000",
    );
    leftSprite.anchor.set(0.5);
    this.iceGraphics?.addChild(leftSprite);
    leftSprite.x = this.body.world.mpx(0.5);
    leftSprite.y = this.body.world.mpx(0.5);
    if (this.options.width > 2) {
      for (let i = 0; i < this.options.width - 2; ++i) {
        const e = this.game.make.sprite(0, 0, "GroundAssets", prefix + "0000");
        e.anchor.set(0.5);
        this.iceGraphics?.addChild(e);
        e.x = this.body.world.mpx(i + 1.5);
        e.y = this.body.world.mpx(0.5);
      }
    }
    const rightSprite = this.game.make.sprite(
      0,
      0,
      "GroundAssets",
      prefix + "Right0000",
    );
    rightSprite.anchor.set(0.5);
    this.iceGraphics?.addChild(rightSprite);
    rightSprite.x = this.body.world.mpx(this.options.width - 0.5);
    rightSprite.y = this.body.world.mpx(0.5);
  }

  update() {
    if (this.game.physics.box2d.paused) return;
    if (!this.ready) {
      this.ready = true;
      return;
    }
    if (this.sensorFixture.m_userData.lightProperties.iluminated == null)
      return;
    if (
      this.sensorFixture.m_userData.lightProperties.iluminated === "blue" &&
      this.options.type === 5
    ) {
      this.shouldFreeze();
    } else if (
      this.sensorFixture.m_userData.lightProperties.iluminated === "red" &&
      this.options.type === 5
    )
      this.shouldMelt();
  }

  shouldFreeze() {
    if (!this.frozen) {
      this.freeze();
      this.game.level.sounds.freeze.play();
    }
  }

  shouldMelt() {
    if (this.frozen) {
      this.game.level.sounds.melt.play();
      this.melt();
    }
  }

  initialFreeze() {
    this.game.physics.box2d.paused = false;
    this.game.physics.box2d.update();
    this.game.physics.box2d.paused = true;
    this.frozen = true;
    const filter = new box2d.b2Filter();
    filter.maskBits = 16;
    filter.categoryBits = 1;
    this.iceFixture.SetFilterData(filter);
    for (const { body } of Object.values(this.nearBodies)) {
      if ("pers" === body.data.m_userData) {
        body.data.SetPosition(
          body.data.GetPosition().SelfAdd(new box2d.b2Vec2(0, 0.5)),
        );
        body.data.SetAwake(true);
      } else {
        this.frozenBodies[body.id] = { body };
        body.static = true;
      }
    }
    this.iceFixture.Refilter();
    this.sensorFixture.m_userData.lightProperties.type = "mirror";
    this.iceGraphics!.visible = true;
    this.liquidGraphics.visible = false;
  }

  freeze() {
    if (!this.iceGraphics) return;
    const duration = 800;
    console.log("freezing");
    this.frozen = true;
    const filter = new box2d.b2Filter();
    filter.maskBits = 16;
    filter.categoryBits = 1;
    this.iceFixture.SetFilterData(filter);
    for (const { body } of Object.values(this.nearBodies)) {
      if ("pers" === body.data.m_userData) {
        body.data.SetPosition(
          body.data.GetPosition().SelfAdd(new box2d.b2Vec2(0, 0.5)),
        );
        body.data.SetAwake(true);
      } else {
        this.frozenBodies[body.id] = { body };
        body.static = true;
      }
    }
    this.iceFixture.Refilter();
    this.sensorFixture.m_userData.lightProperties.type = "mirror";
    this.iceGraphics.visible = true;
    const graphics = this.game.make.graphics(0, 0);
    this.addChild(graphics);
    const width = this.game.physics.box2d.mpx(this.options.width);
    graphics.beginFill(16777215);
    graphics.drawRect(-10, -10, width + 20, 52);
    const lightPos = this.sensorFixture.m_userData.lightProperties
      .lightAt as box2d.b2Vec2;
    const xPos = this.game.physics.box2d.mpx(-lightPos.x - this.options.x);
    graphics.width = 0;
    graphics.x = xPos;
    this.game.add
      .tween(graphics)
      .to({ x: 0, width: width }, duration, "Linear", true)
      .onUpdateCallback(() =>
        !this.frozen
          ? (graphics.visible = false)
          : (this.iceGraphics!.mask = graphics),
      );
    const graphics2 = this.game.make.graphics(0, 0);
    this.addChild(graphics2);
    graphics2.width = width;
    graphics2.x = 0;
    const animationValue1 = { val: width - xPos };
    this.game.add
      .tween(animationValue1)
      .to({ val: 0 }, duration, "Linear", true)
      .onUpdateCallback(() => {
        if (!this.frozen) {
          graphics2.visible = false;
          return;
        }
        graphics2.clear();
        graphics2.beginFill(16777215);
        graphics2.drawRect(
          width - animationValue1.val,
          -10,
          animationValue1.val,
          52,
        );
        this.liquidGraphics.mask = graphics2;
      });
    const animationValue2 = { val: xPos };
    this.game.add
      .tween(animationValue2)
      .to({ val: 0 }, duration, "Linear", true)
      .onUpdateCallback(() => {
        if (!this.frozen) {
          graphics2.visible = false;
          return;
        }
        graphics2.beginFill(16777215);
        graphics2.drawRect(0, -10, animationValue2.val, 52);
        this.liquidGraphics.mask = graphics2;
      });
    const frost1 = this.game.make.sprite(0, 0, "GroundAssets", "frost0000");
    const frost2 = this.game.make.sprite(0, 0, "GroundAssets", "frost0000");
    frost1.anchor.set(0.5);
    frost2.anchor.set(0.5);
    frost1.animations.add(
      "loop",
      Animation.generateFrameNames("frost", 0, 10, "", 4),
      30,
      true,
    );
    frost2.animations.add(
      "loop",
      Animation.generateFrameNames("frost", 0, 10, "", 4),
      30,
      true,
    );
    frost1.animations.play("loop");
    frost2.animations.play("loop");
    this.addChild(frost1);
    this.addChild(frost2);
    frost1.x = xPos;
    frost2.x = xPos;
    this.game.add.tween(frost1).to({ x: 10 }, duration, "Linear", true);
    this.game.add
      .tween(frost2)
      .to({ x: width - 10 }, duration, "Linear", true)
      .onComplete.add(() => {
        if (this.frozen) this.liquidGraphics.visible = false;
        graphics2.destroy();
        graphics.destroy();
        frost1.destroy();
        frost2.destroy();
      });
  }

  melt() {
    if (!this.iceGraphics) return;
    const duration = 800;
    console.log("melting");
    this.frozen = false;
    const filter = new box2d.b2Filter();
    filter.maskBits = 0;
    filter.categoryBits = 1;
    this.iceFixture.SetFilterData(filter);
    for (const { body } of Object.values(this.frozenBodies)) {
      body.static = false;
      delete this.frozenBodies[body.id];
    }
    this.iceFixture.Refilter();
    this.sensorFixture.m_userData.lightProperties.type = "normal";
    this.liquidGraphics.visible = true;
    const graphics = this.game.make.graphics(0, 0);
    this.addChild(graphics);
    const width = this.game.physics.box2d.mpx(this.options.width);
    graphics.beginFill(16777215);
    graphics.drawRect(0, -10, width, 52);
    const lightPos = this.sensorFixture.m_userData.lightProperties.lightAt;
    const xPos = this.game.physics.box2d.mpx(-lightPos.x - this.options.x);
    graphics.width = 0;
    graphics.x = xPos;
    this.game.add
      .tween(graphics)
      .to({ x: 0, width: width }, duration, "Linear", true)
      .onUpdateCallback(() =>
        this.frozen
          ? (graphics.visible = false)
          : (this.liquidGraphics.mask = graphics),
      );
    const graphics2 = this.game.make.graphics(0, 0);
    this.addChild(graphics2);
    graphics2.width = width;
    graphics2.x = 0;
    const animationValue = { val: width - xPos };
    this.game.add
      .tween(animationValue)
      .to({ val: 0 }, duration, "Linear", true)
      .onUpdateCallback(() => {
        if (this.frozen) {
          graphics2.visible = false;
          return;
        }
        graphics2.clear();
        graphics2.beginFill(16777215);
        graphics2.drawRect(
          width - animationValue.val - 10,
          -10,
          animationValue.val + 20,
          52,
        );
      });
    const animationValue2 = { val: xPos };
    this.game.add
      .tween(animationValue2)
      .to({ val: 0 }, duration, "Linear", true)
      .onUpdateCallback(() => {
        if (this.frozen) {
          graphics2.visible = false;
          return;
        }
        graphics2.beginFill(16777215);
        graphics2.drawRect(0, -10, animationValue2.val, 52);
        this.iceGraphics!.mask = graphics2;
      });
    const vapor1 = this.game.make.sprite(0, 0, "GroundAssets", "vapor0000");
    const vapor2 = this.game.make.sprite(0, 0, "GroundAssets", "vapor0000");
    vapor1.anchor.set(0.5);
    vapor2.anchor.set(0.5);
    vapor1.animations.add(
      "loop",
      Animation.generateFrameNames("vapor", 0, 10, "", 4),
      30,
      true,
    );
    vapor2.animations.add(
      "loop",
      Animation.generateFrameNames("vapor", 0, 10, "", 4),
      30,
      true,
    );
    vapor1.animations.play("loop");
    vapor2.animations.play("loop");
    this.addChild(vapor1);
    this.addChild(vapor2);
    vapor1.x = xPos;
    vapor2.x = xPos;
    this.game.add.tween(vapor1).to({ x: 10 }, duration, "Linear", true);
    this.game.add
      .tween(vapor2)
      .to({ x: width - 10 }, duration, "Linear", true)
      .onComplete.add(() => {
        if (!this.frozen) this.iceGraphics!.visible = false;
        graphics.destroy();
        graphics2.destroy();
        vapor1.destroy();
        vapor2.destroy();
      });
  }
}

export = Liquid;
