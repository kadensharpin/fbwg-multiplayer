import box2d from "@box2d/core";
import Phaser, {
  BitmapData,
  BitmapText,
  Game,
  Group,
  Key,
  Keyboard,
  Physics,
  Rectangle,
  Signal,
  Sprite,
  State,
  Tilemap,
  TilemapParser,
} from "phaser";

import { TranslationString } from "@/utils/lang/translations";
import { Sounds } from "@/utils/sound/sounds";
import { deepObjectExtend } from "@/utils/util";
import _ from "underscore";
import { LevelData } from "../../temple";
import Navies from "../Common/Navies";
import End from "../End";
import CameraManager from "./CameraManager";
import Character, { Characters } from "./character";
import CursorToggle from "./CursorToggle";
import Beamer from "./Devices/Beamer";
import Diamond from "./Devices/Diamond";
import Door from "./Devices/Door";
import Ground from "./Ground";
import LevelUI from "./LevelUI";
import MechManager from "./MechManager";
import PauseMenu from "./PauseMenu";

class Level extends State {
  useDust = true;
  pers1?: Character;
  pers2?: Character;
  door1?: Door;
  door2?: Door;
  debug: boolean = false;
  ended: boolean = false;
  loadCompleted: boolean = false;
  showfps: boolean = false;
  soundIds?: (keyof Sounds)[];
  sounds?: Sounds;
  onReady: Signal;
  levelPath?: string;
  levelData?: LevelData;
  levelState?: {
    diamonds: number;
    silverDiamond: number;
    time: number;
  };
  tutorialTexts?: (BitmapText & { rects: Rectangle[]; shown?: boolean })[];
  ground?: Ground;
  totalDiamonds?: number;
  cursorToggle?: CursorToggle | null;
  camManager?: CameraManager;
  ui?: LevelUI;
  pauseMenu?: PauseMenu;
  pauseKey?: Key;
  navies?: Navies[];
  objects?: ((typeof MechManager.classNames)[keyof typeof MechManager.classNames] extends new (
    ...args: any
  ) => infer T
    ? T
    : never)[];
  size?: { width: number; height: number };
  root?: Group;
  levelStarted: boolean = false;
  restartKey?: Key;
  darkness?: Sprite;
  darknessBmd?: BitmapData & { offset: { x: number; y: number } };
  mapData?: ParsedMapData;
  groundBody?: box2d.b2Body;

  constructor() {
    super();

    this.quit = this.quit.bind(this);
    this.gameOver = this.gameOver.bind(this);
    this.retry = this.retry.bind(this);
    this.updateDust = this.updateDust.bind(this);
    this.updateTutorial = this.updateTutorial.bind(this);
    this.update = this.update.bind(this);
    this.gameFinish = this.gameFinish.bind(this);
    this.animateFinish = this.animateFinish.bind(this);
    this.checkEndGame = this.checkEndGame.bind(this);
    this.updateMusic = this.updateMusic.bind(this);
    this.setupCursorToggle = this.setupCursorToggle.bind(this);
    this.onSettingChange = this.onSettingChange.bind(this);
    this.createCharObjects = this.createCharObjects.bind(this);
    this.createObjects = this.createObjects.bind(this);
    this.fillDustLayer = this.fillDustLayer.bind(this);
    this.updateDarkness = this.updateDarkness.bind(this);
    this.setupDarkness = this.setupDarkness.bind(this);
    this.setupLayers = this.setupLayers.bind(this);
    this.pauseUpdate = this.pauseUpdate.bind(this);
    this.togglePause = this.togglePause.bind(this);
    this.startLevel = this.startLevel.bind(this);
    this.start = this.start.bind(this);
    this.layoutContent = this.layoutContent.bind(this);
    this.loadComplete = this.loadComplete.bind(this);
    this.setupTutorial = this.setupTutorial.bind(this);
    this.parseMapPropper = this.parseMapPropper.bind(this);
    this.killAll = this.killAll.bind(this);
    this.shutdown = this.shutdown.bind(this);
    this.decodeAudio = this.decodeAudio.bind(this);
    this.preloadAudioFiles = this.preloadAudioFiles.bind(this);
    this.baseLoadComplete = this.baseLoadComplete.bind(this);
    this.create = this.create.bind(this);
    this.init = this.init.bind(this);
    this.onReady = new Signal();
  }

  init(levelData: LevelData) {
    this.levelPath = "data/" + levelData.filename;
    this.levelData = levelData;
    this.levelState = {
      diamonds: 0,
      silverDiamond: 0,
      time: Infinity,
    };
    this.game.time.advancedTiming = true;
    this.game.sound.mute = !this.game.settings.fx;
  }

  create() {
    this.game.load.tilemap("map", this.levelPath, null, Tilemap.TILED_JSON);
    this.game.load.onLoadComplete.addOnce(this.baseLoadComplete, this);
    this.game.load.start();
  }

  baseLoadComplete() {
    setTimeout(() => {
      this.mapData = this.parseMapPropper();
      const prefix = "./assets/atlasses/Temples/" + this.game.currentTemple.id;
      this.game.load.atlasJSONArray(
        "TempleAssets",
        prefix + "/TempleAssets.png",
        prefix + "/TempleAssets.json",
      );
      this.preloadAudioFiles();
      this.game.load.onLoadComplete.addOnce(this.loadComplete, this);
      this.game.load.start();
    });
  }

  preloadAudioFiles() {
    if (!this.levelData || !this.mapData) return;
    let levelMusic;
    let finishMusic;
    let overMusic;
    if (this.levelData.type === "dark") {
      levelMusic = "levelMusic_dark";
      overMusic = "levelMusicOver";
      finishMusic = "levelMusicFinish";
    } else if (this.levelData.type === "speed") {
      levelMusic = "levelMusic_speed";
      overMusic = "levelMusicOver";
      finishMusic = "levelMusicFinish_speed";
    } else {
      levelMusic = "levelMusic";
      overMusic = "levelMusicOver";
      finishMusic = "levelMusicFinish";
    }
    const music = {
      levelMusic: levelMusic,
      levelMusicOver: overMusic,
      levelMusicFinish: finishMusic,
    };
    this.soundIds = [
      "levelMusic",
      "levelMusicOver",
      "levelMusicFinish",
      "charToggle1",
      "charToggle2",
      "endPass",
      "endFail",
      "endDiamond",
      "jump_fb",
      "jump_wg",
      "waterSteps",
      "iceSteps_fb",
      "iceSteps_wg",
      "death",
      "diamond",
      "door",
      "freeze",
      "melt",
    ];
    for (const object of this.mapData.objects.Objects) {
      const device = MechManager.className(
        object.type as keyof typeof MechManager.classNames,
      );
      if (device == null) {
        console.warn("Object type " + object.type + " not found!");
        continue;
      }
      const deviceSounds = device.sounds() || [];
      if (!Array.isArray(deviceSounds)) {
        this.soundIds = [...this.soundIds, deviceSounds as keyof Sounds];
      } else {
        this.soundIds = [
          ...this.soundIds,
          ...(deviceSounds as (keyof Sounds)[]),
        ];
      }
    }
    this.soundIds = _.uniq(this.soundIds);
    for (const sound of this.soundIds) {
      const soundId = music[sound as "levelMusic"] || sound;
      const SoundId = soundId.charAt(0).toUpperCase() + soundId.slice(1);
      this.game.load.audio(sound, "./assets/audio/" + SoundId + ".mp3");
    }
  }

  decodeAudio(onComplete: () => void) {
    const sounds: Sounds = {};
    for (const soundId of this.soundIds!) {
      sounds[soundId] = this.game.add.audio(soundId);
    }
    this.sounds = sounds;
    this.game.sound.setDecodedCallback(
      Object.values(sounds),
      () => {
        if (this.game.settings.music && this.sounds?.levelMusic) {
          this.sounds.levelMusic.loop = true;
          return this.sounds.levelMusic.play();
        }
      },
      this,
    );
    return onComplete();
  }

  shutdown() {
    this.pers1?.destroy(true);
    this.pers2?.destroy(true);
    this.door1?.destroy(true);
    this.door2?.destroy(true);
    this.camManager?.destroy();
    if (this.darknessBmd != null) {
      this.darkness?.events.onRemovedFromGroup.add(() => {
        this.darknessBmd?.destroy();
      });
    }
    this.objects?.forEach((object) => {
      return object.destroy(true);
    });
    Object.values(this.game.layers).forEach((layer) => {
      layer.update = () => {};
    });
    this.game.settingsSignal.remove(this.onSettingChange);
    if (this.cursorToggle != null && this.pers1 && this.pers2) {
      this.game.TouchManager.unregister(this.pers1.bodySprite, "tap");
      this.game.TouchManager.unregister(this.pers2.bodySprite, "tap");
    }
    if (this.navies != null) {
      for (const navie of this.navies) {
        navie.destroy(true);
      }
    }
  }

  killAll() {
    if (!this.game) return;
    this.game.physics.box2d.paused = true;
    this.game.paused = true;
    this.ui?.clock.destroy(true);
    this.ui?.destroy(true);
    Object.values(this.sounds ?? {}).forEach((sound) => sound.destroy());
  }

  parseMapPropper() {
    const mapData = this.game.cache.getTilemapData("map").data as MapData;
    const ground = [];
    const objects = [];
    for (const tileset of mapData.tilesets) {
      if (tileset.source == null) continue;
      tileset.src = tileset.source;
      const sourceName = tileset.src.split("/").pop()!.replace(".json", "");
      delete tileset.source;
      if (sourceName === "Ground") {
        ground.push(tileset);
      } else {
        objects.push(tileset);
      }
    }
    mapData.tilesets = ground;
    for (const tileset of mapData.tilesets) {
      if (tileset.src == null) continue;
      const type = tileset.src.split("/").pop()!.replace(".json", "");
      if (type !== "Ground") continue;
      Object.assign(tileset, this.game.cache.getJSON(type));
    }
    const parsedData = TilemapParser.parseTiledJSON(mapData) as ParsedMapData;
    mapData.tilesets = ground.concat(objects);
    for (const tileset of mapData.tilesets) {
      if (tileset.src == null) continue;
      const type = tileset.src.split("/").pop()!.replace(".json", "");
      if (type === "Ground") continue;
      parsedData.tilesets.push(
        Object.assign(tileset, this.game.cache.getJSON(type)),
      );
    }
    const getProperties = () => {
      const props: Record<number, { type: string; properties?: {} }> = {};
      for (const tileset of parsedData.tilesets) {
        if (tileset.tiles != null) {
          for (const key in tileset.tiles) {
            const properties = tileset?.tileproperties?.[key];
            props[Number(tileset.firstgid) + Number(key)] = {
              type: tileset.tiles[key].type,
              properties: properties,
            };
          }
        }
      }
      return props;
    };
    const properties = getProperties();
    const addProperties = (
      objects:
        | ParsedMapData["objects"]["Objects"]
        | ParsedMapData["objects"]["Chars"],
    ) => {
      for (const obj of objects) {
        if (obj.gid != null && properties[Number(obj.gid)] != null) {
          if (obj.type === "") {
            // @ts-ignore
            delete obj.type;
          }
          deepObjectExtend(obj, properties[Number(obj.gid)]);
        }
      }
    };
    addProperties(parsedData.objects.Objects);
    addProperties(parsedData.objects.Chars);
    return parsedData;
  }

  setupTutorial() {
    let font;
    const mapData = this.game.cache.getTilemapData("map").data as MapData;
    const tutorialLayer =
      _.findWhere(mapData.layers, {
        name: "Tutorial_" + this.game.settings.controls,
      }) ||
      _.findWhere(mapData.layers, {
        name: "Tutorial",
      });
    if (!tutorialLayer) return;
    const texts: Record<
      number,
      {
        texts: Required<MapData["layers"][number]>["objects"];
        rects: Rectangle[];
      }
    > = {};
    for (const obj of tutorialLayer.objects ?? []) {
      if (obj.properties?.id == null) continue;
      texts[obj.properties.id] ||= {
        texts: [],
        rects: [],
      };
      if (obj.text != null) {
        texts[obj.properties.id].texts.push(obj);
      } else {
        texts[obj.properties.id].rects.push(
          new Rectangle(obj.x, obj.y, obj.width, obj.height),
        );
      }
    }
    this.tutorialTexts = [];
    for (const text of Object.values(texts)) {
      console.log("text object", text);
      for (const obj of text.texts) {
        const textString = this.game.lang.locale(
          obj.text?.text as TranslationString,
        );
        let fontSize = 18;
        let x = obj.x;
        if (obj.text?.text === "tutorial_forest37_suffix") {
          font = this.game.lang.default_font;
          if (this.game.lang.getLanguage() === "ru") {
            fontSize = 12;
            x += 50;
          }
        } else {
          font = this.game.lang.font;
        }
        const bmpText = this.game.make.bitmapText(
          x,
          obj.y,
          font,
          textString,
          fontSize,
          obj.text?.halign,
        ) as BitmapText & { rects: Rectangle[] };
        bmpText.maxWidth = obj.width;
        bmpText.cacheAsBitmap = true;
        bmpText.visible = false;
        bmpText.rects = text.rects;
        this.game.layers.tutorial.addChild(bmpText);
        this.tutorialTexts.push(bmpText);
      }
    }
  }

  loadComplete() {
    if (!this.mapData) return;
    this.loadCompleted = true;
    this.game.clearBeforeRender = false;
    this.game.level = this;
    this.setupLayers();
    if (this.game.config.enableDebug) {
      window.addEventListener("keydown", (ev) => {
        if (ev.keyCode === 81) {
          this.debug = !this.debug;
        }
      });
    }
    this.showfps = this.game.config.showFps;
    this.game.MechManager = new MechManager(this.game);
    this.game.physics.startSystem(Physics.BOX2D);
    this.game.physics.box2d.setPTMRatio(32);
    this.game.physics.setBoundsToWorld = () => {};
    this.ground = new Ground(this.game, this.mapData, {});
    this.size = {
      width: this.ground.options.width,
      height: this.ground.options.height,
    };
    this.game.physics.box2d.gravity.y = 1000;
    this.objects = this.createObjects(this.mapData.objects.Objects);
    this.createCharObjects(this.mapData.objects.Chars);
    const walls = Object.values(this.game.physics.box2d.walls);
    for (const wall of walls) {
      wall.setBodyContactCallback(
        this.pers1,
        () => {
          console.log("char1 is dead");
          this.pers1?.kill();
        },
        this,
      );
      wall.setBodyContactCallback(
        this.pers2,
        () => {
          console.log("char2 is dead");
          this.pers2?.kill();
        },
        this,
      );
    }
    if (this.useDust) {
      this.navies = [];
      for (const pos of this.ground.getNaviesPoints()) {
        const navies = new Navies(
          this.game,
          pos.x,
          pos.y,
          Math.floor(1 + Math.random() * 3),
        );
        navies.scale.set(0.3 + Math.random() * 0.7);
        this.game.layers.overGround.addChild(navies);
        this.navies.push(navies);
      }
    }
    if (
      this.useDust &&
      this.objects.some((object) => object instanceof Beamer)
    ) {
      this.fillDustLayer();
    }
    this.ground.decorate(this.objects);
    this.setupDarkness();
    this.setupTutorial();
    this.pauseMenu = new PauseMenu(this.game, this);
    this.pauseKey = this.game.input.keyboard.addKey(Keyboard.P);
    this.pauseKey.onDown.add(this.togglePause);
    this.ui = new LevelUI(this.game, this);
    this.camManager = new CameraManager(this);
    if (this.root) this.root.alpha = 0;
    requestAnimationFrame(() => {
      this.game.stage.backgroundColor = 0;
      this.onReady.dispatch();
      if (this.root) this.root.alpha = 1;
      this.game.layers.ui.alpha = 1;
      this.ui?.show();
      this.cursorToggle?.init();
    });
    this.game.physics.box2d.useElapsedTime = true;
    this.game.physics.box2d.paused = true;
    this.game.physics.box2d.update = function () {
      if (this.paused) return;
      this.world.Step(Math.min(0.04, this.game.time.elapsed / 1000), {
        positionIterations: this.positionIterations,
        velocityIterations: this.velocityIterations,
        particleIterations: this.particleIterations,
      });
    };
    this.decodeAudio(() => {
      console.log("load completed");
      this.startLevel();
    });
  }

  layoutContent() {
    if (this.ui != null) {
      this.ui.layoutContent();
    }
    if (this.pauseMenu != null) {
      this.pauseMenu.layoutContent();
    }
    if (this.cursorToggle != null) {
      this.cursorToggle.layoutContent();
    }
    this.pers1?.cursors?.layoutContent();
    this.pers2?.cursors?.layoutContent();
  }

  start() {}

  startLevel() {
    this.game.time.advancedTiming = true;
    setTimeout(() => {
      if (this.game.time.suggestedFps < 40) {
        this.useDust = false;
        this.navies?.forEach((fairy) => fairy.destroy());
        this.game.layers.dust.destroy();
      }
    }, 3000);
    this.levelStarted = true;
    this.game.MechManager.resetStates();
    this.game.physics.box2d.paused = false;
    this.game.forceSingleUpdate = false;
    for (let i = 0; i <= 3; ++i) {
      this.game.updateLogic(this.game.time.desiredFpsMult);
    }
    this.game.updateRender(
      this.game.time.slowMotion * this.game.time.desiredFps,
    );
    this.game.forceSingleUpdate = true;
    this.game.physics.box2d.paused = true;
    console.log("start timer, and whatever");
    setTimeout(() => {
      if (this.camManager) this.camManager.camFreeze = false;
      setTimeout(() => {
        this.restartKey = this.game.input.keyboard.addKey(Keyboard.R);
        this.restartKey.onDown.add(this.retry);
        if (this.game.physics.box2d != null) {
          this.ui?.clock.start();
          this.game.physics.box2d.paused = false;
        }
      }, 400);
    }, 1600);
  }

  togglePause() {
    if (!this.root) return;
    this.game.paused = !this.game.paused;
    if (this.game.paused) {
      this.pauseMenu?.show();
      this.ui?.clock.pause();
    } else {
      this.root.alpha = 1;
      this.pauseMenu?.hide();
      this.ui?.clock.resume();
    }
  }

  pauseUpdate() {
    if (this.loadCompleted) {
      this.pauseMenu?.update();
      this.pauseMenu?.settingsMenu?.update();
      this.game.tweens.update();
      this.camManager?.update();
    }
  }

  setupLayers() {
    const layers = {} as Game["layers"];
    this.root = this.game.make.group(0);
    const createLayer = <K extends keyof Game["layers"]>(key: K) => {
      layers[key] = this.game.make.group() as Required<Game["layers"]>[K];
      layers[key].name = key;
      this.root?.addChild(layers[key]);
    };
    createLayer("background");
    createLayer("tutorial");
    createLayer("underGround");
    createLayer("lights");
    createLayer("ground");
    createLayer("overGround");
    createLayer("chars");
    createLayer("overChars");
    createLayer("decorations");
    createLayer("liquids");
    layers.liquids.update = function () {
      this.children.forEach((liquid) => liquid.update());
    };
    this.game.add.existing(this.root);
    layers.ui = this.game.make.group() as Game["layers"]["ui"];
    layers.ui.alpha = 0;
    this.game.add.existing(layers.ui);
    layers.ui.update = function () {
      this.children.forEach((ui) => ui.update());
    };
    layers.dust = this.game.make.group() as Game["layers"]["dust"];
    layers.dust.sources = [];
    this.root.addChild(layers.dust);
    this.game.layers = layers;
  }

  setupDarkness() {
    if (
      this.levelData?.type != null &&
      this.levelData.type === "dark" &&
      this.size
    ) {
      this.darknessBmd = this.game.add.bitmapData(
        this.size.width + 64,
        this.size.height + 64,
      ) as BitmapData & { offset: { x: number; y: number } };
      this.darknessBmd.offset = {
        x: 32,
        y: 32,
      };
      this.darkness = this.game.make.sprite(-32, -32, this.darknessBmd);
      this.darkness.blendMode = Phaser.blendModes.MULTIPLY;
      this.game.layers.darkGradients = this.game.make.group(0);
      this.root?.addChild(this.game.layers.darkGradients);
      this.root?.addChild(this.darkness);
      this.updateDarkness(this.darknessBmd);
      this.game.layers.darkGradients.update = () => {
        if (this.game.physics != null && this.darknessBmd) {
          this.updateDarkness(this.darknessBmd);
        }
      };
    }
  }

  updateDarkness(bmd: BitmapData & { offset: { x: number; y: number } }) {
    if (!this.size) return;
    bmd.ctx.globalCompositeOperation = "source-over";
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, this.size.width + 64, this.size.height + 64);
    bmd.ctx.fillStyle = "#000000";
    bmd.ctx.fill();
    this.pers1?.drawDarkMask(bmd);
    this.pers2?.drawDarkMask(bmd);
    for (const object of this.objects ?? []) {
      if ("drawDarkMask" in object) object.drawDarkMask?.(bmd);
    }
    bmd.dirty = true;
  }

  fillDustLayer() {
    if (!this.size) return;
    const width = Math.ceil(this.size.width / 20);
    for (let i = 0; i <= width; ++i) {
      const dust = this.game.make.sprite(
        Math.random() * this.size.width,
        Math.random() * this.size.height,
        "GroundAssets",
        "BeamDust0000",
      );
      dust.rotation = Math.random() * 180;
      this.game.layers.dust.add(dust);
    }
    this.game.layers.dust.maskGraphics = this.game.make.graphics(0, 0);
    this.root?.addChild(this.game.layers.dust.maskGraphics);
    this.game.layers.dust.mask = this.game.layers.dust.maskGraphics;
  }

  createObjects(objects: ParsedMapData["objects"]["Objects"]) {
    const devices = [];
    for (const options of objects) {
      console.log("create", options.name, options.type);
      const device = MechManager.className(
        options.type as keyof typeof MechManager.classNames,
      );
      if (device != null) {
        devices.push(new device(this.game, options as any));
      } else {
        console.warn("Object type " + options.type + " not found!");
      }
    }
    this.game.MechManager.connectPortals();
    return devices;
  }

  createCharObjects(objects: ParsedMapData["objects"]["Chars"]) {
    this.totalDiamonds = 0;
    for (const object of objects) {
      console.log("found char object", object.type);
      if (object.type === "char") {
        if (object.properties == null || object.properties.char === "fb") {
          this.pers1 = new Character(this.game, object.x, object.y, "fb");
          this.pers1.signal.add(this.checkEndGame);
        } else if (object.properties.char === "wg") {
          this.pers2 = new Character(this.game, object.x, object.y, "wg");
          this.pers2.signal.add(this.checkEndGame);
        }
      }
      if (object.type === "door") {
        if (object.properties == null || object.properties.char === "fb") {
          this.door1 = new Door(this.game, object.x, object.y, "fb");
          this.door1.signal.add(this.checkEndGame);
        } else if (object.properties.char === "wg") {
          this.door2 = new Door(this.game, object.x, object.y, "wg");
          this.door2.signal.add(this.checkEndGame);
        }
      }
      if (object.type === "diamond") {
        new Diamond(this.game, object.x, object.y, object.properties.char);
        if (object.properties.char !== "silver") {
          this.totalDiamonds++;
        }
      }
    }
    this.setupCursorToggle();
    return this.game.settingsSignal.add(this.onSettingChange);
  }

  onSettingChange(setting: "controls" | "fx" | "music") {
    if (setting === "controls") {
      if (this.cursorToggle != null) {
        this.cursorToggle.destroy();
        this.cursorToggle = null;
      }
      return this.setupCursorToggle();
    }
  }

  setupCursorToggle() {
    if (
      this.game.settings.controls !== "single" ||
      !this.pers1 ||
      !this.pers2
    ) {
      return;
    }
    this.game.TouchManager.register(this.pers1.bodySprite, "tap", (ev) => {
      return this.cursorToggle?.setChar("fb", ev);
    });
    this.game.TouchManager.register(this.pers2.bodySprite, "tap", (ev) => {
      return this.cursorToggle?.setChar("wg", ev);
    });
    this.cursorToggle = new CursorToggle(this.game);
    this.game.layers.ui.addChild(this.cursorToggle);
    return this.cursorToggle.onChange.add((char: Characters) => {
      if (char === "fb") {
        this.pers1?.cursors.show();
        this.pers2?.cursors.hide();
      } else {
        this.pers1?.cursors.hide();
        this.pers2?.cursors.show();
      }
    });
  }

  updateMusic() {
    this.sounds?.levelMusic?.stop();
    if (this.game.settings.music) {
      this.sounds?.levelMusic?.play();
    }
  }

  checkEndGame() {
    if (this.ended) return;
    if (this.door1?.isUp && this.door2?.isUp) {
      this.ended = true;
      this.game.physics.box2d.paused = true;
      this.animateFinish();
    }
    if (this.pers1?.isDead || this.pers2?.isDead) {
      this.ended = true;
      this.game.physics.box2d.paused = true;
      this.gameOver();
    }
  }

  animateFinish() {
    this.game.level.sounds?.levelMusic?.stop();
    this.game.level.sounds?.levelMusicFinish?.play();
    if (this.door1) this.pers1?.animateStairs(this.door1);
    if (this.door2) this.pers2?.animateStairs(this.door2);
    return setTimeout(this.gameFinish, 1600);
  }

  gameFinish() {
    this.levelState ??= {
      diamonds: 0,
      silverDiamond: 0,
      time: Infinity,
    };
    this.levelState.diamonds =
      (this.pers1?.data.diamonds ?? 0) + (this.pers2?.data.diamonds ?? 0);
    this.levelState.silverDiamond =
      (this.pers1?.data.silverDiamond ?? 0) +
      (this.pers2?.data.silverDiamond ?? 0);
    this.levelState.time = this.ui?.clock.getElapsedSeconds() ?? Infinity;
    this.ui?.clock.stop();
    if (this.levelData) this.levelData.totalDiamonds = this.totalDiamonds ?? 0;
    this.game.state.add("endGame", End);
    return this.game.state.start("endGame", false, false, {
      success: true,
      data: this.levelData,
      state: this.levelState,
      retry: this.retry,
    });
  }

  update() {
    if (!this.loadCompleted) {
      return;
    }
    if (this.showfps) {
      const fps = document.querySelector<HTMLDivElement>("#debug-fps");
      if (fps) fps.innerText = this.game.time.fps + "";
    }
    if (this.debug) {
      this.game.debug.box2dWorld();
    }
    this.ui?.update();
    if (this.useDust) {
      this.updateDust();
    }
    if (this.tutorialTexts != null) {
      this.updateTutorial();
    }
    this.camManager?.update();
  }

  updateTutorial() {
    if (!this.pers1 || !this.pers2) return;
    for (const tutorialText of this.tutorialTexts ?? []) {
      let detectedByRect = false;
      for (const rect of tutorialText.rects) {
        if (
          rect.contains(this.pers1.sprite.x, this.pers1.sprite.y) ||
          rect.contains(this.pers2.sprite.x, this.pers2.sprite.y)
        ) {
          detectedByRect = true;
        }
      }
      if (detectedByRect && !tutorialText.shown) {
        tutorialText.visible = true;
        tutorialText.shown = true;
        tutorialText.alpha = 0;
        this.game.add.tween(tutorialText).to(
          {
            alpha: 1,
          },
          400,
          "Linear",
          true,
        );
      }
      if (!detectedByRect && tutorialText.shown) {
        tutorialText.shown = false;
        tutorialText.alpha = 1;
        const animation = this.game.add.tween(tutorialText).to(
          {
            alpha: 0,
          },
          400,
          "Linear",
          true,
        );
        animation.onComplete.add((text: BitmapText) => {
          text.visible = false;
        });
      }
    }
  }

  updateDust() {
    if (
      this.game.layers.dust == null ||
      this.game.layers.dust.sources.length <= 0
    ) {
      return;
    }
    const dirty = this.game.layers.dust.sources.some((source) => source.dirty);
    if (dirty) {
      this.game.layers.dust.maskGraphics.clear();
      this.game.layers.dust.maskGraphics.lineStyle(40, 0, 1);
      let hidden = true;
      for (const source of this.game.layers.dust.sources) {
        if (source.points != null && source.points.length > 0) {
          hidden = false;
          source.drawBeam(this.game.layers.dust.maskGraphics, source.points);
        }
      }
      this.game.layers.dust.visible = !hidden;
    }
    let i = 0;
    for (const dust of this.game.layers.dust.children) {
      dust.angle += ((i++ % 2) * 2 - 1) * 0.002;
      dust.anchor.set(Math.sin(dust.angle), Math.cos(dust.angle));
    }
  }

  retry() {
    this.game.level.sounds?.levelMusic?.stop();
    this.game.state.add("level", Level);
    this.game.state.fade("level", true, false, this.levelData);
    this.killAll();
  }

  gameOver() {
    this.ui?.clock.stop();
    this.game.state.add("endGame", End);
    this.game.state.start("endGame", false, false, {
      success: false,
      data: this.levelData,
      state: this.levelState,
      retry: this.retry,
    });
  }

  quit() {
    this.game.level.sounds?.levelMusic?.stop();
    this.game.state.fade("levelMenu", true, false, this.game.currentTemple);
    this.killAll();
  }
}

export default Level;

export type MapData = {
  height: number;
  infinite: boolean;
  layers: {
    data?: number[];
    height?: number;
    name: string;
    opacity: number;
    type: string;
    visible: boolean;
    width?: number;
    x: number;
    y: number;
    draworder?: string;
    objects?: {
      height: number;
      id: number;
      name: string;
      properties?: {
        dx?: number;
        dy?: number;
        group?: number;
        id?: number;
      };
      propertytypes?: {
        dx?: string;
        dy?: string;
        group?: string;
        id?: string;
      };
      rotation: number;
      type: string;
      visible: boolean;
      width: number;
      x: number;
      y: number;
      text?: {
        bold: boolean;
        fontfamily: string;
        halign: string;
        pixelsize: number;
        text: string;
        wrap: boolean;
      };
      gid?: number;
    }[];
  }[];
  nextobjectid: number;
  orientation: string;
  renderorder: string;
  tiledversion: string;
  tileheight: number;
  tilesets: {
    firstgid: number;
    source?: string;
    src?: string;
  }[];
  tilewidth: number;
  type: string;
  version: number;
  width: number;
};

export interface ParsedMapData {
  width: number;
  height: number;
  tileWidth: number;
  tileHeight: number;
  orientation: string;
  format: number;
  version: number;
  widthInPixels: number;
  heightInPixels: number;
  layers: Layer[];
  images: unknown[];
  tilesets: ParsedTileset[];
  imagecollections: unknown[];
  objects: {
    Chars: {
      gid: number;
      name: string;
      type: string;
      x: number;
      y: number;
      visible: boolean;
      properties?: any;
    }[];
    Objects: {
      gid?: number;
      name: string;
      type: string;
      x: number;
      y: number;
      visible: boolean;
      properties?: {
        dx?: number;
        dy?: number;
        group: number;
      };
      width?: number;
      height?: number;
      rotation?: number;
      rectangle?: boolean;
    }[];
  } & {
    [key: string]: {
      name: string;
      type: string;
      x: number;
      y: number;
      width: number;
      height: number;
      visible: boolean;
      rotation: number;
      properties: {
        id: number;
      };
      rectangle: boolean;
    };
  };
  collision: {
    Tutorial_dual: unknown[];
    Tutorial_single: unknown[];
    Tutorial_keyboard: unknown[];
    Chars: unknown[];
    Objects: unknown[];
  };
  tiles: number[] | undefined[];
}

export interface Layer {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  widthInPixels: number;
  heightInPixels: number;
  alpha: number;
  visible: boolean;
  properties: {};
  indexes: unknown[];
  callbacks: unknown[];
  bodies: unknown[];
  data: ParsedTile[][];
}

export interface ParsedTile {
  layer: Layer;
  index: number;
  x: number;
  y: number;
  rotation: number;
  flipped: boolean;
  worldX: number;
  worldY: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  alpha: number;
  properties: {
    type?: number;
  };
  scanned: boolean;
  faceTop: boolean;
  faceBottom: boolean;
  faceLeft: boolean;
  faceRight: boolean;
  collideLeft: boolean;
  collideRight: boolean;
  collideUp: boolean;
  collideDown: boolean;
  collisionCallback: unknown;
  collisionCallbackContext: string;
  occupied?: boolean;
}

export interface ParsedTileset {
  name: string;
  firstgid: number;
  tileWidth?: number;
  tileHeight?: number;
  tileMargin?: number;
  tileSpacing?: number;
  properties?: {};
  image?: string;
  rows?: number;
  columns: number;
  total?: number;
  drawCoords?: number[];
  tileProperties?: {
    [key: number]: {
      type: number;
    };
  };
  src?: string;
  imageheight?: number;
  imagewidth?: number;
  margin?: number;
  spacing?: number;
  tilecount?: number;
  tileheight?: number;
  tileproperties?: {
    [key: number]: {
      group?: number;
      char?: string;
      onis?: number;
      startPos?: number;
      dir?: number;
      color?: string;
      time: number;
      length: number;
    };
  };
  tilepropertytypes?: {
    [key: number]: {
      onis?: string;
      startPos?: string;
      dir?: string;
      color?: string;
      time?: string;
      group?: string;
      length?: string;
      char?: string;
    };
  };
  tiles?: {
    [key: number]: {
      type: string;
    };
  };
  tilewidth?: number;
  type?: string;
}
