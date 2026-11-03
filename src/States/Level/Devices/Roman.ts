import { degToRad } from "@/utils/util";
import box2d from "@box2d/core";
import { Game } from "phaser";
import BoxedDevice from "./BoxedDevice";
import { type DeviceOptions } from "./Device";

type RomanOptions = {
  polygon: [[number, number], [number, number], [number, number]];
  rotation: number;
} & DeviceOptions;

class Roman extends BoxedDevice<RomanOptions> {
  readonly joint: box2d.b2RevoluteJoint;
  constructor(game: Game, options: RomanOptions) {
    super(game, options);

    let x: number, angle: number;
    const k = this.pxm(this.options.polygon[1][1] - this.options.polygon[0][1]);
    const f = 0.6;
    if (this.options.polygon[0][0] === this.options.polygon[1][0]) {
      x = 2 * this.pxm(this.options.polygon[2][0] - this.options.polygon[1][0]);
      angle = -Math.atan(k / (x / 2));
    } else {
      x = 2 * this.pxm(this.options.polygon[1][0] - this.options.polygon[0][0]);
      angle = Math.atan(k / (x / 2));
    }
    const pos = {
      x: this.options.polygon[1][0] + this.options.x + this.mpx(1),
      y: this.options.polygon[1][1] + this.options.y - this.mpx(1),
    };
    const bar = this.game.make.tileSprite(
      pos.x,
      pos.y,
      this.mpx(x),
      30,
      "MechAssets",
      "roman_bar0000",
    );
    this.game.physics.box2d.enable(bar);
    const rightEnd = this.game.make.sprite(
      this.mpx(x / 2),
      0,
      "MechAssets",
      "roman_end0000",
    );
    rightEnd.anchor.set(0.05, 0.5);
    bar.addChild(rightEnd);
    const leftEnd = this.game.make.sprite(
      -this.mpx(x / 2),
      0,
      "MechAssets",
      "roman_end0000",
    );
    leftEnd.scale.x = -1;
    leftEnd.anchor.set(0.05, 0.5);
    bar.addChild(leftEnd);
    const centre = this.game.make.sprite(
      pos.x,
      pos.y,
      "MechAssets",
      "roman_center0000",
    );
    centre.anchor.set(0.5, 0.5);
    bar.body.clearFixtures();
    const vertices = [];
    vertices.push(new box2d.b2Vec2(-x / 2, -f / 2));
    vertices.push(new box2d.b2Vec2(x / 2, -f / 2));
    vertices.push(new box2d.b2Vec2(x / 2 - 2, f / 2));
    vertices.push(new box2d.b2Vec2(-x / 2 + 2, f / 2));
    const fixtureShape = new box2d.b2PolygonShape();
    fixtureShape.Set(vertices);
    bar.body.data.CreateFixture({
      shape: fixtureShape,
      friction: 0.7,
      restitution: 0,
      density: 0.1,
      filter: { categoryBits: 1, maskBits: 65535 },
    });
    bar.body.data.SetAngle(angle || 0);
    const base = this.game.make.sprite(
      pos.x,
      pos.y - this.mpx(k),
      "MechAssets",
      "roman_base0000",
    );
    this.game.physics.box2d.enable(base);
    base.height / (2 * this.mpx(k));
    base.height = -2 * this.mpx(k);
    this.game.layers.overGround.addChild(base);
    this.game.layers.overGround.addChild(bar);
    this.game.layers.overChars.addChild(centre);
    base.body.clearFixtures();
    base.body.data.SetAngle(degToRad(options.rotation));
    base.body.mass = 0;
    base.body;
    const vertices1 = [];
    vertices1.push(new box2d.b2Vec2(-1, 0));
    vertices1.push(new box2d.b2Vec2(0, k));
    vertices1.push(new box2d.b2Vec2(1, 0));
    const fixtureShape1 = new box2d.b2PolygonShape();
    fixtureShape1.Set(vertices1);
    base.body.data.CreateFixture({
      shape: fixtureShape1,
      friction: 0.7,
      restitution: 0,
      density: 0.1,
      filter: { categoryBits: 1, maskBits: 65535 },
    });
    const jointDef = new box2d.b2RevoluteJointDef();
    const bodyCentre = bar.body.data.GetWorldCenter();
    const jointPos = new box2d.b2Vec2(bodyCentre.x, bodyCentre.y);
    jointDef.Initialize(bar.body.data, base.body.data, jointPos);
    this.joint = this.game.physics.box2d.world.CreateJoint(jointDef);
  }
}

export default Roman;
