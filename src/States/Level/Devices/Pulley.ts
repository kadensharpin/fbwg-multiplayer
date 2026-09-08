/// <amd-module name="States/Level/Devices/Pulley" />

import { Game, Point, Sprite, TileSprite } from "@azerion/phaser";
import Device, { DeviceOptions } from "./Device";

type PulleyOptions = {
  barWidth: number;
  barHeight: number;
  polyline: [
    [number, number],
    [number, number],
    [number, number],
    [number, number],
  ];

  properties: {
    prismatic?: boolean;
    barWidth?: number;
    barHeight?: number;
  };
} & DeviceOptions;

class Pulley extends Device<PulleyOptions> {
  readonly baseHeight = 60;
  lastp1 = { x: 0, y: 0 };
  lastp2 = { x: 0, y: 0 };
  readonly barWidth: number;
  readonly barHeight: number;
  readonly anchor1: box2d.b2Vec2;
  readonly anchor2: box2d.b2Vec2;
  readonly ropeLeft: TileSprite;
  readonly ropeCenter: TileSprite;
  readonly ropeRight: TileSprite;
  readonly platform1: Sprite;
  readonly platform2: Sprite;
  readonly plat1: Sprite;
  readonly plat2: Sprite;
  readonly base1: Sprite;
  readonly base2: Sprite;
  readonly wheel1: Sprite;
  readonly wheel2: Sprite;
  readonly joint: box2d.b2Joint;

  constructor(game: Game, options: Partial<PulleyOptions>) {
    options.barWidth ??= 2.7;
    options.barHeight ??= 0.24;

    super(game, options as PulleyOptions);

    this.update = this.update.bind(this);

    this.barWidth = this.options.properties.barWidth || this.options.barWidth;
    this.barHeight =
      this.options.properties.barHeight || this.options.barHeight;
    this.anchor1 = new box2d.b2Vec2(
      this.options.polyline[1][0] + this.options.x,
      this.options.polyline[1][1] + this.options.y - this.mpx(2),
    );
    this.anchor2 = new box2d.b2Vec2(
      this.options.polyline[2][0] + this.options.x,
      this.options.polyline[2][1] + this.options.y - this.mpx(2),
    );
    const leftRopePos = {
      x: this.options.polyline[0][0] + this.options.x,
      y: this.options.polyline[0][1] + this.options.y,
    };
    const rightRopePos = {
      x: this.options.polyline[3][0] + this.options.x,
      y: this.options.polyline[3][1] + this.options.y,
    };
    this.ropeLeft = this.game.make.tileSprite(
      leftRopePos.x,
      leftRopePos.y,
      200,
      20,
      "MechAssets",
      "pulley_rope0000",
    );
    this.ropeCenter = this.game.make.tileSprite(
      this.anchor1.x,
      this.anchor1.y,
      200,
      20,
      "MechAssets",
      "pulley_rope0000",
    );
    this.ropeRight = this.game.make.tileSprite(
      rightRopePos.x,
      rightRopePos.y,
      200,
      20,
      "MechAssets",
      "pulley_rope0000",
    );
    this.ropeLeft.anchor.set(0, 0.5);
    this.ropeCenter.anchor.set(0, 0.5);
    this.ropeRight.anchor.set(0, 0.5);
    this.game.layers.underGround.addChild(this.ropeLeft);
    this.game.layers.underGround.addChild(this.ropeCenter);
    this.game.layers.underGround.addChild(this.ropeRight);
    this.platform1 = this.game.make.sprite(
      leftRopePos.x,
      leftRopePos.y,
      "MechAssets",
      "_default0000",
    );
    this.platform2 = this.game.make.sprite(
      rightRopePos.x,
      rightRopePos.y,
      "MechAssets",
      "_default0000",
    );
    this.game.physics.box2d.enable(this.platform1);
    this.game.physics.box2d.enable(this.platform2);
    this.plat1 = this.game.make.sprite(
      0,
      0,
      "MechAssets",
      "pulley_platform0000",
    );
    this.plat2 = this.game.make.sprite(
      0,
      0,
      "MechAssets",
      "pulley_platform0000",
    );
    this.plat1.anchor.set(0.5);
    this.plat2.anchor.set(0.5);
    this.plat1.width = 1.3 * this.mpx(this.barWidth);
    this.plat2.width = 1.3 * this.mpx(this.barWidth);
    this.base1 = this.game.make.sprite(0, 0, "MechAssets", "pulley_base0000");
    this.base2 = this.game.make.sprite(0, 0, "MechAssets", "pulley_base0000");
    this.base1.anchor.set(0.5);
    this.base2.anchor.set(0.5);
    this.platform1.addChild(this.base1);
    this.platform2.addChild(this.base2);
    this.platform1.addChild(this.plat1);
    this.platform2.addChild(this.plat2);
    this.game.layers.underGround.addChild(this.platform1);
    this.game.layers.underGround.addChild(this.platform2);
    this.platform1.body.data.SetFixedRotation(true);
    this.platform2.body.data.SetFixedRotation(true);
    this.platform1.body.data.m_userData = "reactable";
    this.platform2.body.data.m_userData = "reactable";
    this.platform1.body.data.SetLinearDamping(0.1);
    this.platform2.body.data.SetLinearDamping(0.1);

    for (const platformBody of [this.platform1.body, this.platform2.body]) {
      platformBody.clearFixtures();
      const centreWidth = this.barWidth / 2;
      const centreHeight = this.barHeight / 2;
      const paddedWidth = centreWidth + 0.1;
      const vertices = [];
      vertices.push(new box2d.b2Vec2(centreWidth, centreHeight));
      vertices.push(new box2d.b2Vec2(-centreWidth, centreHeight));
      vertices.push(new box2d.b2Vec2(-paddedWidth, 0));
      vertices.push(new box2d.b2Vec2(-centreWidth, -centreHeight));
      vertices.push(new box2d.b2Vec2(centreWidth, -centreHeight));
      vertices.push(new box2d.b2Vec2(paddedWidth, 0));
      const shape = new box2d.b2PolygonShape();
      shape.Set(vertices);
      const fixtureDef = new box2d.b2FixtureDef();
      fixtureDef.shape = shape;
      fixtureDef.friction = 0.4;
      fixtureDef.restitution = 0;
      fixtureDef.density = 3;
      const fixture = platformBody.data.CreateFixture(fixtureDef);
      fixture.id = platformBody.world.getNextFixtureId();

      if (this.options.properties.prismatic) {
        const axis = new box2d.b2Vec2(0, 1);
        const bodyDef = new box2d.b2BodyDef() as box2d.b2BodyDef & {
          density: number;
        };
        bodyDef.density = 0;
        const body = new box2d.b2Body(bodyDef, platformBody.world);
        const jointDef = new box2d.b2PrismaticJointDef();
        jointDef.Initialize(
          platformBody.data,
          body,
          platformBody.data.GetWorldCenter(),
          axis,
        );
        this.joint = this.game.physics.box2d.world.CreateJoint(jointDef);
      }
    }

    this.wheel1 = this.game.make.sprite(
      this.anchor1.x + 10,
      this.anchor1.y + 10 - this.baseHeight,
      "MechAssets",
      "pulley_anchor0000",
    );
    this.wheel2 = this.game.make.sprite(
      this.anchor2.x - 10,
      this.anchor2.y + 10 - this.baseHeight,
      "MechAssets",
      "pulley_anchor0000",
    );
    this.wheel1.anchor.set(0.5);
    this.wheel2.anchor.set(0.5);
    this.game.layers.underGround.addChild(this.wheel1);
    this.game.layers.underGround.addChild(this.wheel2);
    const pulleyJointDef = new box2d.b2PulleyJointDef();
    const anchor1Pos = new box2d.b2Vec2(
      this.pxm(this.anchor1.x),
      this.pxm(this.anchor1.y),
    );
    const anchor2Pos = new box2d.b2Vec2(
      this.pxm(this.anchor2.x),
      this.pxm(this.anchor2.y),
    );
    pulleyJointDef.Initialize(
      this.platform1.body.data,
      this.platform2.body.data,
      anchor1Pos,
      anchor2Pos,
      this.platform1.body.data.GetWorldCenter(),
      this.platform2.body.data.GetWorldCenter(),
      1,
    );
    this.joint = this.game.physics.box2d.world.CreateJoint(pulleyJointDef);
  }

  update() {
    const platform1Pos = new box2d.b2Vec2(
      this.platform1.position.x,
      this.platform1.position.y - this.baseHeight,
    );
    const anchor1Pos = new box2d.b2Vec2(
      this.anchor1.x,
      this.anchor1.y - this.baseHeight,
    );
    const platform2Pos = new box2d.b2Vec2(
      this.platform2.position.x,
      this.platform2.position.y - this.baseHeight,
    );
    const anchor2Pos = new box2d.b2Vec2(
      this.anchor2.x,
      this.anchor2.y - this.baseHeight,
    );
    if (
      Math.round(1 * this.lastp1.x) !== Math.round(1 * platform1Pos.x) ||
      Math.round(1 * this.lastp1.y) !== Math.round(1 * platform1Pos.y) ||
      Math.round(1 * this.lastp2.x) !== Math.round(1 * platform2Pos.x) ||
      Math.round(1 * this.lastp2.y) !== Math.round(1 * platform2Pos.y)
    ) {
      this.cacheAsBitmap = false;
      this.lastp1 = platform1Pos.Clone();
      this.lastp2 = platform2Pos.Clone();
      const leftRopeLength = platform1Pos.Clone().SelfSub(anchor1Pos);
      const centreRopeLength = anchor1Pos.Clone().SelfSub(anchor2Pos);
      const rightRopeLength = anchor2Pos.Clone().SelfSub(platform2Pos);
      this.ropeLeft.position = new Point(anchor1Pos.x, anchor1Pos.y);
      this.ropeLeft.width = leftRopeLength.Length();
      this.ropeLeft.height = 20;
      this.ropeLeft.rotation =
        Math.atan2(-leftRopeLength.y, -leftRopeLength.x) + Math.PI;
      this.ropeLeft.tilePosition.x = leftRopeLength.Length();
      this.ropeCenter.position = new Point(anchor1Pos.x, anchor1Pos.y);
      this.ropeCenter.width = centreRopeLength.Length();
      this.ropeCenter.height = 20;
      this.ropeCenter.rotation = Math.atan2(
        -centreRopeLength.y,
        -centreRopeLength.x,
      );
      this.ropeCenter.tilePosition.x = rightRopeLength.Length();
      this.ropeRight.position = new Point(anchor2Pos.x, anchor2Pos.y);
      this.ropeRight.width = rightRopeLength.Length();
      this.ropeRight.height = 20;
      this.ropeRight.rotation = Math.atan2(
        -rightRopeLength.y,
        -rightRopeLength.x,
      );
      this.ropeRight.tilePosition.x = rightRopeLength.Length();
      this.wheel1.rotation = rightRopeLength.Length() / Math.PI / 10;
      this.wheel2.rotation = rightRopeLength.Length() / Math.PI / 10;
    } else if (!this.cacheAsBitmap) {
      this.cacheAsBitmap = true;
    }

    return this.cacheAsBitmap;
  }
}

export = Pulley;
