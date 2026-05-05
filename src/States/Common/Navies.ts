/// <amd-module name="States/Common/Navies" />

import { Game, Sprite } from "@azerion/phaser";

class MenuFairy extends Sprite {
  constructor(game: Game, x: number, y: number, target: number = 3) {
    super(game, x, y, "MenuAssets", "_default0000");
    this.update = this.update.bind(this);
    this.anchor.set(0.5);
    for (let i = 0; i < target; i++) {
      const sprite = new Sprite(
        game,
        0,
        0,
        "MenuAssets",
        "Navy0000",
      ) as FairySprite;
      sprite.anchor.set(0.5);
      sprite.scale.set(0.3 + 0.7 * Math.random());
      sprite.offsetCart = {
        x: 200 * (Math.random() - 0.5),
        y: 50 * (Math.random() - 0.5),
      };
      sprite.offset = { r: 400 * Math.random(), theta: Math.random() };
      sprite.rprime = 0;
      sprite.speed = {
        r: 7e-4 + 5e-4 * Math.random(),
        theta: 3e-4 + 5e-4 * (Math.random() - 0.5),
      };
      sprite.pos = {
        r: Math.random(),
        theta: Math.random() * Math.PI * 2,
      };
      sprite.update = function () {
        this.rprime += this.speed.r;
        this.pos.r = this.offset.r * Math.sin(this.rprime);
        this.pos.theta += this.speed.theta;
        this.x = this.offsetCart.x + this.pos.r * Math.cos(this.pos.theta);
        this.y = this.offsetCart.y + this.pos.r * Math.sin(this.pos.theta);
      };
      this.addChild(sprite);
    }
  }
  update() {
    for (const child of this.children) {
      (child as FairySprite).update();
    }
  }
}

export = MenuFairy;

type FairySprite = Sprite & {
  offsetCart: { x: number; y: number };
  offset: { r: number; theta: number };
  rprime: number;
  speed: { r: number; theta: number };
  pos: { r: number; theta: number };
};
