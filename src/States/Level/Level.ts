import { State } from "@azerion/phaser";

import Navies from "../Common/Navies";
import End from "../End";
import CameraManager from "./CameraManager";
import Character from "./character";
import CursorToggle from "./CursorToggle";
import Ground from "./Ground";
import LevelUI from "./LevelUI";
import MechManager from "./MechManager";
import PauseMenu from "./PauseMenu";

class Level extends State {
  useDust = true;
  game: Game;
  root: Group;
  size: { width: number; height: number };
  pers1: Character;
  pers2: Character;
  debug: boolean;
  ended: boolean;
  sounds: Sounds;

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
    this.onReady = new Phaser.Signal();
  }

  init(a) {
    this.levelPath = "data/" + a.filename;
    this.levelData = a;
    this.levelState = {
      diamonds: {
        red: 0,
        blue: 0,
        silver: 0,
      },
      time: Infinity,
    };
    this.game.time.advancedTiming = true;
    return (this.game.sound.mute = !this.game.settings.fx);
  }

  create() {
    this.game.load.tilemap(
      "map",
      this.levelPath,
      null,
      Phaser.Tilemap.TILED_JSON,
    );
    this.game.load.onLoadComplete.addOnce(this.baseLoadComplete, this);
    this.game.load.start();
  }

  baseLoadComplete() {
    _.defer(
      (function (a) {
        return function () {
          var b;
          a.mapData = a.parseMapPropper();
          b = "./assets/atlasses/Temples/" + a.game.currentTemple.id;
          a.game.load.atlasJSONArray(
            "TempleAssets",
            b + "/TempleAssets.png",
            b + "/TempleAssets.json",
          );
          a.preloadAudioFiles();
          a.game.load.onLoadComplete.addOnce(a.loadComplete, a);
          return a.game.load.start();
        };
      })(this),
    );
  }

  preloadAudioFiles() {
    var a;
    var b;
    var c;
    var d;
    var e;
    var f;
    var g;
    var h;
    var i;
    var k;
    var l;
    var m;
    var n;
    var o;
    var p;
    var q;
    if (this.levelData.type === "dark") {
      h = "levelMusic_dark";
      k = "levelMusicOver";
      i = "levelMusicFinish";
    } else if (this.levelData.type === "speed") {
      h = "levelMusic_speed";
      k = "levelMusicOver";
      i = "levelMusicFinish_speed";
    } else {
      h = "levelMusic";
      k = "levelMusicOver";
      i = "levelMusicFinish";
    }
    q = {
      levelMusic: h,
      levelMusicOver: k,
      levelMusicFinish: i,
    };
    this.sounds = [];
    this.sounds = this.sounds.concat([
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
    ]);
    m = this.mapData.objects.Objects;
    d = 0;
    f = m.length;
    for (; d < f; d++) {
      l = m[d];
      a = MechManager.className(l.type);
      if (a != null) {
        b = (a.prototype.sounds != null && a.prototype.sounds()) || [];
        if (!Array.isArray(b)) {
          [b];
        }
        this.sounds = this.sounds.concat(b);
      } else {
        console.warn("Object type " + l.type + " not found!");
      }
    }
    this.sounds = _.uniq(this.sounds);
    n = this.sounds;
    o = [];
    e = 0;
    g = n.length;
    for (; e < g; e++) {
      p = n[e];
      c = (q[p] || p).charAt(0).toUpperCase() + (q[p] || p).slice(1);
      o.push(this.game.load.audio(p, "./assets/audio/" + c + ".mp3"));
    }
    return o;
  }

  decodeAudio(a) {
    var b;
    var c;
    var d;
    var e;
    var f;
    f = {};
    d = this.sounds;
    b = 0;
    c = d.length;
    for (; b < c; b++) {
      e = d[b];
      f[e] = this.game.add.audio(e);
    }
    this.sounds = f;
    this.game.sound.setDecodedCallback(
      _.map(this.sounds),
      (function (a) {
        return function () {
          if (a.game.settings.music) {
            a.sounds.levelMusic.loop = true;
            return a.sounds.levelMusic.play();
          }
        };
      })(this),
      this,
    );
    return a();
  }

  shutdown() {
    var a;
    var b;
    var c;
    var d;
    var e;
    this.pers1.destroy(true);
    this.pers2.destroy(true);
    this.door1.destroy(true);
    this.door2.destroy(true);
    this.camManager.destroy();
    if (this.darknessBmd != null) {
      this.darkness.events.onRemovedFromGroup.add(
        (function (a) {
          return function () {
            return a.darknessBmd.destroy();
          };
        })(this),
      );
    }
    _.each(this.objects, function (a) {
      return a.destroy(true);
    });
    _.each(this.game.layers, function (a) {
      return (a.update = (function (a) {
        return function () {};
      })());
    });
    this.game.settingsSignal.remove(this.onSettingChange);
    if (this.cursorToggle != null) {
      this.game.TouchManager.unregister(this.pers1.bodySprite, "tap");
      this.game.TouchManager.unregister(this.pers2.bodySprite, "tap");
    }
    if (this.navies != null) {
      d = this.navies;
      e = [];
      a = 0;
      b = d.length;
      for (; a < b; a++) {
        c = d[a];
        e.push(c.destroy(true));
      }
      return e;
    }
  }

  killAll() {
    if (this.game != null) {
      this.game.physics.box2d.paused = true;
      this.game.paused = true;
      this.ui.clock.destroy(true);
      this.ui.destroy(true);
      return _.each(
        this.sounds,
        (function (a) {
          return function (a) {
            return a.destroy();
          };
        })(),
      );
    }
  }

  parseMapPropper() {
    var a;
    var b;
    var c;
    var d;
    var e;
    var f;
    var g;
    var h;
    var i;
    var j;
    var k;
    var l;
    var m;
    var n;
    var o;
    var p;
    var q;
    var r;
    g = this.game.cache.getTilemapData("map").data;
    a = [];
    i = [];
    l = g.tilesets;
    b = 0;
    d = l.length;
    for (; b < d; b++) {
      p = l[b];
      if (p.source != null) {
        p.src = p.source;
        h = p.src.split("/").pop().replace(".json", "");
        delete p.source;
        if (h === "Ground") {
          a.push(p);
        } else {
          i.push(p);
        }
      }
    }
    g.tilesets = a;
    m = g.tilesets;
    c = 0;
    e = m.length;
    for (; c < e; c++) {
      p = m[c];
      if (
        p.src != null &&
        (h = p.src.split("/").pop().replace(".json", "")) === "Ground"
      ) {
        _.extend(p, this.game.cache.getJSON(h));
      }
    }
    q = Phaser.TilemapParser.parseTiledJSON(g);
    g.tilesets = a.concat(i);
    n = g.tilesets;
    k = 0;
    f = n.length;
    for (; k < f; k++) {
      p = n[k];
      if (
        p.src != null &&
        (h = p.src.split("/").pop().replace(".json", "")) !== "Ground"
      ) {
        q.tilesets.push(_.extend(p, this.game.cache.getJSON(h)));
      }
    }
    j = (function (a) {
      return function () {
        var a;
        var b;
        var c;
        var d;
        var e;
        var f;
        var g;
        g = {};
        e = q.tilesets;
        d = 0;
        b = e.length;
        for (; d < b; d++) {
          f = e[d];
          if (f.tiles != null) {
            for (a in f.tiles) {
              c = f.tileproperties[a];
              g[+f.firstgid + +a] = {
                type: f.tiles[a].type,
                properties: c,
              };
            }
          }
        }
        return g;
      };
    })();
    r = j();
    o = (function (a) {
      return function (a) {
        var b;
        var c;
        var d;
        var e;
        e = [];
        d = 0;
        b = a.length;
        for (; d < b; d++) {
          c = a[d];
          if (c.gid != null && r[+c.gid] != null) {
            if (c.type === "") {
              delete c.type;
            }
            e.push(_.deepObjectExtend(c, r[+c.gid]));
          } else {
            e.push(undefined);
          }
        }
        return e;
      };
    })();
    o(q.objects.Objects);
    o(q.objects.Chars);
    return q;
  }

  setupTutorial() {
    var c;
    var d;
    var e;
    var f;
    var g;
    var h;
    var j;
    var k;
    var l;
    var m;
    var n;
    var o;
    var p;
    var q;
    var r;
    var s;
    h = this.game.cache.getTilemapData("map").data;
    if (
      (s =
        _.findWhere(h.layers, {
          name: "Tutorial_" + this.game.settings.controls,
        }) ||
        _.findWhere(h.layers, {
          name: "Tutorial",
        })) != null
    ) {
      q = {};
      l = s.objects;
      e = 0;
      g = l.length;
      for (; e < g; e++) {
        j = l[e];
        q[j.properties.id] ||= {};
        if (j.text != null) {
          q[j.properties.id].texts ||= [];
          q[j.properties.id].texts.push(j);
        } else {
          q[j.properties.id].rects ||= [];
          q[j.properties.id].rects.push(
            new Phaser.Rectangle(j.x, j.y, j.width, j.height),
          );
        }
      }
      this.tutorialTexts = [];
      m = [];
      for (f in q) {
        o = q[f];
        console.log("text object", o);
        m.push(
          function () {
            var a;
            var b;
            var e;
            var f;
            e = o.texts;
            f = [];
            a = 0;
            b = e.length;
            for (; a < b; a++) {
              n = e[a];
              r = this.game.lang.locale(n.text.text);
              c = 18;
              k = n.x;
              if (n.text.text === "tutorial_forest37_suffix") {
                d = this.game.lang.default_font;
                if (this.game.lang.getLanguage() === "ru") {
                  c = 12;
                  k += 50;
                }
              } else {
                d = this.game.lang.font;
              }
              p = this.game.make.bitmapText(k, n.y, d, r, c, n.text.halign);
              p.maxWidth = n.width;
              p.cacheAsBitmap = true;
              p.visible = false;
              p.rects = o.rects;
              this.game.layers.tutorial.addChild(p);
              f.push(this.tutorialTexts.push(p));
            }
            return f;
          }.call(this),
        );
      }
      return m;
    }
  }

  loadComplete() {
    var a;
    var b;
    var c;
    var e;
    var f;
    var g;
    var m;
    var n;
    var o;
    var p;
    this.loadCompleted = true;
    this.game.clearBeforeRender = false;
    this.game.level = this;
    this.setupLayers();
    if (this.game.config.enableDebug) {
      window.addEventListener(
        "keydown",
        (function (a) {
          return function (b) {
            if (b.keyCode === 81) {
              return (a.debug = !a.debug);
            }
          };
        })(this),
      );
    }
    this.showfps = this.game.config.showFps;
    this.game.MechManager = new MechManager(this.game);
    this.game.physics.startSystem(Phaser.Physics.BOX2D);
    this.game.physics.box2d.setPTMRatio(32);
    this.game.physics.setBoundsToWorld = (function (a) {
      return function () {};
    })();
    a = new Ground(this.game, this.mapData);
    this.ground = a;
    this.size = {
      width: a.options.width,
      height: a.options.height,
    };
    this.game.physics.box2d.gravity.y = 1000;
    this.objects = this.createObjects(this.map, this.mapData.objects.Objects);
    this.createCharObjects(this.map, this.mapData.objects.Chars);
    o = _.values(this.game.physics.box2d.walls);
    b = 0;
    e = o.length;
    for (; b < e; b++) {
      p = o[b];
      p.setBodyContactCallback(
        this.pers1,
        (function (a) {
          return function (b, c, d, e, f, g) {
            console.log("char1 is dead");
            return a.pers1.kill();
          };
        })(this),
        this,
      );
      p.setBodyContactCallback(
        this.pers2,
        (function (a) {
          return function (b, c, d, e, f, g) {
            console.log("char2 is dead");
            return a.pers2.kill();
          };
        })(this),
        this,
      );
    }
    if (this.useDust) {
      n = a.getNaviesPoints();
      this.navies = [];
      c = 0;
      f = n.length;
      for (; c < f; c++) {
        m = n[c];
        g = new Navies(this.game, m.x, m.y, Math.floor(1 + Math.random() * 3));
        g.scale.set(0.3 + Math.random() * 0.7);
        this.game.layers.overGround.addChild(g);
        this.navies.push(g);
      }
    }
    if (
      this.useDust &&
      _.find(this.objects, function (a) {
        return a.options.type === "beamer";
      }) != null
    ) {
      this.fillDustLayer();
    }
    a.decorate(this.objects);
    this.setupDarkness();
    this.setupTutorial();
    this.pauseMenu = new PauseMenu(this.game, this);
    this.pauseKey = this.game.input.keyboard.addKey(Phaser.Keyboard.P);
    this.pauseKey.onDown.add(this.togglePause);
    this.ui = new LevelUI(this.game, this);
    this.camManager = new CameraManager(this);
    this.root.alpha = 0;
    requestAnimationFrame(
      (function (a) {
        return function () {
          a.game.stage.backgroundColor = 0;
          a.onReady.dispatch();
          a.root.alpha = 1;
          a.game.layers.ui.alpha = 1;
          a.ui.show();
          if (a.cursorToggle != null) {
            return a.cursorToggle.init();
          }
        };
      })(this),
    );
    this.game.physics.box2d.useElapsedTime = true;
    this.game.physics.box2d.paused = true;
    this.game.physics.box2d.update = function () {
      var a;
      if (!this.paused) {
        a = Math.min(0.04, this.game.time.elapsed / 1000);
        return this.world.Step(
          a,
          this.velocityIterations,
          this.positionIterations,
        );
      }
    };
    this.decodeAudio(
      (function (a) {
        return function () {
          console.log("load completed");
          return a.startLevel();
        };
      })(this),
    );
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
    if (this.pers1 != null && this.pers1.cursors.layoutContent != null) {
      this.pers1.cursors.layoutContent();
    }
    if (this.pers2 != null && this.pers2.cursors.layoutContent != null) {
      return this.pers2.cursors.layoutContent();
    }
  }

  start() {}

  startLevel() {
    var a;
    this.game.time.addvancedTiming = true;
    _.delay(
      (function (a) {
        return function () {
          if (a.game.time.suggestedFps < 40) {
            a.useDust = false;
            _.each(a.navies, function (a) {
              return a.destroy();
            });
            return a.game.layers.dust.destroy();
          }
        };
      })(this),
      3000,
    );
    this.levelStarted = true;
    this.game.MechManager.resetStates();
    this.game.physics.box2d.paused = false;
    this.game.forceSingleUpdate = false;
    a = 0;
    for (; a <= 3; ++a) {
      this.game.updateLogic(this.game.time.desiredFpsMult);
    }
    this.game.updateRender(
      this.game.time.slowMotion * this.game.time.desiredFps,
    );
    this.game.forceSingleUpdate = true;
    this.game.physics.box2d.paused = true;
    console.log("start timer, and whatever");
    return _.delay(
      (function (a) {
        return function () {
          a.camManager.camFreeze = false;
          return _.delay(function () {
            a.restartKey = a.game.input.keyboard.addKey(Phaser.Keyboard.R);
            a.restartKey.onDown.add(a.retry);
            if (a.game.physics.box2d != null) {
              a.ui.clock.start();
              return (a.game.physics.box2d.paused = false);
            }
          }, 400);
        };
      })(this),
      1600,
    );
  }

  togglePause() {
    this.game.paused = !this.game.paused;
    if (this.game.paused) {
      this.root.alpha.cacheAsBitmap = true;
      this.pauseMenu.show();
      return this.ui.clock.pause();
    } else {
      this.root.alpha.cacheAsBitmap = false;
      this.root.alpha = 1;
      this.pauseMenu.hide();
      return this.ui.clock.resume();
    }
  }

  pauseUpdate() {
    if (this.loadCompleted) {
      this.pauseMenu.update();
      if (this.pauseMenu.settingsMenu != null) {
        this.pauseMenu.settingsMenu.update();
      }
      this.game.tweens.update();
      return this.camManager.update();
    }
  }

  setupLayers() {
    var a;
    var layers;
    layers = {};
    this.root = this.game.make.group(0, 0);
    a = (function (a) {
      return function (key) {
        layers[key] = a.game.make.group();
        layers[key].name = key;
        return a.root.addChild(layers[key]);
      };
    })(this);
    a("background");
    a("tutorial");
    a("underGround");
    a("lights");
    a("ground");
    a("overGround");
    a("chars");
    a("overChars");
    a("decorations");
    a("liquids");
    layers.liquids.update = function () {
      return _.each(this.children, function (a) {
        return a.update();
      });
    };
    this.game.add.existing(this.root);
    layers.ui = this.game.make.group();
    layers.ui.alpha = 0;
    this.game.add.existing(layers.ui);
    layers.ui.update = function () {
      return _.each(this.children, function (a) {
        return a.update();
      });
    };
    layers.dust = this.game.make.group();
    layers.dust.sources = [];
    this.root.addChild(layers.dust);
    return (this.game.layers = layers);
  }

  setupDarkness() {
    var a;
    var b;
    if (this.levelData.type != null && this.levelData.type === "dark") {
      this.darknessBmd = a = this.game.add.bitmapData(
        this.size.width + 64,
        this.size.height + 64,
      );
      a.offset = {
        x: 32,
        y: 32,
      };
      this.darkness = b = this.game.make.sprite(-32, -32, a);
      b.blendMode = Phaser.blendModes.MULTIPLY;
      this.game.layers.darkGradients = this.game.make.group(0, 0);
      this.root.addChild(this.game.layers.darkGradients);
      this.root.addChild(b);
      this.updateDarkness(a);
      return (this.game.layers.darkGradients.update = (function (b) {
        return function () {
          if (b.game.physics != null) {
            return b.updateDarkness(a);
          }
        };
      })(this));
    }
  }

  updateDarkness(a) {
    var b;
    var c;
    var d;
    var e;
    a.ctx.globalCompositeOperation = "source-over";
    a.ctx.beginPath();
    a.ctx.rect(0, 0, this.size.width + 64, this.size.height + 64);
    a.ctx.fillStyle = "#000000";
    a.ctx.fill();
    this.pers1.drawDarkMask(a);
    this.pers2.drawDarkMask(a);
    e = this.objects;
    b = 0;
    c = e.length;
    for (; b < c; b++) {
      d = e[b];
      if (d.drawDarkMask != null) {
        d.drawDarkMask(a);
      }
    }
    return (a.dirty = true);
  }

  fillDustLayer() {
    var a;
    var b;
    var c;
    var d;
    d = this.game.layers.dust;
    a = 0;
    b = Math.ceil(this.size.width / 20);
    for (; b >= 0 ? a <= b : a >= b; b >= 0 ? ++a : --a) {
      c = this.game.make.sprite(
        Math.random() * this.size.width,
        Math.random() * this.size.height,
        "GroundAssets",
        "BeamDust0000",
      );
      c.rotation = Math.random() * 180;
      d.add(c);
    }
    d.maskGraphics = this.game.make.graphics(0, 0);
    this.root.addChild(d.maskGraphics);
    d.mask = d.maskGraphics;
    return d;
  }

  createObjects(a, b) {
    var c;
    var d;
    var e;
    var f;
    var g;
    var h;
    e = [];
    f = 0;
    g = b.length;
    for (; f < g; f++) {
      h = b[f];
      console.log("create", h.name, h.type);
      c = MechManager.className(h.type);
      if (c != null) {
        d = new c(this.game, h);
        e.push(d);
      } else {
        console.warn("Object type " + h.type + " not found!");
      }
    }
    this.game.MechManager.connectPortals();
    return e;
  }

  createCharObjects(a, b) {
    var c;
    var d;
    var f;
    this.totalDiamonds = 0;
    c = 0;
    d = b.length;
    for (; c < d; c++) {
      f = b[c];
      console.log("found char object", f.type);
      if (f.type === "char") {
        if (f.properties == null || f.properties.char === "fb") {
          this.pers1 = new Character(this.game, f.x, f.y, "fb");
          this.pers1.signal.add(this.checkEndGame);
        } else if (f.properties.char === "wg") {
          this.pers2 = new Character(this.game, f.x, f.y, "wg");
          this.pers2.signal.add(this.checkEndGame);
        }
      }
      if (f.type === "door") {
        if (f.properties == null || f.properties.char === "fb") {
          this.door1 = new Devices.Door(this.game, f.x, f.y, "fb");
          this.door1.signal.add(this.checkEndGame);
        } else if (f.properties.char === "wg") {
          this.door2 = new Devices.Door(this.game, f.x, f.y, "wg");
          this.door2.signal.add(this.checkEndGame);
        }
      }
      if (f.type === "diamond") {
        new Devices.Diamond(this.game, f.x, f.y, f.properties.char);
        if (f.properties.char !== "silver") {
          this.totalDiamonds++;
        }
      }
    }
    this.setupCursorToggle();
    return this.game.settingsSignal.add(this.onSettingChange);
  }

  onSettingChange(a) {
    if (a === "controls") {
      if (this.cursorToggle != null) {
        this.cursorToggle.destroy();
        this.cursorToggle = null;
      }
      return this.setupCursorToggle();
    }
  }

  setupCursorToggle() {
    if (this.game.settings.controls === "single") {
      this.game.TouchManager.register(
        this.pers1.bodySprite,
        "tap",
        (function (a) {
          return function (b) {
            return a.cursorToggle.setChar("fb", b);
          };
        })(this),
      );
      this.game.TouchManager.register(
        this.pers2.bodySprite,
        "tap",
        (function (a) {
          return function (b) {
            return a.cursorToggle.setChar("wg", b);
          };
        })(this),
      );
      this.cursorToggle = new CursorToggle(this.game);
      this.game.layers.ui.addChild(this.cursorToggle);
      return this.cursorToggle.onChange.add(
        (function (a) {
          return function (b) {
            if (b === "fb") {
              a.pers1.cursors.show();
              return a.pers2.cursors.hide();
            } else {
              a.pers1.cursors.hide();
              return a.pers2.cursors.show();
            }
          };
        })(this),
      );
    }
  }

  updateMusic() {
    if (this.sounds.levelMusic != null) {
      this.sounds.levelMusic.stop();
    }
    if (this.game.settings.music) {
      return this.sounds.levelMusic.play();
    }
  }

  checkEndGame() {
    if (!this.ended) {
      if (this.door1.isUp && this.door2.isUp) {
        this.ended = true;
        this.game.physics.box2d.paused = true;
        this.animateFinish();
      }
      if (this.pers1.isDead || this.pers2.isDead) {
        this.ended = true;
        this.game.physics.box2d.paused = true;
        return this.gameOver();
      } else {
        return undefined;
      }
    }
  }

  animateFinish() {
    this.game.level.sounds.levelMusic.stop();
    this.game.level.sounds.levelMusicFinish.play();
    this.pers1.animateStairs(this.door1);
    this.pers2.animateStairs(this.door2);
    return _.delay(
      (function (a) {
        return function () {
          return a.gameFinish();
        };
      })(this),
      1600,
    );
  }

  gameFinish() {
    this.levelState.diamonds =
      this.pers1.data.diamonds + this.pers2.data.diamonds;
    this.levelState.silverDiamond =
      this.pers1.data.silverDiamond + this.pers2.data.silverDiamond;
    this.levelState.time = this.ui.clock.getElapsedSeconds();
    this.ui.clock.stop();
    this.levelData.totalDiamonds = this.totalDiamonds;
    this.game.state.add("endGame", End);
    return this.game.state.start("endGame", false, false, {
      success: true,
      data: this.levelData,
      state: this.levelState,
      retry: this.retry,
    });
  }

  update() {
    if (this.loadCompleted) {
      if (this.showfps) {
        $("#debug-fps").html(this.game.time.fps);
      }
      if (this.debug) {
        this.game.debug.box2dWorld();
      }
      this.ui.update();
      if (this.useDust) {
        this.updateDust();
      }
      if (this.tutorialTexts != null) {
        this.updateTutorial();
      }
      return this.camManager.update();
    }
  }

  updateTutorial() {
    var a;
    var b;
    var c;
    var d;
    var e;
    var f;
    var g;
    var h;
    var i;
    var j;
    var k;
    f = this.tutorialTexts;
    h = [];
    a = 0;
    c = f.length;
    for (; a < c; a++) {
      j = f[a];
      k = false;
      g = j.rects;
      b = 0;
      d = g.length;
      for (; b < d; b++) {
        e = g[b];
        if (
          e.contains(this.pers1.sprite.x, this.pers1.sprite.y) ||
          e.contains(this.pers2.sprite.x, this.pers2.sprite.y)
        ) {
          k = true;
        }
      }
      if (k && !j.shown) {
        j.visible = true;
        j.shown = true;
        j.alpha = 0;
        this.game.add.tween(j).to(
          {
            alpha: 1,
          },
          400,
          "Linear",
          true,
        );
      }
      if (!k && j.shown) {
        j.shown = false;
        j.alpha = 1;
        i = this.game.add.tween(j).to(
          {
            alpha: 0,
          },
          400,
          "Linear",
          true,
        );
        h.push(
          i.onComplete.add(
            (function (a) {
              return function (a) {
                return (a.visible = false);
              };
            })(),
          ),
        );
      } else {
        h.push(undefined);
      }
    }
    return h;
  }

  updateDust() {
    var a;
    var b;
    var c;
    var d;
    var e;
    var f;
    var g;
    var h;
    var i;
    var j;
    var k;
    var l;
    var m;
    var n;
    var o;
    if (
      this.game.layers.dust != null &&
      this.game.layers.dust.sources.length > 0
    ) {
      i = false;
      j = this.game.layers.dust.sources;
      c = 0;
      e = j.length;
      for (; c < e; c++) {
        o = j[c];
        if (o.dirty) {
          i = true;
        }
      }
      if (i) {
        this.game.layers.dust.maskGraphics.clear();
        this.game.layers.dust.maskGraphics.lineStyle(40, 0, 1);
        a = true;
        k = this.game.layers.dust.sources;
        d = 0;
        f = k.length;
        for (; d < f; d++) {
          o = k[d];
          if (o.points != null && o.points.length > 0) {
            a = false;
            o.drawBeam(this.game.layers.dust.maskGraphics, o.points);
          }
        }
        this.game.layers.dust.visible = !a;
      }
      l = this.game.layers.dust.children;
      m = [];
      b = h = 0;
      g = l.length;
      for (; h < g; b = ++h) {
        n = l[b];
        n.angle += ((b % 2) * 2 - 1) * 0.002;
        m.push(n.anchor.set(Math.sin(n.angle), Math.cos(n.angle)));
      }
      return m;
    }
  }

  retry() {
    this.game.level.sounds.levelMusic.stop();
    this.game.state.add("level", Level);
    this.game.state.fade("level", true, false, this.levelData);
    return this.killAll();
  }

  gameOver() {
    this.ui.clock.stop();
    this.game.state.add("endGame", End);
    return this.game.state.start("endGame", false, false, {
      success: false,
      data: this.levelData,
      state: this.levelState,
      retry: this.retry,
    });
  }

  quit() {
    this.game.level.sounds.levelMusic.stop();
    this.game.state.fade("levelMenu", true, false, this.game.currentTemple);
    return this.killAll();
  }
}

export default Level;
