import { Game, Tile } from "phaser";
import * as box2d from "phaser-box2d";
import Device, { DeviceOptions } from "./Device";

export type BoxedDeviceOptions = {
  boxSize?: { width: number; height: number };
} & DeviceOptions;

class BoxedDevice<Options extends BoxedDeviceOptions> extends Device<Options> {
  constructor(game: Game, options: Options) {
    options.boxSize ??= { width: 2, height: 2 };
    options.enableBody ??= true;
    options.rotation ||= 0;
    let box = new box2d.b2Vec2(
      game.physics.box2d.mpx(options.boxSize.width / 2),
      game.physics.box2d.mpx(options.boxSize.height / 2),
    );
    box = box.SelfRotateRadians((-Math.PI * options.rotation) / 180);
    options.x = options.x + box.x;
    options.y = options.y - box.y;

    super(game, options);

    this.ocupy = this.ocupy.bind(this);
  }

  ocupy(tiles: Tile[][]) {
    const x = this.options.x / 32;
    const y = this.options.y / 32;
    this.ocupyTile(tiles, x, y);
    this.ocupyTile(tiles, x - 1, y - 1);
    this.ocupyTile(tiles, x - 1, y);
    this.ocupyTile(tiles, x, y - 1);
  }
}

export default BoxedDevice;
