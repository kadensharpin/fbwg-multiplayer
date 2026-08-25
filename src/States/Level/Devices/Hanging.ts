/// <amd-module name="States/Level/Devices/Hanging" />

import { Game, Sprite, TileSprite } from "@azerion/phaser";
import Device, { DeviceOptions } from "./Device";

type HangingOptions = {
  polyline: [[number, number], [number, number]];
  barWidth?: number;
  properties?: {
    barWidth?: number;
    density?: number;
    fullRotation?: boolean;
  };
} & DeviceOptions;

class Hanging extends Device<HangingOptions> {
  baseHeight = 60;
  readonly barWidth: number;
  readonly anchor: box2d.b2Vec2;
  readonly pos: { x: number; y: number };
  readonly rope: TileSprite;
  readonly platform: Sprite;
  readonly joint: box2d.b2Joint;

  constructor(game: Game, options: HangingOptions) {
    options.barWidth ??= 3.2;

    super(game, options);

    this.update = this.update.bind(this);

    this.barWidth = this.options.properties?.barWidth || this.options.barWidth!;
    this.anchor = new box2d.b2Vec2(
      this.options.polyline[0][0] + this.options.x,
      this.options.polyline[0][1] + this.options.y,
    );
    this.pos = {
      x: this.options.polyline[1][0] + this.options.x,
      y: this.options.polyline[1][1] + this.options.y,
    };
    this.rope = this.game.make.tileSprite(
      this.anchor.x,
      this.anchor.y,
      this.options.polyline[0][1] - this.options.polyline[1][1],
      20,
      "MechAssets",
      "pulley_rope0000",
    );
    this.rope.anchor.set(0, 0.5);
    this.game.layers.underGround.addChild(this.rope);
    this.platform = this.game.make.sprite(this.pos.x, this.pos.y);
    const hangingPlatform = this.game.make.sprite(
      0,
      0,
      "MechAssets",
      "hanging_platform0000",
    );
    hangingPlatform.anchor.set(0.5);
    hangingPlatform.width = 1.15 * this.mpx(this.barWidth);
    this.platform.addChild(hangingPlatform);
    const hangingAnchor = this.game.make.sprite(
      this.anchor.x,
      this.anchor.y,
      "MechAssets",
      "hanging_anchor0000",
    );
    const hangingBase = this.game.make.sprite(
      0,
      0,
      "MechAssets",
      "hanging_base0000",
    );
    hangingBase.anchor.set(0.5);
    this.game.physics.box2d.enable(this.platform, false);
    this.game.physics.box2d.enable(hangingAnchor);
    hangingAnchor.body.data.m_fixtureList.m_filter.categoryBits = 0;
    this.platform.addChild(hangingBase);
    this.game.layers.underGround.addChild(this.platform);
    this.game.layers.underGround.addChild(hangingAnchor);
    this.platform.body.data.SetLinearDamping(0.4);
    this.platform.body.data.SetAngularDamping(0.3);
    const platformBody = this.platform.body;
    platformBody.clearFixtures();
    const vertices = [];
    const centre = this.barWidth / 2;
    vertices.push(new box2d.b2Vec2(centre, 0.12));
    vertices.push(new box2d.b2Vec2(-centre, 0.12));
    vertices.push(new box2d.b2Vec2(-(centre + 0.1), 0));
    vertices.push(new box2d.b2Vec2(-centre, -0.12));
    vertices.push(new box2d.b2Vec2(centre, -0.12));
    vertices.push(new box2d.b2Vec2(centre + 0.1, 0));
    const polygon = new box2d.b2PolygonShape();
    polygon.Set(vertices);
    const fixtureDef = new box2d.b2FixtureDef();
    fixtureDef.shape = polygon;
    fixtureDef.friction = 0.4;
    fixtureDef.restitution = 0;
    fixtureDef.density = this.options.properties?.density || 2.5;
    fixtureDef.filter.categoryBits = 65535;
    fixtureDef.filter.maskBits = 65535;
    const fixture = platformBody.data.CreateFixture(fixtureDef);
    fixture.id = platformBody.world.getNextFixtureId();
    const jointDef = new box2d.b2DistanceJointDef();
    const anchorPos = new box2d.b2Vec2(
      this.pxm(this.anchor.x),
      this.pxm(this.anchor.y),
    );
    const thisPos = new box2d.b2Vec2(
      this.pxm(this.pos.x),
      this.pxm(this.pos.y),
    );
    jointDef.Initialize(
      hangingAnchor.body.data,
      this.platform.body.data,
      anchorPos,
      thisPos,
    );
    this.joint = this.game.physics.box2d.world.CreateJoint(jointDef);
    const jointDef2 = new box2d.b2RevoluteJointDef();
    jointDef2.Initialize(
      hangingAnchor.body.data,
      this.platform.body.data,
      thisPos,
    );
    jointDef2.lowerAngle = (-0.85 * Math.PI) / 2;
    jointDef2.upperAngle = (0.85 * Math.PI) / 2;
    if (!this.options.properties?.fullRotation) jointDef2.enableLimit = true;
    this.joint = this.game.physics.box2d.world.CreateJoint(jointDef2);
    const jointDef3 = new box2d.b2RevoluteJointDef();
    jointDef3.Initialize(
      hangingAnchor.body.data,
      this.game.level.groundBody,
      anchorPos,
    );
    this.joint = this.game.physics.box2d.world.CreateJoint(jointDef3);
  }

  update() {
    const pos = new box2d.b2Vec2(
      this.platform.position.x,
      this.platform.position.y,
    );
    const anchor = pos.Clone().SelfSub(this.anchor);
    this.rope.rotation = Math.atan2(-anchor.y, -anchor.x);
  }
}

export = Hanging;
