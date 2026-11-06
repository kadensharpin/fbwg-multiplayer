import Body from "@/utils/box2d/Body";
import { deepObjectExtend, degToRad } from "@/utils/util";
import { Color, Game, Group, Signal, Sprite } from "phaser";
import { ParsedTile } from "../Level";

export type DeviceOptions = {
  type: string;

  x: number;
  y: number;
  width: number;
  height: number;

  enableBody?: boolean;
  atlasName?: string;
  frameName?: string;
  lightAtlas?: string;
  lightFrame?: string;

  layer?: keyof Game["layers"];
  rotation?: number;
  properties?: {
    initialState?: number;
    group?: number;
  };
};

export type Light = Sprite & {
  offTint: number;
  onTint: number;
  offFrameName: string;
  onFrameName: string;
};

export type Cell = { occupied: boolean };

abstract class Device<Options extends DeviceOptions> extends Group {
  state: number;
  readonly options: Options;
  readonly lights: Light[];

  sprite?: Sprite;
  body?: Body;
  signal?: Signal<[this]>;

  constructor(game: Game, options: Options) {
    super(game);

    this.ocupy = this.ocupy.bind(this);
    this.ocupyTile = this.ocupyTile.bind(this);
    this.checkState = this.checkState.bind(this);
    this.updateState = this.updateState.bind(this);
    this._updateState = this._updateState.bind(this);
    this.updateLight = this.updateLight.bind(this);
    this.setupLight = this.setupLight.bind(this);
    this.getColor = this.getColor.bind(this);
    this.registerDevice = this.registerDevice.bind(this);
    this.pxm = this.pxm.bind(this);
    this.mpx = this.mpx.bind(this);

    this.lights = [];

    this.options = deepObjectExtend(
      {
        atlasName: null,
        frameName: null,
        lightAtlas: null,
        lightFrame: null,
      },
      options,
    );
    this.options.properties ||= {};
    this.options.layer ??= "overGround";
    this.options.rotation ||= 0;
    this.options.rotation = degToRad(this.options.rotation);
    this.options.width = game.physics.box2d.pxm(this.options.width);
    this.options.height = game.physics.box2d.pxm(this.options.height);
    this.state = this.options.properties?.initialState || 0;

    if (this.options.atlasName && this.options.frameName) {
      this.sprite = this.game.make.sprite(
        this.options.x,
        this.options.y,
        this.options.atlasName,
        this.options.frameName,
      );
      this.game.layers[this.options.layer]?.addChild(this.sprite);
      this.sprite.anchor.set(0.5);
    }

    if (this.sprite) {
      this.sprite.autoCull = true;
      if (this.options.enableBody) {
        this.game.physics.box2d.enable(this.sprite);
        this.sprite.body.clearFixtures();
        this.sprite.body.data.SetAngle(this.options.rotation);
        this.body = this.sprite.body;
      }
    }

    if (this.options.lightAtlas && this.options.lightFrame) {
      const light: Light = this.create(
        0,
        0,
        this.options.lightAtlas,
        this.options.lightFrame + "_on0000",
      );
      this.sprite?.addChild(light);
      light.anchor.set(0.5);
      light.offFrameName = this.options.lightFrame + "_off0000";
      light.onFrameName = this.options.lightFrame + "_on0000";
      light.frameName = light.offFrameName;
      this.lights.push(light);
    }

    setTimeout(() => this.updateLight(this.state));
  }

  mpx(metres: number): number {
    return this.game.physics.box2d.mpx(-1 * metres);
  }

  pxm(pixels: number): number {
    return this.game.physics.box2d.pxm(-1 * pixels);
  }

  registerDevice() {
    this.game.MechManager.registerDevice(this);
    if (this.lights.length > 0) this.setupLight();
  }

  getColor(): `#${string}` {
    const index = Number(
      String(this.options.properties!.group)[0],
    ) as keyof typeof Device.groupColors;
    return Device.groupColors[index] || "#ffffff";
  }

  setupLight() {
    for (const light of this.lights) {
      const colour = this.getColor();
      light.offTint = Color.hexToColor(colour).color;
      light.onTint = Color.hexToColor(colour).color;
      light.tint = light.offTint;
    }
  }

  updateLight(state: number) {
    if (!this.lights.length) return [];
    const ret: (number | undefined)[] = [];
    for (const light of this.lights) {
      if (light.onFrameName && state) {
        light.frameName = light.onFrameName;
        light.tint = light.onTint;
      } else if (light.offFrameName && !state) {
        light.frameName = light.offFrameName;
        light.tint = light.offTint;
      } else {
        ret.push(undefined);
        continue;
      }
      ret.push(light.tint);
    }
    return ret;
  }

  update() {
    return this.checkState();
  }

  _updateState() {
    this.updateLight(this.state);
    this.updateState(false);
  }

  updateState(_mute: boolean) {}

  checkState() {}

  ocupyTile(tiles: ParsedTile[][], x: number, y: number) {
    const row = tiles[Math.floor(y)];
    const cell = row?.[Math.floor(x)];
    if (cell) {
      cell.occupied = true;
      return true;
    }
    return false;
  }

  ocupy(_tiles: ParsedTile[][]) {}

  static sounds(): string | string[] {
    return [];
  }

  static readonly groupColors = {
    1: "#ff0000",
    2: "#00cc00",
    3: "#0D3EFF",
    4: "#ffff00",
    5: "#EC0EF1",
    6: "#57beff",
    7: "#9933FF",
  } as const;
}

export default Device;
