import Body from "@/utils/box2d/Body";
import Box2D from "@/utils/box2d/Box2D";
import box2d from "@box2d/core";
import { BitmapData, Game, Image, RenderTexture, Sprite } from "phaser";
import seedrandom from "seedrandom";
import InlineFilter from "../../filters/InlineFilter";
import OutlineFilter from "../../filters/OutlineFilter";
import ShadowFilter from "../../filters/ShadowFilter";
import Liquid from "./Devices/Liquid";
import Snow, { SnowOptions } from "./Devices/Snow";
import { ParsedMapData, ParsedTile } from "./Level";
import MechManager from "./MechManager";

class Ground extends Sprite {
  declare body: Body;
  filterPadding = 10;
  options = {
    width: 0,
    height: 0,
    tileWidth: 32,
    tileHeight: 32,
    key: "map",
  };
  mapData: ParsedMapData;
  bmd?: BitmapData;
  maskBmd?: BitmapData;
  foregroundBmd?: BitmapData;
  sprite?: Sprite;
  image?: Image;

  constructor(game: Game, mapData: ParsedMapData, options: {}) {
    super(game, 0, 0);

    this.CreateLiquid = this.CreateLiquid.bind(this);
    this.CreateSnow = this.CreateSnow.bind(this);
    this.CreateSnows = this.CreateSnows.bind(this);
    this.createGroundFixture = this.createGroundFixture.bind(this);
    this.destroy = this.destroy.bind(this);
    this.drawForeground = this.drawForeground.bind(this);
    this.decorate = this.decorate.bind(this);
    this.getNaviesPoints = this.getNaviesPoints.bind(this);
    this.getTileAt = this.getTileAt.bind(this);
    this.drawTile = this.drawTile.bind(this);
    this.options = Object.assign(this.options, options);

    this.game.physics.box2d.enable(this);
    this.body.mass = 0;
    this.body.clearFixtures();
    this.mapData = mapData;
    this.options.width = this.mapData.width * this.mapData.tileWidth;
    this.options.height = this.mapData.height * this.mapData.tileHeight;
    this.convertTilemap();
    this.CreateSnows();
    Box2D.worldBoundsFilterCategory = 65535;
    this.game.physics.box2d.setBounds(
      -100,
      -100,
      this.options.width + 200,
      this.options.height + 200,
      true,
      true,
      true,
      true,
      65535,
      65535,
    );
    this.drawForeground();
    this.applyFilter();
  }

  getTileAt(x: number, y: number): ParsedTile | null {
    return this.mapData.layers[0].data[y]?.[x] ?? null;
  }

  getTileRight(x: number, y: number) {
    return this.getTileAt(x + 1, y);
  }

  getTileLeft(x: number, y: number) {
    return this.getTileAt(x - 1, y);
  }

  getTileUp(x: number, y: number) {
    return this.getTileAt(x, y - 1);
  }

  getTileDown(x: number, y: number) {
    return this.getTileAt(x, y + 1);
  }

  drawTile(
    ctx: CanvasRenderingContext2D,
    destX: number,
    destY: number,
    type: number,
  ) {
    let frameName;
    if (type === 10) {
      type = 0;
    }
    if (type === 11) {
      type = 1;
    }
    if (type === 12) {
      type = 2;
    }
    if (type === 55) {
      type = 5;
    }
    if (type === 0) {
      const rand = Math.floor(Math.random() * 4);
      frameName = "MaskBox0000" + rand;
    } else {
      frameName = "MaskBox" + type + "0000";
    }
    const ground = this.game.cache.getFrameByName("GroundAssets", frameName);
    const img = this.game.cache.getImage("GroundAssets");
    destX -= (ground.width - 32) / 2 - 32;
    destY -= (ground.height - 32) / 2 - 32;
    return ctx.drawImage(
      img,
      ground.x,
      ground.y,
      ground.width,
      ground.height,
      destX,
      destY,
      ground.width,
      ground.height,
    );
  }

  convertTilemap() {
    this.body.data.SetUserData("ground");
    this.game.level.groundBody = this.body.data;
    const maskBmd = this.game.add.bitmapData(
      this.options.width + 64,
      this.options.height + 64,
    );
    let offsetX = 0;
    let offsetY = 0;
    for (let Y = 0; Y < this.mapData.height; Y++) {
      let A = 0;
      for (let X = 0; X < this.mapData.width; X++) {
        const tile = this.getTileAt(X, Y);
        if (!tile || tile.index <= -1) continue;
        const tileX = X * this.options.tileWidth;
        const tileY = Y * this.options.tileHeight;
        if (tile.properties.type === 0) {
          if (A === 0) {
            offsetX = X * tile.width;
            offsetY = Y * tile.height;
            A = 1;
          }
          const rightTile = this.getTileRight(X, Y);
          if (rightTile && rightTile.properties.type === 0) {
            A += 1;
            this.drawTile(maskBmd.ctx, tileX, tileY, tile.properties.type);
            continue;
          }
          const shape = new box2d.b2PolygonShape();
          const vertices = [];
          vertices.push(new box2d.b2Vec2(0, 0));
          vertices.push(new box2d.b2Vec2(-A, 0));
          vertices.push(new box2d.b2Vec2(-A, -1));
          vertices.push(new box2d.b2Vec2(0, -1));
          vertices.forEach((vertex) => {
            vertex.x -= this.body.world.pxm(offsetX);
            vertex.y -= this.body.world.pxm(offsetY);
          });
          shape.Set(vertices);
          A = 0;
          this.createGroundFixture(shape);
          this.drawTile(maskBmd.ctx, tileX, tileY, tile.properties.type);
        } else if (
          tile.properties.type === 5 ||
          tile.properties.type === 6 ||
          tile.properties.type === 7 ||
          tile.properties.type === 55
        ) {
          if (A === 0) {
            offsetX = X * tile.width;
            offsetY = Y * tile.height;
            A = 1;
          }
          const rightTile = this.getTileRight(X, Y);
          if (rightTile && rightTile.properties.type === tile.properties.type) {
            if (A > 1) {
              this.drawTile(maskBmd.ctx, tileX, tileY, tile.properties.type);
            }
            A += 1;
            continue;
          }
          const shape1 = this.createGroundShape(
            8,
            new box2d.b2Vec2(
              this.body.world.pxm(tileX) - A + 1,
              this.body.world.pxm(tileY),
            ),
          );
          this.createGroundFixture(shape1);
          this.drawTile(
            maskBmd.ctx,
            tileX - this.body.world.mpx(A - 1),
            tileY,
            8,
          );
          const shape2 = this.createGroundShape(
            9,
            new box2d.b2Vec2(
              this.body.world.pxm(tileX),
              this.body.world.pxm(tileY),
            ),
          );
          this.createGroundFixture(shape2);
          this.drawTile(maskBmd.ctx, tileX, tileY, 9);
          const shape3 = new box2d.b2PolygonShape();
          const vertices = [];
          vertices.push(new box2d.b2Vec2(-1, -1 / 2 + 0.05));
          vertices.push(new box2d.b2Vec2(1 - A, -1 / 2 + 0.05));
          vertices.push(new box2d.b2Vec2(1 - A, -1));
          vertices.push(new box2d.b2Vec2(-1, -1));
          vertices.forEach((vertex) => {
            vertex.x -= this.body.world.pxm(offsetX);
            vertex.y -= this.body.world.pxm(offsetY);
          });
          shape3.Set(vertices);
          this.createGroundFixture(shape3);
          this.CreateLiquid(tile.properties.type, X + 1, Y, A);
          A = 0;
        } else if (tile.properties.type === -1) {
          this.drawTile(maskBmd.ctx, tileX, tileY, 0);
        } else {
          const groundShape = this.createGroundShape(
            tile.properties.type!,
            new box2d.b2Vec2(
              this.body.world.pxm(tileX),
              this.body.world.pxm(tileY),
            ),
          );
          this.createGroundFixture(groundShape);
          this.drawTile(maskBmd.ctx, tileX, tileY, tile.properties.type!);
        }
      }
    }
    const foregroundBmd = this.game.make.bitmapData(
      this.options.width + 64,
      this.options.height + 64,
    );
    const foreground = this.game.cache.getFrameByName(
      "TempleAssets",
      "ForeGround0000",
    );
    const img = this.game.cache.getImage("TempleAssets");
    const width = Math.ceil(this.options.width / 256);
    for (let x = 0; x < width; x++) {
      const height = Math.ceil(this.options.height / 256);
      for (let y = 0; y < height; y++) {
        foregroundBmd.ctx.drawImage(
          img,
          foreground.x,
          foreground.y,
          foreground.width,
          foreground.height,
          x * 256,
          y * 256,
          foreground.width,
          foreground.height,
        );
      }
    }
    const bmd = this.game.add.bitmapData(
      this.options.width + 64,
      this.options.height + 64,
    );
    bmd.alphaMask(foregroundBmd, maskBmd);
    this.bmd = bmd;
    this.maskBmd = maskBmd;
    this.foregroundBmd = foregroundBmd;
    return this.body;
  }

  getNaviesPoints() {
    let quadrants: { x: number; y: number }[] = [
      {
        x: Math.floor(this.mapData.height / 4),
        y: Math.floor(this.mapData.height / 4),
      },
      {
        x: Math.floor((this.mapData.height * 3) / 4),
        y: Math.floor(this.mapData.height / 4),
      },
      {
        x: Math.floor(this.mapData.height / 4),
        y: Math.floor((this.mapData.height * 3) / 4),
      },
      {
        x: Math.floor((this.mapData.height * 3) / 4),
        // TODO: Bug?
        y: Math.floor(this.mapData.height / 4),
      },
    ];
    const roundToOne = (n: number) => (n > 0 ? 1 : n < 0 ? -1 : 0);
    const points: { x: number; y: number }[] = [];
    for (const point of quadrants) {
      const offset = {
        x: roundToOne(Math.random() - 0.5),
        y: roundToOne(Math.random() - 0.5),
      };
      while (
        point.x > 0 &&
        point.x < this.mapData.width &&
        point.y > 0 &&
        point.y < this.mapData.height
      ) {
        if (this.getTileAt(point.x, point.y)?.properties.type == null) {
          point.x *= this.body.world.mpx(1);
          point.y *= this.body.world.mpx(1);
          points.push(point);
          break;
        }
        point.x += offset.x;
        point.y += offset.y;
      }
    }
    return points;
  }

  decorate(
    objects: ((typeof MechManager.classNames)[keyof typeof MechManager.classNames] extends new (
      ...args: any
    ) => infer T
      ? T
      : never)[],
  ) {
    const rng = seedrandom("ASDFA");
    const nextRandom = () => Math.round(rng() * 3 + 3.5);
    for (const object of objects) {
      if ("ocupy" in object) {
        object.ocupy(this.mapData.layers[0].data);
      }
    }
    const tiles: ParsedTile[] = [];
    const decoTexture = new RenderTexture(
      this.game,
      this.options.width + 64,
      this.options.height + 64,
      "decosTexture",
      undefined,
      1,
    );
    for (let Y = 1; Y < this.mapData.height; Y += nextRandom()) {
      for (let X = 1; X < this.mapData.width - 1; X += nextRandom()) {
        for (let x = 0; x <= 6; ++x) {
          let prevTile = null;
          for (let y = 0; y <= 6; ++y) {
            const tileX = Math.max(Math.min(X + x, this.mapData.width - 2), 0);
            const tileY = Math.max(Math.min(Y + y, this.mapData.height - 1), 0);
            const tile = this.getTileAt(tileX, tileY);
            if (
              tile?.properties.type != null &&
              !tile.occupied &&
              tiles.indexOf(tile) < 0 &&
              tiles.indexOf(this.getTileUp(tileX, tileY)!) < 0 &&
              tiles.indexOf(this.getTileRight(tileX, tileY)!) < 0 &&
              tiles.indexOf(this.getTileAt(tileX + 1, tileY - 1)!) < 0 &&
              tiles.indexOf(this.getTileLeft(tileX, tileY)!) < 0 &&
              tiles.indexOf(this.getTileAt(tileX - 1, tileY - 1)!) < 0
            ) {
              prevTile = tile;
              tiles.push(tile);
              break;
            }
          }
          if (prevTile != null) {
            break;
          }
        }
      }
    }
    let i = 0;
    for (const tile of tiles) {
      const tileUp = this.getTileUp(tile.x, tile.y);
      const tileRight = this.getTileRight(tile.x, tile.y);
      const tileLeft = this.getTileLeft(tile.x, tile.y);
      let frameName = null;
      let rotation = 0;
      let scaleX = 1;
      let randomScaleX = 1;
      if (
        tile.properties.type === 0 &&
        tileUp?.properties.type != null &&
        tileRight?.properties.type != null &&
        tileLeft?.properties.type != null
      ) {
        frameName = "O_" + ((i % 2) + 1);
        rotation = i === 1 ? (Math.floor(Math.random() * 3) * Math.PI) / 2 : 0;
      } else if (
        tile.properties.type !== 0 ||
        tileUp?.properties.type != null
      ) {
        if (tile.properties.type === 0) {
          frameName = "X";
          rotation = (Math.floor(Math.random() * 3) * Math.PI) / 2;
        } else if (tile.properties.type === 1) {
          frameName = "A";
        } else if (tile.properties.type === 2) {
          frameName = "A";
          scaleX = -1;
        } else if (tile.properties.type === 3) {
          frameName = "V";
        } else if (tile.properties.type === 4) {
          frameName = "V";
          scaleX = -1;
        }
      } else {
        frameName = "T_" + ((i % 3) + 1);
        randomScaleX = Math.round(Math.random()) * 2 - 1;
      }
      i++;
      if (frameName == null) continue;
      const sprite = this.game.make.sprite(
        (tile.x + 0.5) * this.body.world.mpx(1),
        (tile.y + 0.5) * this.body.world.mpx(1),
        "TempleAssets",
        "decor_" + frameName + "0000",
      );
      sprite.rotation = rotation;
      sprite.scale.set(randomScaleX * scaleX, 1);
      sprite.anchor.set(0.5);
      decoTexture.renderXY(sprite, sprite.x + 32, sprite.y + 32, false);
      sprite.destroy();
    }
    this.game.cache.addRenderTexture("decosTexture", decoTexture);
    const decoSprite = this.game.make.sprite(
      -32,
      -32,
      this.game.cache.getRenderTexture("decosTexture").texture,
    );
    this.game.layers.decorations.addChild(decoSprite);
    this.game.layers.decorations.cacheAsBitmap = true;
  }

  drawForeground() {
    this.image = this.game.make.image(0, 0, this.bmd);
  }

  applyFilter() {
    const background = this.game.make.tileSprite(
      0,
      0,
      this.options.width,
      this.options.height,
      "TempleAssets",
      "BackGround0000",
    );
    this.game.layers.background.addChild(background);
    background.cacheAsBitmap = true;
    const filterWidth = this.options.width + 64;
    const filterHeight = this.options.height + 64;
    const inlineFilter = new InlineFilter(
      this.game,
      filterWidth,
      filterHeight,
      3,
      16711680,
    );
    inlineFilter.init();
    const outlineFilter = new OutlineFilter(
      this.game,
      filterWidth,
      filterHeight,
      3.5,
      0,
    );
    outlineFilter.init();
    const shadowFilter = new ShadowFilter(
      this.game,
      filterWidth,
      filterHeight,
      8,
      0,
    );
    shadowFilter.init();
    this.image!.filters = [inlineFilter, outlineFilter, shadowFilter];
    const groundTexture = new RenderTexture(
      this.game,
      filterWidth,
      filterHeight,
      "groundTexture",
      undefined,
      1,
    );
    this.game.renderer.renderSession.resolution = 1;
    groundTexture.renderRawXY(this.image!, 0, 0, true);
    this.game.renderer.renderSession.resolution = this.game.resolution;
    this.game.cache.addRenderTexture("groundTexture", groundTexture);
    this.sprite = this.game.make.sprite(
      -32,
      -32,
      this.game.cache.getRenderTexture("groundTexture").texture,
    );
    this.game.layers.ground.addChild(this.sprite);
    this.sprite.cacheAsBitmap = true;
    this.image?.destroy();
    this.bmd?.destroy();
    this.maskBmd?.destroy();
    this.foregroundBmd?.destroy();
  }

  destroy() {
    this.sprite?.destroy();
    this.image?.destroy();
    this.bmd?.destroy();
    this.maskBmd?.destroy();
    this.foregroundBmd?.destroy();
    super.destroy();
  }

  createGroundFixture(
    shape: box2d.b2Shape,
    isSensor: boolean = false,
    userData: any = null,
  ) {
    const fixtureDef = {} as box2d.b2FixtureDef;
    fixtureDef.shape = shape;
    fixtureDef.filter = { categoryBits: 1, maskBits: 4369 };
    fixtureDef.friction = 0.8;
    fixtureDef.isSensor = isSensor;
    fixtureDef.userData = userData;
    const fixture = this.body.data.CreateFixture(fixtureDef);
    fixture.id = this.body.world.getNextFixtureId();
  }

  createGroundShape(type: number, offset: { x: number; y: number }) {
    const vertices: box2d.b2Vec2[] = [];
    if (type === 0 || type === 10) {
      vertices.push(new box2d.b2Vec2(0, 0));
      vertices.push(new box2d.b2Vec2(-1, 0));
      vertices.push(new box2d.b2Vec2(-1, -1));
      vertices.push(new box2d.b2Vec2(0, -1));
    } else if (type === 1 || type === -2 || type === 11) {
      vertices.push(new box2d.b2Vec2(-1, 0));
      vertices.push(new box2d.b2Vec2(-1, -1));
      vertices.push(new box2d.b2Vec2(0, -1));
    } else if (type === 2 || type === 12) {
      vertices.push(new box2d.b2Vec2(0, 0));
      vertices.push(new box2d.b2Vec2(-1, -1));
      vertices.push(new box2d.b2Vec2(0, -1));
    } else if (type === 3) {
      vertices.push(new box2d.b2Vec2(0, 0));
      vertices.push(new box2d.b2Vec2(-1, 0));
      vertices.push(new box2d.b2Vec2(-1, -1));
    } else if (type === 4) {
      vertices.push(new box2d.b2Vec2(0, 0));
      vertices.push(new box2d.b2Vec2(-1, 0));
      vertices.push(new box2d.b2Vec2(0, -1));
    } else if (type === 5 || type === 6 || type === 7) {
      vertices.push(new box2d.b2Vec2(0, -1 / 2));
      vertices.push(new box2d.b2Vec2(-1, -1 / 2));
      vertices.push(new box2d.b2Vec2(-1, -1));
      vertices.push(new box2d.b2Vec2(0, -1));
    } else if (type === 8) {
      vertices.push(new box2d.b2Vec2(0, 0));
      vertices.push(new box2d.b2Vec2(-1 - 0.3, -1 / 2));
      vertices.push(new box2d.b2Vec2(-1 - 0.3, -1));
      vertices.push(new box2d.b2Vec2(0, -1));
    } else if (type === 9) {
      vertices.push(new box2d.b2Vec2(0.3, -1 / 2));
      vertices.push(new box2d.b2Vec2(-1, 0));
      vertices.push(new box2d.b2Vec2(-1, -1));
      vertices.push(new box2d.b2Vec2(0.3, -1));
    }
    vertices.forEach((vertex) => {
      vertex.x -= offset.x;
      vertex.y -= offset.y;
    });
    const shape = new box2d.b2PolygonShape();
    shape.Set(vertices);
    return shape;
  }

  CreateSnows() {
    let snow: SnowOptions["data"] | null = null;
    const mapHeight = this.mapData.height;
    const mapWidth = this.mapData.width;
    const snows: SnowOptions["data"][] = [];
    console.log("WE");
    for (const rows of this.mapData.layers[0].data) {
      for (const tile of rows) {
        if (tile.properties.type === 10) {
          snow ??= {
            x: tile.x,
            y: tile.y,
            length: 0,
            dir: "WE",
          };
          snow.length += 1;
        } else if (snow != null) {
          snows.push(snow);
          snow = null;
        }
      }
    }
    console.log("SE");
    for (let l = 0; l <= mapWidth + mapHeight; ++l) {
      for (let y = 0; y <= l; y = ++y) {
        let x = l - y;
        if (y < 0 || x < 0 || y >= mapHeight || x >= mapWidth) continue;
        const tile = this.getTileAt(x, y);
        if (tile?.properties.type === 11) {
          snow ??= {
            x: y,
            y: x,
            length: 0,
            dir: "SE",
          };
          snow.length += 1;
        } else if (snow != null) {
          snows.push(snow);
          snow = null;
        }
      }
    }
    console.log("SW");
    const l = Math.max(mapWidth, mapHeight);
    for (let i = 0; i <= l * 2; i++) {
      for (let x = 0; x <= mapHeight; ++x) {
        let y = i - l + x;
        if (x < 0 || y < 0 || x >= mapHeight || y >= mapWidth) continue;
        const tile = this.mapData.layers[0].data[x][y];
        if (tile.properties.type === 12) {
          snow ??= {
            x: x,
            y: y,
            length: 0,
            dir: "SW",
          };
          snow.length += 1;
        } else if (snow != null) {
          snows.push(snow);
          snow = null;
        }
      }
    }
    console.log(snows);
    for (const snow of snows) {
      this.CreateSnow(snow);
    }
  }

  CreateSnow(options: SnowOptions["data"]) {
    return new Snow(this.game, this, options);
  }

  CreateLiquid(type: number, x: number, y: number, width: number) {
    return new Liquid(this.game, x - width, y, {
      type: type,
      width: width,
    });
  }
}

export default Ground;
