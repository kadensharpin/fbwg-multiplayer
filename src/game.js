var version = 1;
var gameConfig = {
  id: "forest",
  type: "legacy",
  assets: "forest",
  temples: "forest",
  title: "Fireboy & Watergirl Forest Temple",
};

const hasOwnProperty = {}.hasOwnProperty;
function extend(SubClass, SuperClass) {
  function superClass() {
    this.constructor = SubClass;
  }
  for (const field in SuperClass) {
    if (SuperClass.hasOwnProperty(field)) SubClass[field] = SuperClass[field];
  }
  return (
    (superClass.prototype = SuperClass.prototype),
    (SubClass.prototype = new superClass()),
    (SubClass.__super__ = SuperClass.prototype),
    SubClass
  );
}
((function () {
  define("States/Level/Devices/BackgroundCover", ["Phaser"], function (Phaser) {
    function BackgroundCover(a, b) {
      (BackgroundCover.__super__.constructor.call(
        this,
        a,
        b.x,
        b.y,
        "MechAssets",
        "BackgroundCover0000",
      ),
        (this.options = b),
        (this.width = b.width),
        (this.height = b.height),
        a.layers.background.addChild(this));
    }
    extend(BackgroundCover, Phaser.Sprite);
    return BackgroundCover;
  });
}).call(this),
  function () {
    define("States/Level/Devices/Device", ["Phaser"], function () {
      "use strict";
      function Device(b, c) {
        ((this.sounds = this.sounds.bind(this)),
          (this.ocupy = this.ocupy.bind(this)),
          (this.ocupyTile = this.ocupyTile.bind(this)),
          (this.checkState = this.checkState.bind(this)),
          (this.updateState = this.updateState.bind(this)),
          (this._updateState = this._updateState.bind(this)),
          (this.updateLight = this.updateLight.bind(this)),
          (this.setupLight = this.setupLight.bind(this)),
          (this.getColor = this.getColor.bind(this)),
          (this.registerDevice = this.registerDevice.bind(this)),
          (this.pxm = this.pxm.bind(this)),
          (this.mpx = this.mpx.bind(this)));
        var e, f, g, h, i;
        ((this.lights = []),
          (g = {}),
          _.deepObjectExtend(g, this._defaults),
          c.properties || (c.properties = {}),
          _.deepObjectExtend(g, c),
          _.deepObjectExtend(g, this.options),
          (this.options = g),
          null == this.options.layer && (this.options.layer = "overGround"),
          (e = this.options).rotation || (e.rotation = 0),
          (this.options.rotation = (Math.PI * this.options.rotation) / 180),
          (this.options.width = b.physics.box2d.pxm(this.options.width)),
          (this.options.height = b.physics.box2d.pxm(this.options.height)),
          (h = this.options.x),
          (i = this.options.y),
          (this.state =
            null != this.options.properties
              ? +this.options.properties.initialState || 0
              : 0),
          Device.__super__.constructor.call(this, b),
          null != this.options.atlasName &&
            null != this.options.frameName &&
            ((this.sprite = this.game.make.resSprite(
              h,
              i,
              this.options.atlasName,
              this.options.frameName,
            )),
            this.game.layers[this.options.layer].addChild(this.sprite),
            this.sprite.anchor.set(0.5)),
          null != this.sprite && (this.sprite.autoCull = true),
          this.sprite &&
            true === this.options.enableBody &&
            (this.game.physics.box2d.enable(this.sprite),
            this.sprite.body.clearFixtures(),
            this.sprite.body.data.SetAngle((Math.PI * c.rotation) / 180 || 0),
            (this.body = this.sprite.body)),
          null != this.options.lightAtlas &&
            null != this.options.lightFrame &&
            ((f = this.create(
              0,
              0,
              this.options.lightAtlas,
              this.options.lightFrame + "_on0000",
            )),
            null != this.sprite && this.sprite.addChild(f),
            f.anchor.set(0.5),
            (f.offFrameName = this.options.lightFrame + "_off0000"),
            (f.onFrameName = this.options.lightFrame + "_on0000"),
            (f.frameName = f.offFrameName),
            this.lights.push(f)),
          _.defer(
            (function (a) {
              return function () {
                return a.updateLight(a.state);
              };
            })(this),
          ));
      }
      extend(Device, Phaser.Group);
      Device.prototype._defaults = {
        atlasName: null,
        frameName: null,
        lightAtlas: null,
        lightFrame: null,
      };
      Device.prototype.mpx = function (a) {
        return this.game.physics.box2d.mpx(-1 * a);
      };
      Device.prototype.pxm = function (a) {
        return this.game.physics.box2d.pxm(-1 * a);
      };
      Device.prototype.registerDevice = function () {
        if (
          (this.game.MechManager.registerDevice(this), this.lights.length > 0)
        )
          return this.setupLight();
      };
      Device.prototype.getColor = function () {
        var a;
        return (
          (a = Number(String(this.options.properties.group)[0])),
          Device.groupColors[a] || "#ffffff"
        );
      };
      Device.prototype.setupLight = function () {
        var a, b, c, d, e;
        for (e = this.lights, b = 0, d = e.length; b < d; b++)
          ((c = e[b]),
            (a = this.getColor()),
            (c.offTint = Phaser.Color.hexToColor(a).color),
            (c.onTint = Phaser.Color.hexToColor(a).color),
            (c.tint = c.offTint));
      };
      Device.prototype.updateLight = function (a) {
        var b, c, d, e, f;
        if (0 !== this.lights.length) {
          for (e = this.lights, f = [], b = 0, d = e.length; b < d; b++)
            ((c = e[b]),
              null != c.onFrameName && a
                ? ((c.frameName = c.onFrameName), f.push((c.tint = c.onTint)))
                : null == c.offFrameName || a
                  ? f.push(void 0)
                  : ((c.frameName = c.offFrameName),
                    f.push((c.tint = c.offTint))));
          return f;
        }
      };
      Device.prototype.update = function () {
        return this.checkState();
      };
      Device.prototype._updateState = function () {
        return (this.updateLight(this.state), this.updateState());
      };
      Device.prototype.updateState = function () {};
      Device.prototype.checkState = function () {};
      Device.prototype.ocupyTile = function (a, b, c) {
        if (null != a[Math.floor(c)] && null != a[Math.floor(c)][Math.floor(b)])
          return (a[Math.floor(c)][Math.floor(b)].ocupied = true);
      };
      Device.prototype.ocupy = function (a, b) {
        return false;
      };
      Device.prototype.sounds = function () {
        return [];
      };
      Device.groupColors = {
        1: "#ff0000",
        2: "#00cc00",
        3: "#0D3EFF",
        4: "#ffff00",
        5: "#EC0EF1",
        6: "#57beff",
        7: "#9933FF",
      };
      return Device;
    });
  }.call(this),
  function () {
    define("States/Level/Devices/BoxedDevice", ["./Device"], function (Device) {
      "use strict";
      function BoxedDevice(b, c) {
        this.ocupy = this.ocupy.bind(this);
        var e;
        ((this._defaults.enableBody = true),
          (e = new box2d.b2Vec2(
            b.physics.box2d.mpx(this.boxSize.x / 2),
            b.physics.box2d.mpx(this.boxSize.y / 2),
          )),
          (e = e.SelfRotateRadians((-Math.PI * c.rotation) / 180 || 0)),
          (c.x = c.x + e.x),
          (c.y = c.y - e.y),
          BoxedDevice.__super__.constructor.call(this, b, c));
      }
      extend(BoxedDevice, Device);
      BoxedDevice.prototype.boxSize = { x: 2, y: 2 };
      BoxedDevice.prototype.ocupy = function (a) {
        var b, c;
        return (
          (b = this.options.x / 32),
          (c = this.options.y / 32),
          this.ocupyTile(a, b, c),
          this.ocupyTile(a, b - 1, c - 1),
          this.ocupyTile(a, b - 1, c),
          this.ocupyTile(a, b, c - 1)
        );
      };
      return BoxedDevice;
    });
  }.call(this),
  function () {
    define("States/Level/Devices/Ball", ["./BoxedDevice"], function (
      BoxedDevice,
    ) {
      "use strict";
      function Ball(a, b) {
        var d, e, f, g;
        return (
          (b.x -= a.physics.box2d.mpx(0.5)),
          (b.y += a.physics.box2d.mpx(0.65)),
          Ball.__super__.constructor.call(this, a, b),
          (g = new box2d.b2CircleShape(this.radius)),
          (f = new box2d.b2FixtureDef()),
          (f.shape = g),
          (f.friction = 0.2),
          (f.restitution = 0.1),
          (f.density = 2.3),
          (f.filter.categoryBits = 17),
          (e = this.body.data.CreateFixture(f)),
          (e.id = this.body.world.getNextFixtureId()),
          null != this.options.properties &&
            null != this.options.properties.linearDamping &&
            this.body.data.SetLinearDamping(
              this.options.properties.linearDamping,
            ),
          null != this.options.properties &&
            null != this.options.properties.angularDamping &&
            this.body.data.SetAngularDamping(
              this.options.properties.angularDamping,
            ),
          (d = new box2d.b2CircleShape(0.1)),
          d.m_p.SetXY(0, 0),
          (f = new box2d.b2FixtureDef()),
          (f.shape = d),
          (f.filter.categoryBits = 4096),
          (f.filter.maskBits = 4096),
          (f.friction = 0.5),
          (f.density = 0),
          (f.userData = { "portal-sensor": true }),
          (e = this.body.data.CreateFixture(f)),
          (e.id = this.body.world.getNextFixtureId()),
          this
        );
      }
      extend(Ball, BoxedDevice);
      Ball.prototype.options = {
        boxWidth: 1.8,
        boxHeight: 1.8,
        atlasName: "MechAssets",
        frameName: "ball0000",
      };
      Ball.prototype.radius = 0.4;
      return Ball;
    });
  }.call(this),
  function () {
    define("States/Level/Devices/Beamer", ["./BoxedDevice"], function (
      BoxedDevice,
    ) {
      "use strict";
      function Beamer(b, c) {
        ((this.drawDarkMask = this.drawDarkMask.bind(this)),
          (this.drawBeam = this.drawBeam.bind(this)),
          (this.update = this.update.bind(this)),
          (this.getColor = this.getColor.bind(this)));
        var e, f, g, h, i;
        return (
          (this.state = 1),
          Beamer.__super__.constructor.call(this, b, c),
          (this.body.mass = 0),
          (i = []),
          i.push(new box2d.b2Vec2(0, -this.options.pusherWidth / 2 - 0.6)),
          i.push(new box2d.b2Vec2(0, this.options.pusherWidth / 2 + 0.6)),
          i.push(
            new box2d.b2Vec2(
              -this.options.pusherHeight,
              this.options.pusherWidth / 2,
            ),
          ),
          i.push(
            new box2d.b2Vec2(
              -this.options.pusherHeight,
              -this.options.pusherWidth / 2,
            ),
          ),
          (h = new box2d.b2PolygonShape()),
          h.Set(i),
          (f = new box2d.b2FixtureDef()),
          (f.shape = h),
          (f.friction = 0.7),
          (f.restitution = 0),
          (f.density = 0),
          (f.filter.categoryBits = 1),
          (f.filter.maskBits = 65535),
          (e = this.body.data.CreateFixture(f)),
          (e.id = this.body.world.getNextFixtureId()),
          (g = this.game.make.sprite(
            0,
            0,
            "MechAssets",
            "beamer_light_off0000",
          )),
          g.anchor.set(0.5),
          this.sprite.addChild(g),
          (g.offFrameName = "beamer_light_off0000"),
          (g.onFrameName = "beamer_light_on0000"),
          this.lights.push(g),
          this.registerDevice(),
          (this.graphics = this.game.make.graphics(0, 0)),
          this.game.layers.lights.addChild(this.graphics),
          this.game.layers.dust.sources.push(this),
          (this.graphicsColor = Phaser.Color.hexToColor(this.getColor()).color),
          this
        );
      }
      extend(Beamer, BoxedDevice);
      Beamer.prototype.options = {
        pusherWidth: 0.8,
        pusherHeight: 0.4,
        atlasName: "MechAssets",
        frameName: "beamer0000",
        layer: "overGround",
      };
      Beamer.prototype.getColor = function () {
        switch (this.options.properties.color) {
          case "blue":
            return "#AAEAFF";
          case "red":
            return "#FF4D00";
          default:
            return "#ffff88";
        }
      };
      Beamer.prototype.update = function () {
        var a, b, c, d, e, f, g, h, i, j, k, l;
        if (((this.dirty = false), 1 !== this.state))
          return (
            null !== this.points && (this.dirty = true),
            (this.points = null),
            this.graphics.clear()
          );
        for (
          a = new box2d.b2RayCastCallback(),
            a.ReportFixture = function (a, b, c, d) {
              if (null == a.m_userData || null == a.m_userData.lightProperties)
                return ((this.contact = { point: b.Clone(), normal: null }), d);
              if ("transparent" !== a.m_userData.lightProperties.type)
                return "normal" === a.m_userData.lightProperties.type
                  ? ((this.contact = { point: b.Clone(), normal: null }),
                    a.m_userData.lightProperties.sensor &&
                      (this.contact.sensor = a),
                    d)
                  : "mirror" === a.m_userData.lightProperties.type
                    ? ((this.contact = {
                        point: b.Clone(),
                        normal: c.Clone(),
                      }),
                      a.m_userData.lightProperties.sensor &&
                        (this.contact.sensor = a),
                      d)
                    : "portal" === a.m_userData.lightProperties.type
                      ? 1 === a.m_userData.device.state
                        ? ((this.contact = {
                            point: a.m_userData.lightProperties.getPoint(b, c),
                            output: a.m_userData.lightProperties.getOutput,
                            skipPoint: b.Clone(),
                          }),
                          d)
                        : void 0
                      : void (
                          a.m_userData.lightProperties.sensor &&
                          (this.contact.sensor = a)
                        );
            },
            a.point = new box2d.b2Vec2(
              this.pxm(this.options.x),
              this.pxm(this.options.y),
            ),
            c = new box2d.b2Vec2(-1, 0),
            c = c.SelfRotateRadians(this.options.rotation || 0),
            a.dir = c,
            j = [],
            j.push({ point: a.point.Clone() });
          null != a.dir && j.length < 12;
        )
          ((h = a.point.Clone()),
            (i = a.point.Clone().SelfAdd(a.dir.Clone().SelfMul(50))),
            (a.contact = null),
            this.body.world.world.RayCast(a, h, i),
            null != a.contact &&
              ((a.point = a.contact.point),
              null != a.contact.sensor &&
                ((a.contact.sensor.m_userData.lightProperties.iluminated =
                  this.options.properties.color),
                (a.contact.sensor.m_userData.lightProperties.lightAt =
                  a.contact.point)),
              a.contact.skipPoint
                ? (j.push({
                    type: "line",
                    point: a.contact.skipPoint.Clone(),
                  }),
                  j.push({ type: "move", point: a.point.Clone() }))
                : j.push({ type: "line", point: a.point.Clone() }),
              null != a.contact.output
                ? (a.dir = a.contact.output(a.dir))
                : null != a.contact.normal
                  ? ((b = h.Clone().SelfSub(i).SelfNormalize()),
                    (f = a.contact.normal.Clone().SelfCrossVS(1)),
                    (a.dir = b
                      .Clone()
                      .SelfSub(f.Clone().SelfMul(2 * b.Clone().Dot(f)))))
                  : (a.dir = null)));
        if (
          ((l = [30, 10, 2]), (g = [0.05, 0.3, 1]), !_.isEqual(this.points, j))
        ) {
          for (
            this.graphics.clear(),
              this.dirty = true,
              this.points = j,
              this.graphics.blendMode = PIXI.blendModes.LIGHTEN,
              k = [],
              d = e = 1;
            e <= 2;
            d = ++e
          )
            (this.graphics.lineStyle(l[d], this.graphicsColor, g[d]),
              k.push(this.drawBeam(this.graphics, j)));
          return k;
        }
      };
      Beamer.prototype.drawBeam = function (a, b, c) {
        var d, e, f, g, h;
        for (
          null == c && (c = { x: 0, y: 0 }),
            a.moveTo(
              this.mpx(b[0].point.x) + c.x,
              this.mpx(b[0].point.y) + c.y,
            ),
            h = [],
            d = e = 0,
            f = b.length;
          e < f;
          d = ++e
        )
          ((g = b[d]),
            d > 0
              ? "line" === g.type
                ? (a.lineTo(
                    this.mpx(g.point.x) + c.x,
                    this.mpx(g.point.y) + c.y,
                  ),
                  h.push(
                    a.moveTo(
                      this.mpx(g.point.x) + c.x,
                      this.mpx(g.point.y) + c.y,
                    ),
                  ))
                : "move" === g.type
                  ? h.push(
                      a.moveTo(
                        this.mpx(g.point.x) + c.x,
                        this.mpx(g.point.y) + c.y,
                      ),
                    )
                  : h.push(void 0)
              : h.push(void 0));
        return h;
      };
      Beamer.prototype.drawDarkMask = function (a) {
        var b, c;
        if (1 === this.state && null != this.points)
          return (
            (a.ctx.globalCompositeOperation = "lighter"),
            a.ctx.beginPath(),
            (a.ctx.lineCap = "round"),
            (a.ctx.strokeStyle = "rgba(255,255,255,0.8)"),
            (a.ctx.lineWidth = 25),
            this.drawBeam(a.ctx, this.points, a.offset),
            a.ctx.stroke(),
            a.ctx.closePath(),
            (c = {
              x: this.sprite.x + a.offset.x,
              y: this.sprite.y + a.offset.y,
            }),
            (b = a.ctx.createRadialGradient(c.x, c.y, 30, c.x, c.y, 90)),
            b.addColorStop(0, "rgba(255,255,255,1)"),
            b.addColorStop(0.5, "rgba(255,255,255,0.3)"),
            b.addColorStop(1, "transparent"),
            a.circle(c.x, c.y, 90, b)
          );
      };
      return Beamer;
    });
  }.call(this),
  function () {
    define("States/Level/Devices/BoxPrototype", ["./BoxedDevice"], function (
      BoxedDevice,
    ) {
      "use strict";
      function BoxPrototype(a, b) {
        var d, e, f, g, h, i, j, k, l;
        return (
          BoxPrototype.__super__.constructor.call(this, a, b),
          null != this.options.properties.boxSize &&
            ((this.options.boxWidth = this.options.properties.boxSize),
            (this.options.boxWidth = this.options.properties.boxSize)),
          (this.sprite.cacheAsBitmap = true),
          (g = 0.1),
          (k = new box2d.b2PolygonShape()),
          (l = []),
          l.push(
            new box2d.b2Vec2(
              -this.options.boxWidth / 2 + g,
              -this.options.boxHeight / 2,
            ),
          ),
          l.push(
            new box2d.b2Vec2(
              this.options.boxWidth / 2 - g,
              -this.options.boxHeight / 2,
            ),
          ),
          l.push(
            new box2d.b2Vec2(
              this.options.boxWidth / 2,
              -this.options.boxHeight / 2 + g,
            ),
          ),
          l.push(
            new box2d.b2Vec2(
              this.options.boxWidth / 2,
              +this.options.boxHeight / 2 - g,
            ),
          ),
          l.push(
            new box2d.b2Vec2(
              this.options.boxWidth / 2 - g,
              +this.options.boxHeight / 2,
            ),
          ),
          l.push(
            new box2d.b2Vec2(
              -this.options.boxWidth / 2 + g,
              +this.options.boxHeight / 2,
            ),
          ),
          l.push(
            new box2d.b2Vec2(
              -this.options.boxWidth / 2,
              +this.options.boxHeight / 2 - g,
            ),
          ),
          l.push(
            new box2d.b2Vec2(
              -this.options.boxWidth / 2,
              -this.options.boxHeight / 2 + g,
            ),
          ),
          k.Set(l.reverse()),
          (i = new box2d.b2FixtureDef()),
          (i.shape = k),
          (i.friction =
            null != this.options.properties.friction
              ? this.options.properties.friction
              : 0.4),
          (i.restitution = 0),
          (i.density = this.options.density),
          (h = this.body.data.CreateFixture(i)),
          (h.id = this.body.world.getNextFixtureId()),
          (this.boxFixture = h),
          (j = (function (a) {
            return function (b, c) {
              var d;
              return (
                (d = new box2d.b2CircleShape(b)),
                d.m_p.SetXY(c[0], c[1]),
                (i = new box2d.b2FixtureDef()),
                (i.shape = d),
                (i.filter.categoryBits = 17),
                (i.filter.maskBits = 4097),
                (i.friction = a.options.circleFriction),
                (i.density = 0),
                (i.userData = { lightProperties: { type: "transparent" } }),
                (h = a.body.data.CreateFixture(i)),
                (h.id = a.body.world.getNextFixtureId()),
                h
              );
            };
          })(this)),
          (d = g),
          (f = this.options.boxWidth / 2 - 0.6 * g),
          j(d, [-f, -f]),
          j(d, [f, -f]),
          j(d, [-f, f]),
          j(d, [f, f]),
          (e = new box2d.b2CircleShape(0.1)),
          e.m_p.SetXY(0, 0),
          (i = new box2d.b2FixtureDef()),
          (i.shape = e),
          (i.filter.categoryBits = 4096),
          (i.filter.maskBits = 4096),
          (i.friction = 0.5),
          (i.density = 0),
          (i.userData = {
            "portal-sensor": true,
            lightProperties: { type: "transparent" },
          }),
          (h = this.body.data.CreateFixture(i)),
          (h.id = this.body.world.getNextFixtureId()),
          this.body.data.SetLinearDamping(1),
          this.body.data.SetAngularDamping(20),
          this
        );
      }
      extend(BoxPrototype, BoxedDevice);
      BoxPrototype.prototype.options = {
        boxWidth: 1.77,
        boxHeight: 1.77,
        atlasName: "MechAssets",
        frameName: "movingbox0000",
        layer: "overGround",
        density: 0.45,
        circleFriction: 0.1,
      };
      return BoxPrototype;
    });
  }.call(this),
  function () {
    define("States/Level/Devices/Box", [
      "./BoxedDevice",
      "./BoxPrototype",
    ], function (BoxedDevice, BoxPrototype) {
      "use strict";
      function Box(a, b) {
        return (Box.__super__.constructor.call(this, a, b), this);
      }
      extend(Box, BoxPrototype);
      return Box;
    });
  }.call(this),
  function () {
    define("States/Level/Devices/BoxHeavy", [
      "./BoxedDevice",
      "./BoxPrototype",
    ], function (BoxedDevice, BoxPrototype) {
      "use strict";
      function BoxHeavy(a, b) {
        return (
          (b.frameName = "movingbox20000"),
          (b.density = 0.8),
          (b.circleFriction = 0.05),
          BoxHeavy.__super__.constructor.call(this, a, b),
          this
        );
      }
      extend(BoxHeavy, BoxPrototype);
      return BoxHeavy;
    });
  }.call(this),
  function () {
    define("States/Level/Devices/BoxMirror", [
      "./BoxedDevice",
      "./BoxPrototype",
    ], function (BoxedDevice, BoxPrototype) {
      "use strict";
      function BoxMirror(a, b) {
        var d, e, f;
        return (
          (b.mirrorWidth = 2),
          (b.mirrorHeight = 0.05),
          (b.frameName = "BoxMirror0000"),
          BoxMirror.__super__.constructor.call(this, a, b),
          (this.boxFixture.m_userData = {
            lightProperties: { type: "transparent" },
          }),
          (f = new box2d.b2PolygonShape()),
          f.SetAsOrientedBox(
            this.options.mirrorWidth / 2,
            this.options.mirrorHeight / 2,
            new box2d.b2Vec2(0, 0),
            Math.PI / 4,
          ),
          (e = new box2d.b2FixtureDef()),
          (e.shape = f),
          (e.friction = 0),
          (e.restitution = 0),
          (e.density = 0),
          (e.userData = { lightProperties: { type: "mirror" } }),
          (d = this.body.data.CreateFixture(e)),
          (d.id = this.body.world.getNextFixtureId()),
          this
        );
      }
      extend(BoxMirror, BoxPrototype);
      return BoxMirror;
    });
  }.call(this),
  function () {
    define("States/Level/Devices/Diamond", ["Phaser"], function () {
      "use strict";
      function Diamond(b, c, e, f) {
        this.grabbed = this.grabbed.bind(this);
        var g, h, i;
        return (
          (c += b.physics.box2d.mpx(1)),
          (e -= b.physics.box2d.mpx(1)),
          Diamond.__super__.constructor.call(
            this,
            b,
            c,
            e,
            "CharAssets",
            "_default0000",
          ),
          this.game.physics.box2d.enable(this),
          (this.sprite = b.make.sprite(
            0,
            0,
            "CharAssets",
            "diamond_" + f + "0000",
          )),
          this.sprite.anchor.set(0.5),
          this.addChild(this.sprite),
          (this.signal = new Phaser.Signal()),
          this.body.clearFixtures(),
          (this.body.mass = 0),
          (i = new box2d.b2PolygonShape()),
          i.SetAsOrientedBox(
            this.options.width / 2,
            this.options.height / 2,
            new box2d.b2Vec2(0, 0),
            0,
          ),
          (h = new box2d.b2FixtureDef()),
          (h.shape = i),
          (h.friction = 0.7),
          (h.restitution = 0),
          (h.density = 0),
          (h.userData = "diamond-" + f),
          (h.isSensor = true),
          (h.userData = { lightProperties: { type: "transparent" } }),
          (this.data.char = f),
          (g = this.body.data.CreateFixture(h)),
          (g.id = this.body.world.getNextFixtureId()),
          this.game.layers.underGround.addChild(this),
          this.body.setFixtureContactCallback(
            g,
            (function (a) {
              return function (b, c, d, e, f, g) {
                if (
                  null != c.sprite.character &&
                  c.sprite.character.data.char &&
                  ("silver" === a.data.char ||
                    "fbwg" === a.data.char ||
                    c.sprite.character.data.char === a.data.char) &&
                  f
                )
                  return (
                    console.log("Grabbed!"),
                    a.grabbed(c.sprite.character),
                    a.signal.dispatch()
                  );
              };
            })(this),
            this,
          ),
          (this.sprite.y = -5),
          _.delay(
            (function (a) {
              return function () {
                var b;
                return (
                  (b = a.game.add
                    .tween(a.sprite)
                    .to({ y: 5 }, 2e3, Phaser.Easing.Sinusoidal.InOut, true)),
                  b.yoyo(true).loop()
                );
              };
            })(this),
            2e3 * Math.random(),
          ),
          this
        );
      }
      extend(Diamond, Phaser.Sprite);
      Diamond.prototype.options = { width: 0.7, height: 0.7 };
      Diamond.prototype.grabbed = function (a) {
        return (
          this.game.level.sounds.diamond.play(),
          "silver" === this.data.char
            ? a.data.silverDiamond++
            : a.data.diamonds++,
          this.destroy()
        );
      };
      return Diamond;
    });
  }.call(this),
  function () {
    define("States/Level/Devices/Door", ["Phaser"], function () {
      "use strict";
      function Door(b, c, e, f) {
        this.update = this.update.bind(this);
        var g, h, i, j;
        return (
          Door.__super__.constructor.call(this, b),
          (c += this.game.physics.box2d.mpx(1)),
          (this.pos = { x: c, y: e }),
          (i = "fb" === f ? "FinishBoy" : "FinishGirl"),
          (this.sprite = this.game.make.sprite(
            c,
            e + 4,
            "TempleAssets",
            i + "0000",
          )),
          this.sprite.scale.set(0.8),
          this.sprite.animations.add(
            "open",
            Phaser.Animation.generateFrameNames(i, 0, 21, "", 4),
            10,
            false,
          ),
          this.game.physics.box2d.enable(this.sprite),
          (this.body = this.sprite.body),
          (this.sprite.anchor.y = 0.99),
          this.game.layers.background.addChild(this.sprite),
          (this.signal = new Phaser.Signal()),
          this.body.clearFixtures(),
          this.body.data.SetType(box2d.b2BodyType.b2_staticBody),
          (j = new box2d.b2PolygonShape()),
          j.SetAsOrientedBox(
            this.game.physics.box2d.pxm(this.options.width / 2),
            this.game.physics.box2d.pxm(this.options.height / 2),
            new box2d.b2Vec2(0, 0),
            0,
          ),
          (h = new box2d.b2FixtureDef()),
          (h.shape = j),
          (h.friction = 0.7),
          (h.restitution = 0),
          (h.density = 0),
          (h.userData = "door-" + f),
          (h.isSensor = true),
          (this.data = { char: f }),
          (g = this.body.data.CreateFixture(h)),
          (g.id = this.body.world.getNextFixtureId()),
          this.body.setFixtureContactCallback(
            g,
            (function (a) {
              return function (b, c, d, e, f, g) {
                if (
                  null != c.sprite.character &&
                  c.sprite.character.data.char === a.data.char
                )
                  return (a.isOpen = !!f);
              };
            })(this),
            this,
          ),
          (this.currentFrac = this.sprite.animations.currentFrame.index),
          this
        );
      }
      extend(Door, Phaser.Group);
      Door.prototype.options = { width: 64, height: 8 };
      Door.prototype.update = function () {
        var a, b, c;
        return (
          (a = this.sprite.animations._outputFrames.indexOf(
            this.sprite.animations.currentFrame.index,
          )),
          (this.isUp = 21 === a),
          (b = Math.min(0.04, this.game.time.elapsed / 1e3)),
          (c = 25 * b),
          this.isOpen
            ? (a < 21 &&
                ((this.currentFrac += c),
                (this.sprite.animations.frame = Math.round(this.currentFrac)),
                (null != this.sound && this.sound.isPlaying) ||
                  (this.sound = this.game.level.sounds.door.playInstance())),
              21 === a &&
                (this.signal.dispatch(),
                null != this.sound &&
                  (this.sound.stopInstance(), (this.sound = null))))
            : this.isOpen ||
              (a > 0 &&
                ((this.currentFrac -= c),
                (this.sprite.animations.frame = Math.round(this.currentFrac)),
                (null != this.sound && this.sound.isPlaying) ||
                  (this.sound = this.game.level.sounds.door.playInstance())),
              0 === a &&
                (null != this.sound &&
                  (this.sound.stopInstance(), (this.sound = null)),
                this.signal.dispatch())),
          this.isUp
        );
      };
      return Door;
    });
  }.call(this),
  function () {
    define("States/Level/Devices/Hanging", ["./Device"], function (Device) {
      "use strict";
      function Hanging(b, c) {
        this.update = this.update.bind(this);
        var e, f, g, h, i, j, k, l, m, n, o, p, q, r;
        return (
          Hanging.__super__.constructor.call(this, b, c),
          (this.barWidth =
            this.options.properties.barWidth || this.options.barWidth),
          (this.anchor = new box2d.b2Vec2(
            this.options.polyline[0][0] + this.options.x,
            this.options.polyline[0][1] + this.options.y,
          )),
          (this.pos = {
            x: this.options.polyline[1][0] + this.options.x,
            y: this.options.polyline[1][1] + this.options.y,
          }),
          (this.rope = this.game.make.tileSprite(
            this.anchor.x,
            this.anchor.y,
            this.options.polyline[0][1] - this.options.polyline[1][1],
            20,
            "MechAssets",
            "pulley_rope0000",
          )),
          this.rope.anchor.set(0, 0.5),
          this.game.layers.underGround.addChild(this.rope),
          (this.platform = p = this.game.make.sprite(this.pos.x, this.pos.y)),
          (h = this.game.make.sprite(
            0,
            0,
            "MechAssets",
            "hanging_platform0000",
          )),
          h.anchor.set(0.5),
          (h.width = 1.15 * this.mpx(this.barWidth)),
          this.platform.addChild(h),
          (g = this.game.make.sprite(
            this.anchor.x,
            this.anchor.y,
            "MechAssets",
            "hanging_anchor0000",
          )),
          (i = this.game.make.sprite(0, 0, "MechAssets", "hanging_base0000")),
          i.anchor.set(0.5),
          this.game.physics.box2d.enable(p, false),
          this.game.physics.box2d.enable(g),
          (g.body.data.m_fixtureList.m_filter.categoryBits = 0),
          this.platform.addChild(i),
          this.game.layers.underGround.addChild(this.platform),
          this.game.layers.underGround.addChild(g),
          p.body.data.SetLinearDamping(0.4),
          p.body.data.SetAngularDamping(0.3),
          (j = this.platform.body),
          j.clearFixtures(),
          (r = []),
          (m = this.barWidth / 2),
          (n = m + 0.1),
          r.push(new box2d.b2Vec2(m, 0.12)),
          r.push(new box2d.b2Vec2(-m, 0.12)),
          r.push(new box2d.b2Vec2(-n, 0)),
          r.push(new box2d.b2Vec2(-m, -0.12)),
          r.push(new box2d.b2Vec2(m, -0.12)),
          r.push(new box2d.b2Vec2(n, 0)),
          (q = new box2d.b2PolygonShape()),
          q.Set(r),
          (l = new box2d.b2FixtureDef()),
          (l.shape = q),
          (l.friction = 0.4),
          (l.restitution = 0),
          (l.density = this.options.properties.density || 2.5),
          (l.filter.categoryBits = 65535),
          (l.filter.maskBits = 65535),
          (k = j.data.CreateFixture(l)),
          (k.id = j.world.getNextFixtureId()),
          (o = new box2d.b2DistanceJointDef()),
          (e = { x: this.pxm(this.anchor.x), y: this.pxm(this.anchor.y) }),
          (f = { x: this.pxm(this.pos.x), y: this.pxm(this.pos.y) }),
          o.Initialize(g.body.data, p.body.data, e, f),
          (this.joint = this.game.physics.box2d.world.CreateJoint(o)),
          (o = new box2d.b2RevoluteJointDef()),
          o.Initialize(g.body.data, p.body.data, f),
          (o.lowerAngle = (-0.85 * Math.PI) / 2),
          (o.upperAngle = (0.85 * Math.PI) / 2),
          this.options.properties.fullRotation || (o.enableLimit = true),
          (this.joint = this.game.physics.box2d.world.CreateJoint(o)),
          (o = new box2d.b2RevoluteJointDef()),
          o.Initialize(g.body.data, this.game.level.groundBody, e),
          (this.joint = this.game.physics.box2d.world.CreateJoint(o)),
          this
        );
      }
      extend(Hanging, Device);
      Hanging.prototype.options = { barWidth: 3.2 };
      Hanging.prototype.baseHeight = 60;
      Hanging.prototype.update = function () {
        var a, b;
        return (
          (b = new box2d.b2Vec2(
            this.platform.position.x,
            this.platform.position.y,
          )),
          (a = b.Clone().SelfSub(this.anchor)),
          (this.rope.rotation = Math.atan2(-a.y, -a.x))
        );
      };
      return Hanging;
    });
  }.call(this),
  function () {
    define("States/Level/Devices/InfiniteMirror", ["./BoxedDevice"], function (
      BoxedDevice,
    ) {
      "use strict";
      function InfiniteMirror(b, c) {
        this.updateState = this.updateState.bind(this);
        var e, f, g, h, i, j, k, l, m, n, o;
        return (
          InfiniteMirror.__super__.constructor.call(this, b, c),
          (f = this.game.make.sprite(
            this.options.x,
            this.options.y,
            "MechAssets",
            "rotmirror_circle0000",
          )),
          f.anchor.set(0.5),
          this.game.layers.underGround.addChild(f),
          (k = this.game.make.sprite(
            this.options.x,
            this.options.y,
            "MechAssets",
            "infinitemirror0000",
          )),
          k.anchor.set(0.5),
          this.game.physics.box2d.enable(k),
          (this.body = k.body),
          (l = this.game.make.sprite(
            0,
            0,
            "MechAssets",
            "infinitemirror_light_off0000",
          )),
          l.anchor.set(0.5),
          k.addChild(l),
          (l.offFrameName = "infinitemirror_light_off0000"),
          (l.onFrameName = "infinitemirror_light_off0000"),
          this.lights.push(l),
          this.game.layers.overGround.addChild(k),
          this.body.clearFixtures(),
          (o = new box2d.b2PolygonShape()),
          o.SetAsOrientedBox(
            this.options.boxWidth / 2,
            this.options.boxHeight / 2,
            new box2d.b2Vec2(0, 0),
            0,
          ),
          (m = new box2d.b2PolygonShape()),
          m.SetAsOrientedBox(
            this.options.mirrorWidth / 2,
            this.options.mirrorHeight / 2,
            new box2d.b2Vec2(0, 0),
            Math.PI / 4,
          ),
          (i = new box2d.b2FixtureDef()),
          (i.shape = m),
          (i.friction = 0.7),
          (i.restitution = 0),
          (i.density = 0.2),
          (i.userData = { lightProperties: { type: "mirror" } }),
          (h = this.body.data.CreateFixture(i)),
          (h.id = this.body.world.getNextFixtureId()),
          this.body.data.SetAngle(this.options.rotation),
          (e = new box2d.b2CircleShape(0.3)),
          (e.m_p = new box2d.b2Vec2(1.1, 1.1)),
          (i = new box2d.b2FixtureDef()),
          (i.shape = e),
          (h = this.body.data.CreateFixture(i)),
          (e = new box2d.b2CircleShape(0.3)),
          (e.m_p = new box2d.b2Vec2(-1.1, -1.1)),
          (i = new box2d.b2FixtureDef()),
          (i.shape = e),
          (h = this.body.data.CreateFixture(i)),
          (j = new box2d.b2RevoluteJointDef()),
          (n = this.body.data.GetWorldCenter()),
          (g = new box2d.b2Vec2(n.x, n.y)),
          j.Initialize(this.body.data, this.game.level.groundBody, g),
          (j.enableLimit = true),
          (j.maxMotorTorque = 500),
          (j.motorSpeed = 0),
          (j.enableMotor = true),
          (this.joint = this.game.physics.box2d.world.CreateJoint(j)),
          this.registerDevice(),
          this
        );
      }
      extend(InfiniteMirror, BoxedDevice);
      InfiniteMirror.prototype.options = {
        atlasName: null,
        frameName: null,
        lightAtlas: null,
        lightFrame: null,
        boxWidth: 1.8,
        boxHeight: 1.8,
        mirrorWidth: 3,
        mirrorHeight: 0.1,
      };
      InfiniteMirror.prototype.updateState = function () {
        return this.joint.SetLimits(this.state, this.state);
      };
      return InfiniteMirror;
    });
  }.call(this),
  function () {
    define("States/Level/Devices/Lever", ["./BoxedDevice"], function (
      BoxedDevice,
    ) {
      "use strict";
      function Lever(b, c) {
        ((this.drawDarkMask = this.drawDarkMask.bind(this)),
          (this.checkState = this.checkState.bind(this)),
          (this.sounds = this.sounds.bind(this)));
        var e, f, g, h, i, j, k, l, m, n;
        return (
          Lever.__super__.constructor.call(this, b, c),
          (m = this.game.make.resSprite(
            this.options.x,
            this.options.y,
            "MechAssets",
            "lever_stick0000",
          )),
          m.anchor.set(0.5),
          this.game.physics.box2d.enable(m),
          (this.body = m.body),
          (n = this.game.make.resSprite(
            0,
            0,
            "MechAssets",
            "lever_stick_light_off0000",
          )),
          n.anchor.set(0.5),
          m.addChild(n),
          (n.offFrameName = "lever_stick_light_off0000"),
          (n.onFrameName = "lever_stick_light_on0000"),
          this.lights.push(n),
          this.game.layers.overGround.addChild(m),
          (this.base = e =
            this.game.make.resSprite(
              this.options.x,
              this.options.y,
              "MechAssets",
              "lever_base0000",
            )),
          e.anchor.set(0.5),
          (f = this.game.make.resSprite(
            0,
            0,
            "MechAssets",
            "lever_base_light_off0000",
          )),
          f.anchor.set(0.5),
          e.addChild(f),
          (f.offFrameName = "lever_base_light_off0000"),
          (f.onFrameName = "lever_base_light_on0000"),
          this.lights.push(f),
          this.game.layers.overGround.addChild(e),
          this.body.clearFixtures(),
          (l = new box2d.b2PolygonShape()),
          l.SetAsOrientedBox(0.15, 0.7, new box2d.b2Vec2(0, 0.55), 0),
          (i = new box2d.b2FixtureDef()),
          (i.shape = l),
          (i.friction = 0.7),
          (i.restitution = 0),
          (i.density = 1.6),
          (i.filter.categoryBits = 1),
          (i.filter.maskBits = 61695),
          (h = m.body.data.CreateFixture(i)),
          (h.id = m.body.world.getNextFixtureId()),
          (j = new box2d.b2RevoluteJointDef()),
          (k = this.body.data.GetWorldCenter()),
          (g = new box2d.b2Vec2(k.x, k.y - 0.7)),
          j.Initialize(this.body.data, this.game.level.groundBody, g),
          (j.lowerAngle = -0.2 * Math.PI),
          (j.upperAngle = 0.2 * Math.PI),
          (j.enableLimit = true),
          (j.maxMotorTorque = 10),
          (j.motorSpeed = 0),
          (j.enableMotor = true),
          (this.joint = this.game.physics.box2d.world.CreateJoint(j)),
          -1 === this.options.properties.startPos
            ? this.body.data.SetAngle(this.joint.GetLowerLimit())
            : this.body.data.SetAngle(this.joint.GetUpperLimit()),
          (this.signal = new Phaser.Signal()),
          this.registerDevice(),
          this
        );
      }
      extend(Lever, BoxedDevice);
      Lever.prototype.options = { atlasName: null, frameName: null };
      Lever.prototype.sounds = function () {
        return "lever";
      };
      Lever.prototype.checkState = function () {
        return 0 === this.state &&
          this.joint.GetJointAngleRadians() * this.options.properties.onis < 0
          ? ((this.state = 1),
            this.joint.SetMotorSpeed(-4 * this.options.properties.onis),
            this.game.level.sounds.lever.play(),
            this.signal.dispatch(this))
          : 1 === this.state &&
              this.joint.GetJointAngleRadians() * this.options.properties.onis >
                0
            ? ((this.state = 0),
              this.joint.SetMotorSpeed(4 * this.options.properties.onis),
              this.game.level.sounds.lever.play(),
              this.signal.dispatch(this))
            : void 0;
      };
      Lever.prototype.drawDarkMask = function (a) {
        var b, c, d;
        if (1 === this.state)
          return (
            (a.ctx.globalCompositeOperation = "lighter"),
            (d = {
              x: this.base.x + a.offset.x,
              y: this.base.y + a.offset.y,
            }),
            (b = new box2d.b2Vec2(0, this.mpx(-1.1))),
            b.SelfRotateRadians(this.joint.GetJointAngleRadians()),
            b.SelfAdd(new box2d.b2Vec2(0, this.mpx(1.8))),
            (c = a.ctx.createRadialGradient(
              d.x + b.x,
              d.y + b.y,
              10,
              d.x + b.x,
              d.y + b.y,
              50,
            )),
            c.addColorStop(0, "rgba(255,255,255,1)"),
            c.addColorStop(0.7, "rgba(255,255,255,0.1)"),
            c.addColorStop(1, "rgba(255,255,255,0)"),
            a.circle(d.x + b.x, d.y + b.y, 60, c)
          );
      };
      return Lever;
    });
  }.call(this),
  function () {
    define("States/Level/Devices/LightPusher", ["./BoxedDevice"], function (
      BoxedDevice,
    ) {
      "use strict";
      function LightPusher(b, c) {
        ((this.checkState = this.checkState.bind(this)),
          (this.sounds = this.sounds.bind(this)));
        var e, f, g, h, i;
        return (
          LightPusher.__super__.constructor.call(this, b, c),
          (this.body.mass = 0),
          (f = new box2d.b2PolygonShape()),
          f.SetAsOrientedBox(
            this.options.sensorWidth / 2,
            this.options.pusherHeight / 2,
            new box2d.b2Vec2(0, 0),
            0,
          ),
          (e = new box2d.b2FixtureDef()),
          (e.shape = f),
          (e.friction = 0.7),
          (e.restitution = 0),
          (e.density = 0),
          (e.isSensor = true),
          (e.userData = {
            lightProperties: { type: "normal", sensor: true },
          }),
          (this.sensorFixture = g = this.body.data.CreateFixture(e)),
          (g.id = this.body.world.getNextFixtureId()),
          (i = []),
          i.push(new box2d.b2Vec2(-this.options.pusherWidth / 2 - 0.5, 0)),
          i.push(new box2d.b2Vec2(this.options.pusherWidth / 2 + 0.5, 0)),
          i.push(
            new box2d.b2Vec2(
              this.options.pusherWidth / 2,
              this.options.pusherHeight - 0.1,
            ),
          ),
          i.push(
            new box2d.b2Vec2(
              -this.options.pusherWidth / 2,
              this.options.pusherHeight - 0.1,
            ),
          ),
          (h = new box2d.b2PolygonShape()),
          h.Set(i),
          (e = new box2d.b2FixtureDef()),
          (e.shape = h),
          (e.friction = 0.7),
          (e.restitution = 0),
          (e.density = 0),
          (e.isSensor = false),
          (e.userData = { lightProperties: { type: "transparent" } }),
          this.body.data.CreateFixture(e),
          (g.id = this.body.world.getNextFixtureId()),
          (this.signal = new Phaser.Signal()),
          this.registerDevice(),
          this
        );
      }
      extend(LightPusher, BoxedDevice);
      LightPusher.prototype.options = {
        pusherWidth: 1,
        pusherHeight: 0.4,
        sensorWidth: 1.5,
        atlasName: "MechAssets",
        frameName: "lightpusher_base0000",
        lightAtlas: "MechAssets",
        lightFrame: "lightpusher_light",
      };
      LightPusher.prototype.sounds = function () {
        return "lightPusher";
      };
      LightPusher.prototype.checkState = function () {
        return (
          0 === this.state &&
          this.sensorFixture.m_userData.lightProperties.iluminated ===
            this.options.properties.color
            ? ((this.state = 1),
              this.game.level.sounds.lightPusher.play(),
              this.signal.dispatch(this))
            : 1 === this.state &&
              this.sensorFixture.m_userData.lightProperties.iluminated !==
                this.options.properties.color &&
              ((this.state = 0), this.signal.dispatch(this)),
          (this.sensorFixture.m_userData.lightProperties.iluminated = null)
        );
      };
      return LightPusher;
    });
  }.call(this),
  function () {
    define("States/Level/Devices/Liquid", ["Phaser"], function () {
      "use strict";
      function Liquid(b, c, e, f) {
        ((this.melt = this.melt.bind(this)),
          (this.freeze = this.freeze.bind(this)),
          (this.initialFreeze = this.initialFreeze.bind(this)),
          (this.shouldMelt = this.shouldMelt.bind(this)),
          (this.shouldFreeze = this.shouldFreeze.bind(this)),
          (this.update = this.update.bind(this)),
          (this.createIceGraphics = this.createIceGraphics.bind(this)),
          (this.createLiquidGraphics = this.createLiquidGraphics.bind(this)));
        var g, h, i, j, k, l;
        return (
          55 === f.type && ((f.type = 5), (f.startFrozen = true)),
          (this.options = f),
          (this.options.x = c),
          (this.options.y = e),
          Liquid.__super__.constructor.call(
            this,
            b,
            c,
            e,
            "GroundAssets",
            "_default0000",
          ),
          this.game.layers.liquids.addChild(this),
          this.game.physics.box2d.enable(this),
          this.body.clearFixtures(),
          (this.body.mass = 0),
          this.body.data.SetPosition(new box2d.b2Vec2(-c, -e)),
          (j = new box2d.b2PolygonShape()),
          (l = []),
          (k = f.width),
          (i = 1),
          l.push(new box2d.b2Vec2(0, -0.15)),
          l.push(new box2d.b2Vec2(-k, -0.15)),
          l.push(new box2d.b2Vec2(-k, -i / 2)),
          l.push(new box2d.b2Vec2(0, -i / 2)),
          j.Set(l),
          (h = new box2d.b2FixtureDef()),
          (h.shape = j),
          (h.filter.categoryBits = 1),
          (h.filter.maskBits = 61695),
          (h.friction = 0.7),
          (h.isSensor = true),
          (h.userData = {
            type: "liquid",
            liquidType: f.type,
            lightProperties: { type: "normal", sensor: true },
          }),
          (g = this.sensorFixture = this.body.data.CreateFixture(h)),
          (g.id = this.body.world.getNextFixtureId()),
          (j = new box2d.b2PolygonShape()),
          (l = []),
          (k = f.width),
          (i = 1),
          l.push(new box2d.b2Vec2(0, 0)),
          l.push(new box2d.b2Vec2(-k, 0)),
          l.push(new box2d.b2Vec2(-k, -i / 2)),
          l.push(new box2d.b2Vec2(0, -i / 2)),
          j.Set(l),
          (h = new box2d.b2FixtureDef()),
          (h.shape = j),
          (h.filter.categoryBits = 1),
          (h.filter.maskBits = 0),
          (h.friction = 0),
          (h.userData = {
            type: "ice",
            liquidType: f.type,
            lightProperties: { type: "transparent" },
          }),
          (g = this.iceFixture = this.body.data.CreateFixture(h)),
          (g.id = this.body.world.getNextFixtureId()),
          this.body.setFixtureContactCallback(
            this.iceFixture,
            (function (a) {
              return function (a, b, c, d, e, f) {
                var g;
                if (null != b.sprite.character || null != a.sprite.character)
                  return (
                    (g = b.sprite.character || a.sprite.character),
                    e
                      ? (g.snowCount || (g.snowCount = 0), (g.snowCount += 1))
                      : (g.snowCount || (g.snowCount = 0), (g.snowCount -= 1)),
                    g.setOnIce(0 !== g.snowCount)
                  );
              };
            })(),
          ),
          (j = new box2d.b2PolygonShape()),
          (l = []),
          (k = f.width),
          (i = 0.18),
          l.push(new box2d.b2Vec2(0, -i)),
          l.push(new box2d.b2Vec2(-k, -i)),
          l.push(new box2d.b2Vec2(-k, -1)),
          l.push(new box2d.b2Vec2(0, -1)),
          j.Set(l),
          (h = new box2d.b2FixtureDef()),
          (h.shape = j),
          (h.filter.categoryBits = 1),
          (h.filter.maskBits = 4369),
          (h.friction = 0.7),
          (h.isSensor = true),
          (h.userData = {
            type: "liquid_death",
            liquidType: f.type,
            lightProperties: { type: "transparent" },
          }),
          (g = this.killFixture = this.body.data.CreateFixture(h)),
          (g.id = this.body.world.getNextFixtureId()),
          (this.liquidGraphics = this.game.make.group()),
          (this.liquidGraphics.position.y = 2),
          this.createLiquidGraphics(),
          this.addChild(this.liquidGraphics),
          5 === f.type &&
            ((this.iceGraphics = this.game.make.group()),
            (this.iceGraphics.position.y = 4),
            this.createIceGraphics(),
            this.addChild(this.iceGraphics),
            (this.iceGraphics.visible = false)),
          (this.nearBodies = {}),
          (this.frozenBodies = {}),
          this.body.setFixtureContactCallback(
            this.sensorFixture,
            (function (a) {
              return function (b, c, d, e, f, g) {
                var h;
                return f || null == a.nearBodies[c.id]
                  ? f && null == a.nearBodies[c.id]
                    ? ((h = { body: c }), (a.nearBodies[c.id] = h))
                    : void 0
                  : delete a.nearBodies[c.id];
              };
            })(this),
            this,
          ),
          f.startFrozen && _.delay(this.initialFreeze, 10),
          this
        );
      }
      extend(Liquid, Phaser.Sprite);
      Liquid.prototype.createLiquidGraphics = function () {
        var a, b, c, d, e, f, g;
        if (
          (5 === this.options.type
            ? (a = "WaterBox")
            : 6 === this.options.type
              ? (a = "FireBox")
              : 7 === this.options.type && (a = "GreenBox"),
          (d = this.game.make.sprite(0, 0, "GroundAssets")),
          d.anchor.set(0.5),
          d.animations.add(
            "loop",
            Phaser.Animation.generateFrameNames(a + "Left", 0, 14, "", 4),
            30,
            true,
          ),
          this.liquidGraphics.addChild(d),
          (d.x = this.body.world.mpx(0.5)),
          (d.y = this.body.world.mpx(0.5)),
          d.animations.play("loop"),
          this.options.width > 2)
        )
          for (
            b = c = 1, f = this.options.width - 2;
            1 <= f ? c <= f : c >= f;
            b = 1 <= f ? ++c : --c
          )
            ((e = this.game.make.sprite(0, 0, "GroundAssets")),
              e.anchor.set(0.5),
              e.animations.add(
                "loop",
                Phaser.Animation.generateFrameNames(a, 0, 14, "", 4),
                30,
                true,
              ),
              this.liquidGraphics.addChild(e),
              (e.x = this.body.world.mpx(b + 0.5)),
              (e.y = this.body.world.mpx(0.5)),
              e.animations.play("loop"));
        return (
          (g = this.game.make.sprite(0, 0, "GroundAssets")),
          g.anchor.set(0.5),
          g.animations.add(
            "loop",
            Phaser.Animation.generateFrameNames(a + "Right", 0, 14, "", 4),
            30,
            true,
          ),
          this.liquidGraphics.addChild(g),
          (g.x = this.body.world.mpx(this.options.width - 0.5)),
          (g.y = this.body.world.mpx(0.5)),
          g.animations.play("loop")
        );
      };
      Liquid.prototype.createIceGraphics = function () {
        var a, b, c, d, e, f, g;
        for (
          a = "IceBox",
            d = this.game.make.sprite(0, 0, "GroundAssets", a + "Left0000"),
            d.anchor.set(0.5),
            this.iceGraphics.addChild(d),
            d.x = this.body.world.mpx(0.5),
            d.y = this.body.world.mpx(0.5),
            b = c = 1,
            f = this.options.width - 2;
          1 <= f ? c <= f : c >= f;
          b = 1 <= f ? ++c : --c
        )
          ((e = this.game.make.sprite(0, 0, "GroundAssets", a + "0000")),
            e.anchor.set(0.5),
            this.iceGraphics.addChild(e),
            (e.x = this.body.world.mpx(b + 0.5)),
            (e.y = this.body.world.mpx(0.5)));
        return (
          (g = this.game.make.sprite(0, 0, "GroundAssets", a + "Right0000")),
          g.anchor.set(0.5),
          this.iceGraphics.addChild(g),
          (g.x = this.body.world.mpx(this.options.width - 0.5)),
          (g.y = this.body.world.mpx(0.5))
        );
      };
      Liquid.prototype.update = function () {
        if (!this.game.physics.box2d.paused) {
          if (!this.ready) return void (this.ready = true);
          if (
            null != this.sensorFixture.m_userData.lightProperties.iluminated
          ) {
            if (
              "blue" ===
                this.sensorFixture.m_userData.lightProperties.iluminated &&
              5 === this.options.type
            )
              return this.shouldFreeze();
            if (
              "red" ===
                this.sensorFixture.m_userData.lightProperties.iluminated &&
              5 === this.options.type
            )
              return this.shouldMelt();
          }
        }
      };
      Liquid.prototype.shouldFreeze = function () {
        if (!this.frozen)
          return (this.freeze(), this.game.level.sounds.freeze.play());
      };
      Liquid.prototype.shouldMelt = function () {
        if (this.frozen)
          return (this.game.level.sounds.melt.play(), this.melt());
      };
      Liquid.prototype.initialFreeze = function () {
        var a, b, c;
        ((this.game.physics.box2d.paused = false),
          this.game.physics.box2d.update(),
          (this.game.physics.box2d.paused = true),
          (this.frozen = true),
          this.iceFixture.SetFilterData({ maskBits: 16, categoryBits: 1 }),
          (c = this.nearBodies));
        for (a in c)
          ((b = c[a]),
            "pers" === b.body.data.m_userData
              ? (b.body.data.SetPosition(
                  b.body.data.GetPosition().SelfAdd(new box2d.b2Vec2(0, 0.5)),
                ),
                b.body.data.SetAwake(true))
              : ((this.frozenBodies[a] = b), (b.body.static = true)));
        return (
          this.iceFixture.Refilter(),
          (this.sensorFixture.m_userData.lightProperties.type = "mirror"),
          (this.iceGraphics.visible = true),
          (this.liquidGraphics.visible = false)
        );
      };
      Liquid.prototype.freeze = function () {
        var a, b, c, d, e, f, g, h, i, j, k, l, m, n;
        ((b = 800),
          console.log("freezing"),
          (this.frozen = true),
          this.iceFixture.SetFilterData({ maskBits: 16, categoryBits: 1 }),
          (h = this.nearBodies));
        for (d in h)
          ((e = h[d]),
            "pers" === e.body.data.m_userData
              ? (e.body.data.SetPosition(
                  e.body.data.GetPosition().SelfAdd(new box2d.b2Vec2(0, 0.5)),
                ),
                e.body.data.SetAwake(true))
              : ((this.frozenBodies[d] = e), (e.body.static = true)));
        (this.iceFixture.Refilter(),
          (this.sensorFixture.m_userData.lightProperties.type = "mirror"),
          (this.iceGraphics.visible = true),
          (c = this.game.make.graphics(0, 0)),
          this.addChild(c),
          (l = this.game.physics.box2d.mpx(this.options.width)),
          c.beginFill(16777215),
          c.drawRect(-10, -10, l + 20, 52),
          (a = this.sensorFixture.m_userData.lightProperties.lightAt),
          (n = this.game.physics.box2d.mpx(-a.x - this.options.x)),
          (c.width = 0),
          (c.x = n),
          (i = this.game.add
            .tween(c)
            .to({ x: 0, width: l }, b, "Linear", true)
            .onUpdateCallback(
              (function (a) {
                return function () {
                  return a.frozen
                    ? (a.iceGraphics.mask = c)
                    : (c.visible = false);
                };
              })(this),
            )),
          (m = this.game.make.graphics(0, 0)),
          this.addChild(m),
          (m.width = l),
          (m.x = 0),
          (f = { val: l - n }),
          (i = this.game.add
            .tween(f)
            .to({ val: 0 }, b, "Linear", true)
            .onUpdateCallback(
              (function (a) {
                return function () {
                  return a.frozen
                    ? (m.clear(),
                      m.beginFill(16777215),
                      m.drawRect(l - f.val, -10, f.val, 52),
                      (a.liquidGraphics.mask = m))
                    : (m.visible = false);
                };
              })(this),
            )),
          (g = { val: n }),
          (i = this.game.add
            .tween(g)
            .to({ val: 0 }, b, "Linear", true)
            .onUpdateCallback(
              (function (a) {
                return function () {
                  return a.frozen
                    ? (m.beginFill(16777215),
                      m.drawRect(0, -10, g.val, 52),
                      (a.liquidGraphics.mask = m))
                    : (m.visible = false);
                };
              })(this),
            )),
          (j = this.game.make.sprite(0, 0, "GroundAssets", "frost0000")),
          (k = this.game.make.sprite(0, 0, "GroundAssets", "frost0000")),
          j.anchor.set(0.5),
          k.anchor.set(0.5),
          j.animations.add(
            "loop",
            Phaser.Animation.generateFrameNames("frost", 0, 10, "", 4),
            30,
            true,
          ),
          k.animations.add(
            "loop",
            Phaser.Animation.generateFrameNames("frost", 0, 10, "", 4),
            30,
            true,
          ),
          j.animations.play("loop"),
          k.animations.play("loop"),
          this.addChild(j),
          this.addChild(k),
          (j.x = n),
          (k.x = n),
          (i = this.game.add.tween(j).to({ x: 10 }, b, "Linear", true)),
          (i = this.game.add.tween(k).to({ x: l - 10 }, b, "Linear", true)),
          i.onComplete.add(
            (function (a) {
              return function () {
                return (
                  a.frozen && (a.liquidGraphics.visible = false),
                  m.destroy(),
                  c.destroy(),
                  j.destroy(),
                  k.destroy()
                );
              };
            })(this),
          ));
      };
      Liquid.prototype.melt = function () {
        var a, b, c, d, e, f, g, h, i, j, k, l, m, n;
        ((e = 800),
          console.log("melting"),
          (this.frozen = false),
          this.iceFixture.SetFilterData({ maskBits: 0, categoryBits: 1 }),
          (i = this.frozenBodies));
        for (c in i)
          ((f = i[c]), (f.body.static = false), delete this.frozenBodies[c]);
        return (
          this.iceFixture.Refilter(),
          (this.sensorFixture.m_userData.lightProperties.type = "normal"),
          (this.liquidGraphics.visible = true),
          (d = this.game.make.graphics(0, 0)),
          this.addChild(d),
          (m = this.game.physics.box2d.mpx(this.options.width)),
          d.beginFill(16777215),
          d.drawRect(0, -10, m, 52),
          (a = this.sensorFixture.m_userData.lightProperties.lightAt),
          (n = this.game.physics.box2d.mpx(-a.x - this.options.x)),
          (d.width = 0),
          (d.x = n),
          (j = this.game.add
            .tween(d)
            .to({ x: 0, width: m }, e, "Linear", true)
            .onUpdateCallback(
              (function (a) {
                return function () {
                  return a.frozen
                    ? (d.visible = false)
                    : (a.liquidGraphics.mask = d);
                };
              })(this),
            )),
          (b = this.game.make.graphics(0, 0)),
          this.addChild(b),
          (b.width = m),
          (b.x = 0),
          (g = { val: m - n }),
          (j = this.game.add
            .tween(g)
            .to({ val: 0 }, e, "Linear", true)
            .onUpdateCallback(
              (function (a) {
                return function () {
                  return a.frozen
                    ? (b.visible = false)
                    : (b.clear(),
                      b.beginFill(16777215),
                      b.drawRect(m - g.val - 10, -10, g.val + 20, 52));
                };
              })(this),
            )),
          (h = { val: n }),
          (j = this.game.add
            .tween(h)
            .to({ val: 0 }, e, "Linear", true)
            .onUpdateCallback(
              (function (a) {
                return function () {
                  return a.frozen
                    ? (b.visible = false)
                    : (b.beginFill(16777215),
                      b.drawRect(0, -10, h.val, 52),
                      (a.iceGraphics.mask = b));
                };
              })(this),
            )),
          (k = this.game.make.sprite(0, 0, "GroundAssets", "vapor0000")),
          (l = this.game.make.sprite(0, 0, "GroundAssets", "vapor0000")),
          k.anchor.set(0.5),
          l.anchor.set(0.5),
          k.animations.add(
            "loop",
            Phaser.Animation.generateFrameNames("vapor", 0, 10, "", 4),
            30,
            true,
          ),
          l.animations.add(
            "loop",
            Phaser.Animation.generateFrameNames("vapor", 0, 10, "", 4),
            30,
            true,
          ),
          k.animations.play("loop"),
          l.animations.play("loop"),
          this.addChild(k),
          this.addChild(l),
          (k.x = n),
          (l.x = n),
          (j = this.game.add.tween(k).to({ x: 10 }, e, "Linear", true)),
          (j = this.game.add.tween(l).to({ x: m - 10 }, e, "Linear", true)),
          j.onComplete.add(
            (function (a) {
              return function () {
                return (
                  a.frozen || (a.iceGraphics.visible = false),
                  d.destroy(),
                  b.destroy(),
                  k.destroy(),
                  l.destroy()
                );
              };
            })(this),
          )
        );
      };
      return Liquid;
    });
  }.call(this),
  function () {
    define("States/Level/Devices/MovingPlatform", ["./Device"], function (
      Device,
    ) {
      "use strict";
      function MovingPlatform(b, c) {
        ((this.drawDarkMask = this.drawDarkMask.bind(this)),
          (this.checkState = this.checkState.bind(this)),
          (this.updateState = this.updateState.bind(this)),
          (this.update = this.update.bind(this)),
          (this.sounds = this.sounds.bind(this)));
        var e, f, g, h, i, j, k, l, m, n, o;
        (c.width < c.height
          ? ((o = c.width),
            (c.width = c.height),
            (c.height = o),
            (c.x = c.x + c.height / 2),
            (c.y = c.y + c.width / 2),
            (this.shapeRotation = n = -Math.PI / 2))
          : ((c.x = c.x + c.width / 2),
            (c.y = c.y + c.height / 2),
            (this.shapeRotation = n = 0)),
          (c.padding = {
            x:
              null != c.properties && null != c.properties.paddingX
                ? c.properties.paddingX
                : 0,
            y:
              null != c.properties && null != c.properties.paddingY
                ? c.properties.paddingY
                : 0.06,
          }),
          MovingPlatform.__super__.constructor.call(this, b, c),
          (this.sprite = this.game.make.sprite(
            this.options.x,
            this.options.y,
            "MechAssets",
            "_default0000",
          )),
          this.game.physics.box2d.enable(this.sprite),
          this.game.layers.underGround.addChild(this.sprite),
          (this.body = this.sprite.body),
          this.body.clearFixtures(),
          this.body.data.SetAngle(this.options.rotation),
          (l = new box2d.b2PolygonShape()),
          l.SetAsOrientedBox(
            this.options.width / 2 - this.options.padding.x,
            this.options.height / 2 - this.options.padding.y,
            new box2d.b2Vec2(0, 0),
            n,
          ),
          (h = new box2d.b2FixtureDef()),
          (h.shape = l),
          (h.friction = 0.7),
          (h.restitution = 0),
          null != this.options.properties.dtheta
            ? (h.density = 0.5)
            : (h.density = 0),
          (h.userData = { reflection: true }),
          (h.filter.categoryBits = 256),
          (h.filter.maskBits = 4369),
          (g = this.body.data.CreateFixture(h)),
          (g.id = this.body.world.getNextFixtureId()),
          null != this.options.properties.dtheta
            ? ((i = new box2d.b2RevoluteJointDef()),
              (k = this.body.data.GetWorldCenter()),
              (f = new box2d.b2Vec2(
                k.x - (this.options.properties.offsetX || 0),
                k.y - (this.options.properties.offsetY || 0),
              )),
              i.Initialize(this.body.data, this.game.level.groundBody, f),
              this.options.properties.dtheta > 0
                ? ((i.lowerAngle = 0),
                  (i.upperAngle =
                    (Math.PI * this.options.properties.dtheta) / 180))
                : ((i.lowerAngle =
                    (Math.PI * this.options.properties.dtheta) / 180),
                  (i.upperAngle = 0)),
              (i.enableLimit = true),
              (i.maxMotorTorque = 200),
              (i.enableMotor = true),
              (this.joint = this.game.physics.box2d.world.CreateJoint(i)))
            : ((e = new box2d.b2Vec2(
                this.options.properties.dx,
                this.options.properties.dy,
              )),
              (i = new box2d.b2PrismaticJointDef()),
              i.Initialize(
                this.body.data,
                this.game.level.groundBody,
                this.body.data.GetWorldCenter(),
                e,
              ),
              (i.lowerTranslation = -e.Length()),
              (i.upperTranslation = 0),
              (i.enableLimit = true),
              (i.motorSpeed = 0.5),
              (i.maxMotorForce = 220),
              (i.enableMotor = true),
              (this.joint = this.game.physics.box2d.world.CreateJoint(i))),
          (this.state = 0),
          this.registerDevice(),
          (this.shapeSprite = this.game.make.group(0, 0)),
          (j = this.game.make.sprite(0, 0, "MechAssets", "BarCapLeft0000")),
          j.anchor.set(0.5),
          this.shapeSprite.addChild(j),
          (j.x = this.mpx(this.options.width / 2 - 0.5)),
          (j.y = this.mpx(this.options.height / 2 - 0.5)),
          (m = this.game.make.sprite(0, 0, "MechAssets", "BarCapRight0000")),
          m.anchor.set(0.5),
          this.shapeSprite.addChild(m),
          (m.x = -this.mpx(this.options.width / 2 - 0.5)),
          (m.y = this.mpx(this.options.height / 2 - 0.5)),
          (f = this.game.make.sprite(0, 0, "MechAssets", "BarCenter0000")),
          f.anchor.set(0.5),
          this.shapeSprite.addChild(f),
          (f.x = 0),
          (f.y = 0),
          (f.scale.x = (this.options.width - 2) / 3),
          (this.lights[0].scale.x = (this.options.width - 1) / 3),
          this.shapeSprite.addChild(this.lights[0]),
          (this.shapeSprite.rotation = n),
          this.sprite.addChild(this.shapeSprite),
          0 === n
            ? ((this.sprite.scale.x = 1.05), (this.sprite.scale.y = 0.95))
            : ((this.sprite.scale.y = 1.05), (this.sprite.scale.x = 0.95)));
      }
      extend(MovingPlatform, Device);
      MovingPlatform.prototype.options = {
        atlasName: null,
        frameName: null,
        lightAtlas: "MechAssets",
        lightFrame: "moving_platform_light",
        properties: { group: 0, dx: 4, dy: 0 },
      };
      MovingPlatform.prototype.sounds = function () {
        return "platform";
      };
      MovingPlatform.prototype.update = function () {
        return (
          null != this.joint.GetJointAngleRadians &&
            (this.joint.GetJointAngleRadians() < this.joint.GetLowerLimit() &&
              this.body.data.SetAngle(-this.joint.GetLowerLimit()),
            this.joint.GetJointAngleRadians() > this.joint.GetUpperLimit() &&
              this.body.data.SetAngle(-this.joint.GetUpperLimit())),
          MovingPlatform.__super__.update.apply(this, arguments)
        );
      };
      MovingPlatform.prototype.updateState = function (a) {
        var b;
        if (
          ((this.cacheAsBitmap = true),
          (b =
            null != this.joint.GetJointAngleRadians &&
            this.options.properties.dtheta > 0
              ? -2
              : 2),
          0 === this.state)
        ) {
          if (
            (this.joint.SetMotorSpeed(b),
            this.body.data.ApplyForce(
              new box2d.b2Vec2(1, 0),
              new box2d.b2Vec2(0, 0),
            ),
            null != this.sound &&
              (this.sound.stopInstance(), (this.sound = null)),
            !a)
          )
            return (this.sound =
              this.game.level.sounds.platform.playInstance());
        } else if (
          (this.joint.SetMotorSpeed(-b),
          this.body.data.ApplyForce(
            new box2d.b2Vec2(1, 0),
            new box2d.b2Vec2(0, 0),
          ),
          null != this.sound &&
            (this.sound.stopInstance(), (this.sound = null)),
          !a)
        )
          return (this.sound = this.game.level.sounds.platform.playInstance());
      };
      MovingPlatform.prototype.checkState = function () {
        var a, b, c;
        return (
          (a = (function (a) {
            return function () {
              return null != a.joint.GetJointTranslation
                ? a.joint.GetJointTranslation()
                : a.options.properties.dtheta > 0
                  ? -a.joint.GetJointAngleRadians()
                  : a.joint.GetJointAngleRadians();
            };
          })(this)),
          (c = (function (a) {
            return function () {
              return null != a.joint.GetJointTranslation
                ? a.joint.m_upperTranslation
                : a.options.properties.dtheta > 0
                  ? -a.joint.GetLowerLimit()
                  : a.joint.GetUpperLimit();
            };
          })(this)),
          (b = (function (a) {
            return function () {
              return null != a.joint.GetJointTranslation
                ? a.joint.m_lowerTranslation
                : a.options.properties.dtheta > 0
                  ? -a.joint.GetUpperLimit()
                  : a.joint.GetLowerLimit();
            };
          })(this)),
          null != this.sound && 0 === this.state && a() >= c()
            ? (this.sound.stopInstance(), (this.sound = null))
            : null != this.sound && 1 === this.state && a() <= b()
              ? (this.sound.stopInstance(), (this.sound = null))
              : void 0
        );
      };
      MovingPlatform.prototype.drawDarkMask = function (a) {
        var b, c, d, e;
        if (1 === this.state)
          return (
            (a.ctx.globalCompositeOperation = "lighter"),
            (e = {
              x: this.sprite.x + a.offset.x,
              y: this.sprite.y + a.offset.y,
            }),
            (b = new box2d.b2Vec2(36, 0).SelfRotateRadians(this.shapeRotation)),
            (c = new box2d.b2Vec2(-36, 0).SelfRotateRadians(
              this.shapeRotation,
            )),
            (d = a.ctx.createRadialGradient(
              e.x + b.x,
              e.y + b.y,
              20,
              e.x + b.x,
              e.y + b.y,
              160,
            )),
            d.addColorStop(0, "rgba(255,255,255,0.9)"),
            d.addColorStop(0.5, "rgba(255,255,255,0.2)"),
            d.addColorStop(1, "transparent"),
            a.circle(e.x + b.x, e.y + b.y, 160, d),
            (d = a.ctx.createRadialGradient(
              e.x + c.x,
              e.y + c.y,
              20,
              e.x + c.x,
              e.y + c.y,
              160,
            )),
            d.addColorStop(0, "rgba(255,255,255,0.9)"),
            d.addColorStop(0.5, "rgba(255,255,255,0.2)"),
            d.addColorStop(1, "transparent"),
            a.circle(e.x + c.x, e.y + c.y, 180, d)
          );
      };
      return MovingPlatform;
    });
  }.call(this),
  function () {
    define("States/Level/Devices/Portal", ["./BoxedDevice"], function (
      BoxedDevice,
    ) {
      "use strict";
      function Portal(b, c) {
        ((this.drawDarkMask = this.drawDarkMask.bind(this)),
          (this.ocupy = this.ocupy.bind(this)),
          (this.createFakeBlock = this.createFakeBlock.bind(this)),
          (this.debugVector = this.debugVector.bind(this)),
          (this.destroy = this.destroy.bind(this)),
          (this.update = this.update.bind(this)),
          (this.updateState = this.updateState.bind(this)),
          (this.transport = this.transport.bind(this)),
          (this.removeMask = this.removeMask.bind(this)),
          (this.createMask = this.createMask.bind(this)),
          (this.sounds = this.sounds.bind(this)));
        var e, f, g, h, i, j, k, l, m, n;
        (c.rotation || (c.rotation = 0),
          Portal.__super__.constructor.call(this, b, c),
          (this.center = g =
            this.game.make.sprite(
              this.options.x,
              this.options.y,
              "MechAssets",
            )),
          g.animations.add(
            "loop",
            Phaser.Animation.generateFrameNames("portal_center", 0, 39, "", 4),
            30,
            true,
          ),
          g.animations.play("loop"),
          g.anchor.set(0.5),
          this.game.physics.box2d.enable(g),
          (this.body = g.body),
          this.game.layers.liquids.addChild(g),
          (this.glowLeft = j =
            this.game.make.sprite(
              this.options.x,
              this.options.y,
              "MechAssets",
            )),
          j.animations.add(
            "loop",
            Phaser.Animation.generateFrameNames("portal_glow", 0, 29, "", 4),
            30,
            true,
          ),
          j.animations.play("loop"),
          j.anchor.set(0.5),
          (j.scale.x = -1),
          (j.rotation = this.options.rotation || 0),
          (j.alpha = 0),
          (j.tint = 0),
          this.game.layers.liquids.addChild(j),
          (this.glowRight = k =
            this.game.make.sprite(
              this.options.x,
              this.options.y,
              "MechAssets",
            )),
          k.animations.add(
            "loop",
            Phaser.Animation.generateFrameNames("portal_glow", 0, 29, "", 4),
            30,
            true,
          ),
          k.animations.play("loop"),
          k.anchor.set(0.5),
          (k.rotation = this.options.rotation || 0),
          (k.alpha = 0),
          this.game.layers.liquids.addChild(k),
          (e = this.game.make.sprite(
            this.options.x,
            this.options.y,
            "MechAssets",
            "portal0000",
          )),
          e.anchor.set(0.5),
          (e.rotation = this.options.rotation || 0),
          (f = this.game.make.sprite(
            0,
            0,
            "MechAssets",
            "portal_light_off0000",
          )),
          f.anchor.set(0.5),
          e.addChild(f),
          (f.offFrameName = "portal_light_off0000"),
          (f.onFrameName = "portal_light_on0000"),
          this.lights.push(f),
          this.game.layers.liquids.addChild(e),
          this.options.properties.inverted &&
            ((g.scale.x = -1),
            (e.scale.x = -1),
            (j.scale.x = 1),
            (k.scale.x = -1)),
          this.body.clearFixtures(),
          (this.body.mass = 0),
          this.body.data.SetAngle(this.options.rotation),
          (m = new box2d.b2PolygonShape()),
          m.SetAsOrientedBox(
            this.options.sensorWidth,
            this.options.sensorHeigh,
            new box2d.b2Vec2(0, 0),
            0,
          ),
          (i = new box2d.b2FixtureDef()),
          (i.shape = m),
          (i.density = 0),
          (i.isSensor = true),
          (i.filter.maskBits = 4096),
          (i.filter.categoryBits = 4096),
          (i.userData = { lightProperties: { type: "transparent" } }),
          (this.sensorFixture = n = this.body.data.CreateFixture(i)),
          (n.id = this.body.world.getNextFixtureId()),
          (l = new box2d.b2PolygonShape()),
          l.SetAsOrientedBox(
            this.options.lightSensorWidth,
            this.options.sensorHeigh,
            new box2d.b2Vec2(0, 0),
            0,
          ),
          (i = new box2d.b2FixtureDef()),
          (i.shape = l),
          (i.density = 0),
          (i.isSensor = false),
          (i.filter.maskBits = 4096),
          (i.filter.categoryBits = 4096),
          (i.userData = {
            lightProperties: {
              type: "portal",
              getOutput: (function (a) {
                return function (b) {
                  var c, d;
                  return (
                    (d = b),
                    (c =
                      (a.other.options.rotation || 0) -
                      (a.options.rotation || 0)),
                    a.other.options.properties.inverted ===
                    a.options.properties.inverted
                      ? d.SelfRotateRadians(c + Math.PI)
                      : d.SelfRotateRadians(c),
                    d
                  );
                };
              })(this),
              getPoint: (function (a) {
                return function (b, c) {
                  var d, e;
                  return (
                    (c = new box2d.b2Vec2(0, 1).SelfRotateRadians(
                      a.options.rotation || 0,
                    )),
                    (e = b.Clone().SelfSub(a.body.data.GetPosition())),
                    a.other.options.properties.inverted !==
                      a.options.properties.inverted &&
                      (e = c
                        .Clone()
                        .SelfMul((2 * e.Dot(c)) / c.Length())
                        .SelfSub(e)),
                    (d =
                      (a.other.options.rotation || 0) -
                      (a.options.rotation || 0)),
                    e.SelfRotateRadians(d),
                    a.other.body.data.GetPosition().SelfAdd(e)
                  );
                };
              })(this),
            },
            device: this,
          }),
          (h = this.body.data.CreateFixture(i)),
          (h.id = this.body.world.getNextFixtureId()),
          (this.eventHorizon = h),
          this.registerDevice(),
          (this.nearBodies = {}),
          this.body.setFixtureContactCallback(
            n,
            (function (a) {
              return function (b, c, d, e, f, g) {
                var h, i;
                if (e.m_userData["portal-sensor"])
                  return f || null == a.nearBodies[c.id]
                    ? 1 === a.state && f && null == a.nearBodies[c.id]
                      ? (console.log("add", c.id),
                        (h = a.body.data.GetLocalPoint(
                          c.data.GetPosition(),
                          new box2d.b2Vec2(),
                        ).x),
                        (i = { body: c, dist: null }),
                        (c.side = h / Math.abs(h)),
                        a.createMask(i),
                        (a.nearBodies[c.id] = i))
                      : void 0
                    : (console.log("remove", c.id),
                      (i = a.nearBodies[c.id]),
                      a.removeMask(i),
                      delete a.nearBodies[c.id]);
              };
            })(this),
            this,
          ),
          this.body.setFixtureContactCallback(
            this.eventHorizon,
            (function (a) {
              return function (b, c, d, e, f, g) {
                var h, i;
                if (f)
                  return (
                    (h = a.body.data.GetLocalPoint(
                      c.data.GetPosition(),
                      new box2d.b2Vec2(),
                    ).x),
                    (i =
                      (h > 0 && !a.options.properties.inverted) ||
                      (h < 0 && a.options.properties.inverted)
                        ? 1
                        : -1),
                    a.transporting || (a.transporting = []),
                    !c.lastTransport ||
                    new Date().getTime() - c.lastTransport > 200
                      ? ((c.lastTransport = new Date().getTime()),
                        a.transporting.push({
                          body: c,
                          vel: c.data.GetLinearVelocity().Clone(),
                          side: i,
                        }))
                      : console.log("prevented transport...")
                  );
              };
            })(this),
            this,
          ),
          this.options.properties.inverted
            ? (this.normal = new box2d.b2Vec2(1, 0))
            : (this.normal = new box2d.b2Vec2(-1, 0)),
          this.normal.SelfRotateRadians(this.options.rotation || 0));
      }
      extend(Portal, BoxedDevice);
      Portal.prototype.options = {
        sensorWidth: 2,
        sensorHeigh: 1.5,
        lightSensorWidth: 0.1,
      };
      Portal.prototype.boxSize = { x: 2, y: 3 };
      Portal.prototype.sounds = function () {
        return ["portalOpen", "portalLoop", "portalClose", "portalTransport"];
      };
      Portal.prototype.createMask = function (a) {
        var b, c, d, e, f;
        return (
          (c = this.mpx(3 * this.options.sensorHeigh)),
          (d = this.game.make.graphics(0, 0)),
          this.game.level.root.addChild(d),
          d.beginFill(16777215),
          (f = new box2d.b2Vec2(-1, 0).SelfRotateRadians(
            this.options.rotation || 0,
          )),
          (b = a.body.data
            .GetPosition()
            .Clone()
            .SelfSub(this.body.data.GetPosition())),
          (e = f.Dot(b) < 0 ? this.mpx(5) : -this.mpx(5)),
          d.drawRect(0, -c, e, 2 * c),
          (d.x = this.options.x),
          (d.y = this.options.y),
          (d.angle = (180 * this.options.rotation) / Math.PI || 0),
          (a.mask = d),
          (a.body.sprite.mask = d)
        );
      };
      Portal.prototype.removeMask = function (a) {
        return ((a.body.sprite.mask = null), a.mask.destroy());
      };
      Portal.prototype.transport = function (a) {
        var b, c, d, e, f, g;
        return (
          (c = a.body),
          (e = new box2d.b2Vec2(0, 1).SelfRotateRadians(
            this.options.rotation || 0,
          )),
          (d = c.data
            .GetPosition()
            .Clone()
            .SelfSub(this.body.data.GetPosition())),
          this.other.options.properties.inverted !==
            this.options.properties.inverted &&
            (d = e
              .Clone()
              .SelfMul((2 * d.Dot(e)) / e.Length())
              .SelfSub(d)),
          (b =
            (this.other.options.rotation || 0) - (this.options.rotation || 0)),
          d.SelfRotateRadians(b),
          c.data.SetPosition(this.other.body.data.GetPosition().SelfAdd(d)),
          this.other.options.properties.inverted ===
          this.options.properties.inverted
            ? ((g = a.vel.Clone().SelfRotateRadians(-b)),
              (g = e
                .Clone()
                .SelfMul((2 * g.Dot(e)) / e.Length())
                .SelfSub(g)))
            : (g = a.vel.Clone().SelfRotateRadians(b)),
          c.data.SetLinearVelocity(g),
          g.Length() < 10 &&
            ((f = this.other.normal.Clone()),
            1 === a.side && f.SelfMul(-1),
            c.data.SetLinearVelocity(
              g.SelfNormalize().SelfMul(10 / c.data.GetMass()),
            )),
          this.game.physics.update(),
          this.game.level.sounds.portalTransport.play(),
          this.sensorFixture.Refilter(),
          this.eventHorizon.Refilter()
        );
      };
      Portal.prototype.updateState = function (a) {
        if (
          (1 !== this.state || this.center.visible
            ? 0 === this.state &&
              this.center.visible &&
              ((this.center.visible = false),
              this.eventHorizon.SetFilterData({
                maskBits: 0,
                categoryBits: 0,
              }),
              this.sensorFixture.SetFilterData({
                maskBits: 0,
                categoryBits: 0,
              }),
              null != this.sound &&
                (this.sound.stopInstance(), (this.sound = null)),
              a || this.game.level.sounds.portalClose.play())
            : ((this.center.visible = true),
              this.eventHorizon.SetFilterData({
                maskBits: 4096,
                categoryBits: 4096,
              }),
              this.sensorFixture.SetFilterData({
                maskBits: 4096,
                categoryBits: 4096,
              }),
              this.game.level.sounds.portalOpen.play(),
              (this.game.level.sounds.portalLoop.loop = true),
              a ||
                ((this.sound =
                  this.game.level.sounds.portalLoop.playInstance()),
                (this.sound.volume = 0.3))),
          this.sensorFixture.Refilter(),
          null != this.fakeWallFixture)
        )
          return (
            1 === this.state
              ? this.fakeWallFixture.SetFilterData({
                  maskBits: 0,
                  categoryBits: 0,
                })
              : this.fakeWallFixture.SetFilterData({
                  maskBits: 4369,
                  categoryBits: 1,
                }),
            this.fakeWallFixture.Refilter()
          );
      };
      Portal.prototype.update = function () {
        var a, b, c, d, e, f, g, h;
        if (1 === this.state && Object.keys(this.nearBodies).length > 0) {
          ((d = 1 / 0), (e = 1 / 0), (h = this.nearBodies));
          for (c in h)
            ((f = h[c]),
              (a = this.body.data.GetLocalPoint(
                f.body.data.GetPosition(),
                new box2d.b2Vec2(),
              )),
              (b = a.x),
              f.body.side &&
                f.body.side !== b / Math.abs(b) &&
                (console.log("side violation!", f.body),
                f.body.data.SetPosition(
                  f.body.data.GetPosition().SelfAdd(a.Clone().SelfMul(-2)),
                )),
              this.options.properties.inverted && (b *= -1),
              b > 0 ? (d = Math.min(d, b)) : (e = Math.min(e, -b)));
          (d < 1 / 0 &&
            (this.glowLeft.alpha = this.other.glowLeft.alpha =
              Math.min(1, (2 - d) / 2 + 0.3)),
            e < 1 / 0 &&
              (this.glowRight.alpha = this.other.glowRight.alpha =
                Math.min(1, (2 - e) / 2 + 0.3)),
            null != this.sound &&
              (this.sound.volume =
                0.3 + Math.max(this.glowRight.alpha, this.glowLeft.alpha)));
        } else
          null == this.transporting &&
            null == this.other.transporting &&
            null == this.receiving &&
            null == this.other.receiving &&
            (0 === this.state ||
              (0 === Object.keys(this.nearBodies).length &&
                0 === Object.keys(this.other.nearBodies).length)) &&
            (this.glowRight.alpha =
              this.other.glowRight.alpha =
              this.glowLeft.alpha =
              this.other.glowLeft.alpha =
                0);
        if (1 === this.state && null != this.transporting) {
          for (; (g = this.transporting.shift()); ) this.transport(g);
          ((this.other.receiving = true), (this.transporting = null));
        }
        this.receiving = null;
      };
      Portal.prototype.destroy = function () {
        return (
          null != this.sound && this.sound.stopInstance(),
          Portal.__super__.destroy.apply(this, arguments)
        );
      };
      Portal.prototype.debugVector = function (a, b) {
        return (
          this.debugger.lineStyle(2, b, 1),
          this.debugger.moveTo(0, 0),
          this.debugger.lineTo(this.mpx(a.x), this.mpx(a.y))
        );
      };
      Portal.prototype.createFakeBlock = function (a) {
        var b, c, d, e;
        return (
          (e = this.game.make.sprite(0, 0, "MechAssets", "_default0000")),
          this.game.physics.box2d.enable(e),
          (b = e.body),
          b.clearFixtures(),
          (a.center.y -= 0.5 * Math.cos(this.options.rotation)),
          (a.center.x += 0.5 * Math.sin(this.options.rotation)),
          (d = new box2d.b2PolygonShape()),
          d.SetAsOrientedBox(a.width, a.height, a.center, a.rotation),
          (c = new box2d.b2FixtureDef()),
          (c.shape = d),
          (this.fakeWallFixture = b.data.CreateFixture(c)),
          (b.mass = 0)
        );
      };
      Portal.prototype.ocupy = function (a) {
        var b, c;
        return (
          (b = this.options.x / 32),
          (c = this.options.y / 32),
          this.ocupyTile(a, b, c + 2),
          this.ocupyTile(a, b - 1, c - 2),
          this.ocupyTile(a, b - 1, c + 2),
          this.ocupyTile(a, b, c - 2)
        );
      };
      Portal.prototype.drawDarkMask = function (a) {
        var b, c, d, e;
        if (1 === this.state)
          return (
            (a.ctx.globalCompositeOperation = "lighter"),
            (e = {
              x: this.center.x + a.offset.x,
              y: this.center.y + a.offset.y,
            }),
            (b = new box2d.b2Vec2(0, 36).SelfRotateRadians(
              this.options.rotation,
            )),
            (c = new box2d.b2Vec2(0, -36).SelfRotateRadians(
              this.options.rotation,
            )),
            (d = a.ctx.createRadialGradient(
              e.x + b.x,
              e.y + b.y,
              20,
              e.x + b.x,
              e.y + b.y,
              90,
            )),
            d.addColorStop(0, "rgba(255,255,255,1)"),
            d.addColorStop(0.5, "rgba(255,255,255,0.3)"),
            d.addColorStop(1, "transparent"),
            a.circle(e.x + b.x, e.y + b.y, 90, d),
            (d = a.ctx.createRadialGradient(
              e.x + c.x,
              e.y + c.y,
              20,
              e.x + c.x,
              e.y + c.y,
              90,
            )),
            d.addColorStop(0, "rgba(255,255,255,1)"),
            d.addColorStop(0.5, "rgba(255,255,255,0.3)"),
            d.addColorStop(1, "transparent"),
            a.circle(e.x + c.x, e.y + c.y, 90, d)
          );
      };
      return Portal;
    });
  }.call(this),
  function () {
    define("States/Level/Devices/Pulley", ["./Device"], function (Device) {
      "use strict";
      function Pulley(b, c) {
        this.update = this.update.bind(this);
        var e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y;
        for (
          Pulley.__super__.constructor.call(this, b, c),
            this.barWidth =
              this.options.properties.barWidth || this.options.barWidth,
            this.barHeight =
              this.options.properties.barHeight || this.options.barHeight,
            this.anchor1 = new box2d.b2Vec2(
              this.options.polyline[1][0] + this.options.x,
              this.options.polyline[1][1] + this.options.y - this.mpx(2),
            ),
            this.anchor2 = new box2d.b2Vec2(
              this.options.polyline[2][0] + this.options.x,
              this.options.polyline[2][1] + this.options.y - this.mpx(2),
            ),
            q = {
              x: this.options.polyline[0][0] + this.options.x,
              y: this.options.polyline[0][1] + this.options.y,
            },
            r = {
              x: this.options.polyline[3][0] + this.options.x,
              y: this.options.polyline[3][1] + this.options.y,
            },
            this.ropeLeft = this.game.make.tileSprite(
              q.x,
              q.y,
              200,
              20,
              "MechAssets",
              "pulley_rope0000",
            ),
            this.ropeCenter = this.game.make.tileSprite(
              this.anchor1.x,
              this.anchor1.y,
              200,
              20,
              "MechAssets",
              "pulley_rope0000",
            ),
            this.ropeRight = this.game.make.tileSprite(
              r.x,
              r.y,
              200,
              20,
              "MechAssets",
              "pulley_rope0000",
            ),
            this.ropeLeft.anchor.set(0, 0.5),
            this.ropeCenter.anchor.set(0, 0.5),
            this.ropeRight.anchor.set(0, 0.5),
            this.game.layers.underGround.addChild(this.ropeLeft),
            this.game.layers.underGround.addChild(this.ropeCenter),
            this.game.layers.underGround.addChild(this.ropeRight),
            this.platform1 = s =
              this.game.make.sprite(q.x, q.y, "MechAssets", "_default0000"),
            this.platform2 = t =
              this.game.make.sprite(r.x, r.y, "MechAssets", "_default0000"),
            this.game.physics.box2d.enable(s),
            this.game.physics.box2d.enable(t),
            this.plat1 = this.game.make.sprite(
              0,
              0,
              "MechAssets",
              "pulley_platform0000",
            ),
            this.plat2 = this.game.make.sprite(
              0,
              0,
              "MechAssets",
              "pulley_platform0000",
            ),
            this.plat1.anchor.set(0.5),
            this.plat2.anchor.set(0.5),
            this.plat1.width = 1.3 * this.mpx(this.barWidth),
            this.plat2.width = 1.3 * this.mpx(this.barWidth),
            this.base1 = this.game.make.sprite(
              0,
              0,
              "MechAssets",
              "pulley_base0000",
            ),
            this.base2 = this.game.make.sprite(
              0,
              0,
              "MechAssets",
              "pulley_base0000",
            ),
            this.base1.anchor.set(0.5),
            this.base2.anchor.set(0.5),
            this.platform1.addChild(this.base1),
            this.platform2.addChild(this.base2),
            this.platform1.addChild(this.plat1),
            this.platform2.addChild(this.plat2),
            this.game.layers.underGround.addChild(this.platform1),
            this.game.layers.underGround.addChild(this.platform2),
            s.body.data.SetFixedRotation(true),
            t.body.data.SetFixedRotation(true),
            s.body.data.m_userData = "reactable",
            t.body.data.m_userData = "reactable",
            s.body.data.SetLinearDamping(0.1),
            t.body.data.SetLinearDamping(0.1),
            v = [this.platform1.body, this.platform2.body],
            n = 0,
            p = v.length;
          n < p;
          n++
        )
          ((h = v[n]),
            h.clearFixtures(),
            (l = this.barWidth / 2),
            (k = this.barHeight / 2),
            (m = l + 0.1),
            (y = []),
            y.push(new box2d.b2Vec2(l, k)),
            y.push(new box2d.b2Vec2(-l, k)),
            y.push(new box2d.b2Vec2(-m, 0)),
            y.push(new box2d.b2Vec2(-l, -k)),
            y.push(new box2d.b2Vec2(l, -k)),
            y.push(new box2d.b2Vec2(m, 0)),
            (u = new box2d.b2PolygonShape()),
            u.Set(y),
            (j = new box2d.b2FixtureDef()),
            (j.shape = u),
            (j.friction = 0.4),
            (j.restitution = 0),
            (j.density = 3),
            (i = h.data.CreateFixture(j)),
            (i.id = h.world.getNextFixtureId()),
            this.options.properties.prismatic &&
              ((g = new box2d.b2Vec2(0, 1)),
              (x = new box2d.b2BodyDef()),
              (x.density = 0),
              (w = new box2d.b2Body(x)),
              (o = new box2d.b2PrismaticJointDef()),
              o.Initialize(h.data, w, h.data.GetWorldCenter(), g),
              (this.joint = this.game.physics.box2d.world.CreateJoint(o))));
        return (
          (this.wheel1 = this.game.make.sprite(
            this.anchor1.x + 10,
            this.anchor1.y + 10 - this.baseHeight,
            "MechAssets",
            "pulley_anchor0000",
          )),
          (this.wheel2 = this.game.make.sprite(
            this.anchor2.x - 10,
            this.anchor2.y + 10 - this.baseHeight,
            "MechAssets",
            "pulley_anchor0000",
          )),
          this.wheel1.anchor.set(0.5),
          this.wheel2.anchor.set(0.5),
          this.game.layers.underGround.addChild(this.wheel1),
          this.game.layers.underGround.addChild(this.wheel2),
          (o = new box2d.b2PulleyJointDef()),
          (e = { x: this.pxm(this.anchor1.x), y: this.pxm(this.anchor1.y) }),
          (f = { x: this.pxm(this.anchor2.x), y: this.pxm(this.anchor2.y) }),
          o.Initialize(
            s.body.data,
            t.body.data,
            e,
            f,
            s.body.data.GetWorldCenter(),
            t.body.data.GetWorldCenter(),
            1,
          ),
          (this.joint = this.game.physics.box2d.world.CreateJoint(o)),
          this
        );
      }
      extend(Pulley, Device);
      Pulley.prototype.baseHeight = 60;
      Pulley.prototype.options = { barWidth: 2.7, barHeight: 0.24 };
      Pulley.prototype.lastp1 = { x: 0, y: 0 };
      Pulley.prototype.update = function () {
        var a, b, c, d, e, f, g;
        return (
          (f = new box2d.b2Vec2(
            this.platform1.position.x,
            this.platform1.position.y - this.baseHeight,
          )),
          (a = new box2d.b2Vec2(
            this.anchor1.x,
            this.anchor1.y - this.baseHeight,
          )),
          (g = new box2d.b2Vec2(
            this.platform2.position.x,
            this.platform2.position.y - this.baseHeight,
          )),
          (b = new box2d.b2Vec2(
            this.anchor2.x,
            this.anchor2.y - this.baseHeight,
          )),
          Math.round(1 * this.lastp1.x) !== Math.round(1 * f.x) ||
          Math.round(1 * this.lastp1.y) !== Math.round(1 * f.y) ||
          Math.round(1 * this.lastp2.x) !== Math.round(1 * g.x) ||
          Math.round(1 * this.lastp2.y) !== Math.round(1 * g.y)
            ? ((this.cacheAsBitmap = false),
              (this.lastp1 = f.Clone()),
              (this.lastp2 = g.Clone()),
              (d = f.Clone().SelfSub(a)),
              (c = a.Clone().SelfSub(b)),
              (e = b.Clone().SelfSub(g)),
              (this.ropeLeft.position = { x: a.x, y: a.y }),
              (this.ropeLeft.width = d.Length()),
              (this.ropeLeft.height = 20),
              (this.ropeLeft.rotation = Math.atan2(-d.y, -d.x) + Math.PI),
              (this.ropeLeft.tilePosition.x = d.Length()),
              (this.ropeCenter.position = { x: a.x, y: a.y }),
              (this.ropeCenter.width = c.Length()),
              (this.ropeCenter.height = 20),
              (this.ropeCenter.rotation = Math.atan2(-c.y, -c.x)),
              (this.ropeCenter.tilePosition.x = e.Length()),
              (this.ropeRight.position = { x: b.x, y: b.y }),
              (this.ropeRight.width = e.Length()),
              (this.ropeRight.height = 20),
              (this.ropeRight.rotation = Math.atan2(-e.y, -e.x)),
              (this.ropeRight.tilePosition.x = e.Length()),
              (this.wheel1.rotation = e.Length() / Math.PI / 10),
              (this.wheel2.rotation = e.Length() / Math.PI / 10))
            : this.cacheAsBitmap
              ? void 0
              : (this.cacheAsBitmap = true)
        );
      };
      return Pulley;
    });
  }.call(this),
  function () {
    define("States/Level/Devices/Pusher", ["./BoxedDevice"], function (
      BoxedDevice,
    ) {
      "use strict";
      function Pusher(b, c) {
        ((this.ocupy = this.ocupy.bind(this)),
          (this.checkState = this.checkState.bind(this)),
          (this.doRegister = this.doRegister.bind(this)),
          (this.sounds = this.sounds.bind(this)));
        var e, f, g, h, i, j, k, l, m, n, o;
        return (
          Pusher.__super__.constructor.call(this, b, c),
          (g = this.game.make.sprite(
            this.options.x,
            this.options.y,
            "MechAssets",
            "_default0000",
          )),
          this.game.physics.box2d.enable(g),
          (h = this.game.make.resSprite(
            0,
            0,
            "MechAssets",
            "pusher_block0000",
          )),
          h.anchor.set(0.5),
          g.addChild(h),
          (j = this.game.make.resSprite(
            0,
            0,
            "MechAssets",
            "pusher_block_light0000",
          )),
          j.anchor.set(0.5),
          g.addChild(j),
          (this.button = g),
          this.game.layers.underGround.addChild(g),
          (this.base = f =
            this.game.make.sprite(
              this.options.x,
              this.options.y + this.mpx(0.5),
              "MechAssets",
              "_default0000",
            )),
          this.game.layers.overGround.addChild(f),
          this.lights.push(j),
          g.body.clearFixtures(),
          g.body.data.SetAngle((Math.PI * c.rotation) / 180 || 0),
          (i = g.body),
          (o = []),
          o.push(new box2d.b2Vec2(-this.options.pusherWidth / 2 - 0.5, 0)),
          o.push(new box2d.b2Vec2(this.options.pusherWidth / 2 + 0.5, 0)),
          o.push(
            new box2d.b2Vec2(
              this.options.pusherWidth / 2,
              this.options.pusherHeight,
            ),
          ),
          o.push(
            new box2d.b2Vec2(
              -this.options.pusherWidth / 2,
              this.options.pusherHeight,
            ),
          ),
          (n = new box2d.b2PolygonShape()),
          n.Set(o),
          (k = new box2d.b2FixtureDef()),
          (k.shape = n),
          (k.friction = 0.7),
          (k.restitution = 0),
          (k.density = 0.1),
          (k.userData = "pusher"),
          (k.filter.categoryBits = 1),
          (k.filter.maskBits = 61695),
          (m = i.data.CreateFixture(k)),
          (m.id = i.world.getNextFixtureId()),
          (e = new box2d.b2Vec2(0, 1)),
          (l = new box2d.b2PrismaticJointDef()),
          l.Initialize(
            i.data,
            this.game.level.groundBody,
            i.data.GetWorldCenter(),
            e,
          ),
          (l.upperTranslation = 0.7),
          (l.lowerTranslation = 0),
          (l.enableLimit = true),
          (l.motorSpeed = -15),
          (l.maxMotorForce = 5),
          (l.enableMotor = true),
          (this.joint = this.game.physics.box2d.world.CreateJoint(l)),
          (this.signal = new Phaser.Signal()),
          this.doRegister(),
          this
        );
      }
      extend(Pusher, BoxedDevice);
      Pusher.prototype.options = {
        pusherWidth: 1,
        pusherHeight: 0.6,
        atlasName: null,
        frameName: null,
      };
      Pusher.prototype.sounds = function () {
        return "pusher";
      };
      Pusher.prototype.doRegister = function () {
        return this.registerDevice();
      };
      Pusher.prototype.checkState = function () {
        return 0 === this.state && this.joint.GetJointTranslation() > 0.2
          ? ((this.state = 1),
            this.game.level.sounds.pusher.play(),
            this.signal.dispatch(this))
          : 1 === this.state && this.joint.GetJointTranslation() <= 0.2
            ? ((this.state = 0),
              this.game.level.sounds.pusher.play(),
              this.signal.dispatch(this))
            : void 0;
      };
      Pusher.prototype.ocupy = function () {};
      return Pusher;
    });
  }.call(this),
  function () {
    define("States/Level/Devices/Roman", ["./BoxedDevice"], function (
      BoxedDevice,
    ) {
      "use strict";
      function Roman(a, b) {
        var d, e, f, g, h, i, j, k, l, m, n, o, p, q;
        return (
          Roman.__super__.constructor.call(this, a, b),
          this.options.polygon[0][0] === this.options.polygon[1][0]
            ? ((m =
                2 *
                this.pxm(
                  this.options.polygon[2][0] - this.options.polygon[1][0],
                )),
              (k = this.pxm(
                this.options.polygon[1][1] - this.options.polygon[0][1],
              )),
              (f = 0.6),
              (d = -Math.atan(k / (m / 2))))
            : ((m =
                2 *
                this.pxm(
                  this.options.polygon[1][0] - this.options.polygon[0][0],
                )),
              (k = this.pxm(
                this.options.polygon[1][1] - this.options.polygon[0][1],
              )),
              (f = 0.6),
              (d = Math.atan(k / (m / 2)))),
          (h = {
            x: this.options.polygon[1][0] + this.options.x + this.mpx(1),
            y: this.options.polygon[1][1] + this.options.y - this.mpx(1),
          }),
          (e = this.game.make.tileSprite(
            h.x,
            h.y,
            this.mpx(m),
            30,
            "MechAssets",
            "roman_bar0000",
          )),
          this.game.physics.box2d.enable(e),
          (i = this.game.make.sprite(
            this.mpx(m / 2),
            0,
            "MechAssets",
            "roman_end0000",
          )),
          i.anchor.set(0.05, 0.5),
          e.addChild(i),
          (i = this.game.make.sprite(
            -this.mpx(m / 2),
            0,
            "MechAssets",
            "roman_end0000",
          )),
          (i.scale.x = -1),
          i.anchor.set(0.05, 0.5),
          e.addChild(i),
          (o = this.game.make.sprite(
            h.x,
            h.y,
            "MechAssets",
            "roman_center0000",
          )),
          o.anchor.set(0.5, 0.5),
          e.body.clearFixtures(),
          (q = []),
          q.push(new box2d.b2Vec2(-m / 2, -f / 2)),
          q.push(new box2d.b2Vec2(m / 2, -f / 2)),
          q.push(new box2d.b2Vec2(m / 2 - 2, f / 2)),
          q.push(new box2d.b2Vec2(-m / 2 + 2, f / 2)),
          (p = new box2d.b2PolygonShape()),
          p.Set(q),
          (j = new box2d.b2FixtureDef()),
          (j.shape = p),
          (j.friction = 0.7),
          (j.restitution = 0),
          (j.density = 0.1),
          (j.filter.categoryBits = 1),
          (j.filter.maskBits = 65535),
          e.body.data.CreateFixture(j),
          e.body.data.SetAngle(d || 0),
          (g = this.game.make.sprite(
            h.x,
            h.y - this.mpx(k),
            "MechAssets",
            "roman_base0000",
          )),
          this.game.physics.box2d.enable(g),
          g.height / (2 * this.mpx(k)),
          (g.height = -2 * this.mpx(k)),
          this.game.layers.overGround.addChild(g),
          this.game.layers.overGround.addChild(e),
          this.game.layers.overChars.addChild(o),
          g.body.clearFixtures(),
          g.body.data.SetAngle((Math.PI * b.rotation) / 180 || 0),
          (g.body.mass = 0),
          g.body,
          (q = []),
          q.push(new box2d.b2Vec2(-1, 0)),
          q.push(new box2d.b2Vec2(0, k)),
          q.push(new box2d.b2Vec2(1, 0)),
          (p = new box2d.b2PolygonShape()),
          p.Set(q),
          (j = new box2d.b2FixtureDef()),
          (j.shape = p),
          (j.friction = 0.7),
          (j.restitution = 0),
          (j.density = 0.1),
          (j.filter.categoryBits = 1),
          (j.filter.maskBits = 65535),
          g.body.data.CreateFixture(j),
          (l = new box2d.b2RevoluteJointDef()),
          (n = e.body.data.GetWorldCenter()),
          (h = new box2d.b2Vec2(n.x, n.y)),
          l.Initialize(e.body.data, g.body.data, h),
          (this.joint = this.game.physics.box2d.world.CreateJoint(l)),
          this
        );
      }
      extend(Roman, BoxedDevice);
      Roman.prototype.options = { atlasName: null, frameName: null };
      return Roman;
    });
  }.call(this),
  function () {
    define("States/Level/Devices/RotMirror", ["./BoxedDevice"], function (
      BoxedDevice,
    ) {
      "use strict";
      function RotMirror(b, c) {
        ((this.drawDarkMask = this.drawDarkMask.bind(this)),
          (this.checkState = this.checkState.bind(this)),
          (this.updateState = this.updateState.bind(this)),
          (this.update = this.update.bind(this)),
          (this.sounds = this.sounds.bind(this)));
        var e, f, g, h, i, j, k, l, m, n, o;
        for (
          RotMirror.__super__.constructor.call(this, b, c),
            this.base = f =
              this.game.make.resSprite(
                this.options.x,
                this.options.y,
                "MechAssets",
                "rotmirror_circle0000",
              ),
            f.anchor.set(0.5),
            this.game.layers.underGround.addChild(f),
            k = this.game.make.resSprite(
              this.options.x,
              this.options.y,
              "MechAssets",
              "rotmirror0000",
            ),
            k.anchor.set(0.5),
            this.game.physics.box2d.enable(k),
            this.body = k.body,
            l = this.game.make.resSprite(
              0,
              0,
              "MechAssets",
              "rotmirror_light_off0000",
            ),
            l.anchor.set(0.5),
            k.addChild(l),
            l.offFrameName = "rotmirror_light_off0000",
            l.onFrameName = "rotmirror_light_on0000",
            this.lights.push(l),
            this.options.properties.bringToBack
              ? this.game.layers.underGround.addChild(k)
              : this.game.layers.overGround.addChild(k),
            this.body.clearFixtures(),
            o = new box2d.b2PolygonShape(),
            o.SetAsOrientedBox(
              this.options.boxWidth / 2,
              this.options.boxHeight / 2,
              new box2d.b2Vec2(0, 0),
              0,
            ),
            i = new box2d.b2FixtureDef(),
            i.shape = o,
            i.friction = 0.7,
            i.restitution = 0,
            i.density = 1,
            i.userData = { lightProperties: { type: "transparent" } },
            h = this.body.data.CreateFixture(i),
            h.id = this.body.world.getNextFixtureId(),
            m = new box2d.b2PolygonShape(),
            m.SetAsOrientedBox(
              this.options.mirrorWidth / 2,
              this.options.mirrorHeight / 2,
              new box2d.b2Vec2(0, 0),
              Math.PI / 4,
            ),
            i = new box2d.b2FixtureDef(),
            i.shape = m,
            i.friction = 0.7,
            i.restitution = 0,
            i.density = 0.2,
            i.userData = { lightProperties: { type: "mirror" } },
            h = this.body.data.CreateFixture(i),
            h.id = this.body.world.getNextFixtureId(),
            e = new box2d.b2CircleShape(0.25),
            e.m_p = new box2d.b2Vec2(
              this.options.boxWidth / 2 - 0.25,
              this.options.boxWidth / 2 - 0.25,
            ),
            i = new box2d.b2FixtureDef(),
            i.shape = e,
            h = this.body.data.CreateFixture(i),
            e = new box2d.b2CircleShape(0.25),
            e.m_p = new box2d.b2Vec2(
              -this.options.boxWidth / 2 + 0.25,
              -this.options.boxWidth / 2 + 0.25,
            ),
            i = new box2d.b2FixtureDef(),
            i.shape = e,
            h = this.body.data.CreateFixture(i),
            j = new box2d.b2RevoluteJointDef(),
            n = this.body.data.GetWorldCenter(),
            g = new box2d.b2Vec2(n.x, n.y),
            j.Initialize(this.body.data, this.game.level.groundBody, g);
          this.options.rotation < 0;
        )
          this.options.rotation += 2 * Math.PI;
        return (
          1 === this.options.properties.dir
            ? ((j.lowerAngle = -this.options.rotation),
              (j.upperAngle = -this.options.rotation + Math.PI / 2))
            : ((j.lowerAngle = -this.options.rotation - Math.PI / 2),
              (j.upperAngle = -this.options.rotation)),
          (j.enableLimit = true),
          (j.maxMotorTorque = 100),
          (j.enableMotor = true),
          (this.joint = this.game.physics.box2d.world.CreateJoint(j)),
          1 === this.options.properties.dir
            ? this.body.data.SetAngle(-this.joint.GetLowerLimit())
            : this.body.data.SetAngle(-this.joint.GetUpperLimit()),
          this.registerDevice(),
          this
        );
      }
      extend(RotMirror, BoxedDevice);
      RotMirror.prototype.options = {
        atlasName: null,
        frameName: null,
        lightAtlas: null,
        lightFrame: null,
        boxWidth: 1.8,
        boxHeight: 1.8,
        mirrorWidth: 2,
        mirrorHeight: 0.1,
      };
      RotMirror.prototype.sounds = function () {
        return ["platform"];
      };
      RotMirror.prototype.update = function () {
        return (
          this.joint.GetJointAngleRadians() < this.joint.GetLowerLimit() &&
            this.body.data.SetAngle(-this.joint.GetLowerLimit()),
          this.joint.GetJointAngleRadians() > this.joint.GetUpperLimit() &&
            this.body.data.SetAngle(-this.joint.GetUpperLimit()),
          RotMirror.__super__.update.apply(this, arguments)
        );
      };
      RotMirror.prototype.updateState = function (a) {
        if (0 === this.state) {
          if (
            (this.joint.SetMotorSpeed(-1.5 * this.options.properties.dir),
            null != this.sound && this.sound.stopInstance(),
            !a)
          )
            return (this.sound =
              this.game.level.sounds.platform.playInstance());
        } else if (
          (this.joint.SetMotorSpeed(1.5 * this.options.properties.dir),
          null != this.sound && this.sound.stopInstance(),
          !a)
        )
          return (this.sound = this.game.level.sounds.platform.playInstance());
      };
      RotMirror.prototype.checkState = function () {
        var a, b, c;
        return (
          (a = (function (a) {
            return function () {
              return a.options.properties.dir > 0
                ? -a.joint.GetJointAngleRadians()
                : a.joint.GetJointAngleRadians();
            };
          })(this)),
          (c = (function (a) {
            return function () {
              return a.options.properties.dir > 0
                ? -a.joint.GetLowerLimit()
                : a.joint.GetUpperLimit();
            };
          })(this)),
          (b = (function (a) {
            return function () {
              return a.options.properties.dir > 0
                ? -a.joint.GetUpperLimit()
                : a.joint.GetLowerLimit();
            };
          })(this)),
          null != this.sound && 0 === this.state && a() >= c()
            ? (this.game.level.sounds.platform.stopInstance(),
              (this.sound = null))
            : null != this.sound && 1 === this.state && a() <= b()
              ? (this.game.level.sounds.platform.stopInstance(),
                (this.sound = null))
              : void 0
        );
      };
      RotMirror.prototype.drawDarkMask = function (a) {
        var b, c;
        if (1 === this.state)
          return (
            (c = {
              x: this.base.x + a.offset.x,
              y: this.base.y + a.offset.y,
            }),
            (a.ctx.globalCompositeOperation = "lighter"),
            (b = a.ctx.createRadialGradient(c.x, c.y, 20, c.x, c.y, 160)),
            b.addColorStop(0, "rgba(255,255,255,1)"),
            b.addColorStop(0.5, "rgba(255,255,255,0.3)"),
            b.addColorStop(1, "transparent"),
            a.circle(c.x, c.y, 160, b)
          );
      };
      return RotMirror;
    });
  }.call(this),
  function () {
    define("States/Level/Devices/Slider", ["./Device"], function (Device) {
      "use strict";
      function Slider(b, c) {
        ((this.checkState = this.checkState.bind(this)),
          (this.sounds = this.sounds.bind(this)));
        var e, f, g, h, i, j, k, l, m, n, o, p;
        return (
          Slider.__super__.constructor.call(this, b, c),
          (o += this.game.physics.box2d.mpx(1)),
          (p -= this.game.physics.box2d.mpx(1)),
          (n = this.options.polyline[1][0] - this.options.polyline[0][0]),
          (this._width = n),
          (l = { x: this.options.x + n / 2, y: this.options.y }),
          (g = this.game.make.sprite(l.x, l.y, "MechAssets", "_default0000")),
          this.game.physics.box2d.enable(g),
          (h = this.game.make.sprite(0, 0, "MechAssets", "SliderDot0000")),
          h.anchor.set(0.5),
          g.addChild(h),
          (i = this.game.make.sprite(
            0,
            0,
            "MechAssets",
            "slider_light_off0000",
          )),
          i.anchor.set(0.5),
          g.addChild(i),
          this.game.layers.overChars.addChild(g),
          this.lights.push(i),
          (m = this.game.make.sprite(
            l.x,
            l.y,
            "MechAssets",
            "SliderTrack0000",
          )),
          m.anchor.set(0.5),
          (m.width = n),
          this.game.layers.underGround.addChild(m),
          g.body.clearFixtures(),
          (f = new box2d.b2CircleShape(0.3)),
          f.m_p.SetXY(0, 0),
          (j = new box2d.b2FixtureDef()),
          (j.shape = f),
          (j.friction = 0),
          g.body.data.CreateFixture(j),
          (e = new box2d.b2Vec2(-1, 0)),
          (k = new box2d.b2PrismaticJointDef()),
          k.Initialize(
            g.body.data,
            this.game.level.groundBody,
            g.body.data.GetWorldCenter(),
            e,
          ),
          (k.upperTranslation = -this.pxm(n / 2)),
          (k.lowerTranslation = this.pxm(n / 2)),
          (k.enableLimit = true),
          (k.motorSpeed = 0),
          (k.maxMotorForce = 20),
          (k.enableMotor = true),
          (this.joint = this.game.physics.box2d.world.CreateJoint(k)),
          g.body.data.SetLinearDamping(1),
          (this.signal = new Phaser.Signal()),
          this.registerDevice(),
          this
        );
      }
      extend(Slider, Device);
      Slider.prototype.options = { properties: { group: 0 } };
      Slider.prototype.sounds = function () {
        return "slider";
      };
      Slider.prototype.checkState = function () {
        if (this.joint.GetJointTranslation() !== this.state)
          return (
            (this.sound && this.sound.isPlaying) ||
              (this.sound = this.game.level.sounds.slider.play()),
            (this.state =
              (Math.PI *
                this.joint.GetJointTranslation() *
                (this.options.properties.max || 1)) /
              this.pxm(-this._width)),
            this.signal.dispatch(this)
          );
      };
      return Slider;
    });
  }.call(this),
  function () {
    define("States/Level/Devices/Snow", ["Phaser"], function () {
      "use strict";
      function Snow(b, c, e) {
        ((this.drawTile = this.drawTile.bind(this)),
          (this.createSnowGraphics = this.createSnowGraphics.bind(this)));
        var f, g, h, i, j, k, l, m;
        return (
          (this.ground = c),
          (this.options = {}),
          (this.options.data = e),
          "SW" === e.dir
            ? ((i = e.length * Math.sqrt(2)),
              (this.options.y = e.x + e.length / 2),
              (this.options.x = e.y + e.length / 2))
            : "SE" === e.dir
              ? ((i = e.length * Math.sqrt(2)),
                (this.options.y = e.x + e.length / 2),
                (this.options.x = e.y - e.length / 2 + 1))
              : "WE" === e.dir &&
                ((i = e.length),
                (this.options.y = e.x),
                (this.options.x = e.y + e.length / 2)),
          Snow.__super__.constructor.call(
            this,
            b,
            this.options.x,
            this.options.y,
          ),
          this.game.add.existing(this),
          this.game.layers.liquids.addChild(this),
          this.game.physics.box2d.enable(this),
          this.body.clearFixtures(),
          (this.body.mass = 0),
          this.body.data.SetPosition(
            new box2d.b2Vec2(-this.options.x, -this.options.y),
          ),
          "SW" === e.dir
            ? (f = Math.PI / 4)
            : "SE" === e.dir
              ? (f = -Math.PI / 4)
              : "WE" === e.dir && (f = 0),
          this.body.data.SetAngle(f),
          (k = new box2d.b2PolygonShape()),
          (m = []),
          (l = i - 0.1),
          (j = 0.4),
          m.push(new box2d.b2Vec2(-l / 2 + 0, 0.01)),
          m.push(new box2d.b2Vec2(l / 2 - 0, 0.01)),
          m.push(new box2d.b2Vec2(l / 2 - 0.3, 0 - j + 0.01)),
          m.push(new box2d.b2Vec2(-l / 2 + 0.3, 0 - j + 0.01)),
          k.Set(m),
          (h = new box2d.b2FixtureDef()),
          (h.shape = k),
          (h.filter.categoryBits = 1),
          (h.filter.maskBits = 16),
          (h.friction = 1),
          (h.userData = { type: "ice" }),
          (g = this.iceFixture = this.body.data.CreateFixture(h)),
          (g.id = this.body.world.getNextFixtureId()),
          this.body.setFixtureContactCallback(
            this.iceFixture,
            (function (a) {
              return function (a, b, c, d, e, f) {
                var g;
                if (
                  (null != b.sprite.character && "feet" === d.m_userData) ||
                  (null != a.sprite.character && "feet" === c.m_userData)
                )
                  return (
                    (g = b.sprite.character || a.sprite.character),
                    e
                      ? (g.snowCount || (g.snowCount = 0), (g.snowCount += 1))
                      : (g.snowCount || (g.snowCount = 0), (g.snowCount -= 1)),
                    g.setOnIce(0 !== g.snowCount)
                  );
              };
            })(),
          ),
          this.createSnowGraphics(),
          this
        );
      }
      extend(Snow, Phaser.Sprite);
      Snow.prototype.createSnowGraphics = function () {
        var a, b, c, d, e, f, g, h;
        for (
          d = [], e = a = 0, c = this.options.data.length - 1;
          0 <= c ? a <= c : a >= c;
          e = 0 <= c ? ++a : --a
        )
          ((b = 1),
            "SW" === this.options.data.dir
              ? ((g =
                  this.game.physics.box2d.mpx(1) *
                  (this.options.x - this.options.data.length / 2 + e * b)),
                (h =
                  this.game.physics.box2d.mpx(1) *
                  (this.options.y - this.options.data.length / 2 + e * b)),
                (f = "SnowSlope0000"))
              : "SE" === this.options.data.dir
                ? ((g =
                    this.game.physics.box2d.mpx(1) *
                    (this.options.x +
                      this.options.data.length / 2 -
                      1 -
                      e * b)),
                  (h =
                    this.game.physics.box2d.mpx(1) *
                    (this.options.y - this.options.data.length / 2 + e * b)),
                  (f = "SnowSlope0001"))
                : "WE" === this.options.data.dir &&
                  ((g =
                    this.game.physics.box2d.mpx(1) *
                    (this.options.x - this.options.data.length / 2 + e)),
                  (h = this.game.physics.box2d.mpx(1) * this.options.y),
                  (f = "SnowFlat0000")),
            d.push(this.drawTile(g, h, f)));
        return d;
      };
      Snow.prototype.drawTile = function (a, b, c, d) {
        var e, f;
        return (
          (e = this.game.cache.getFrameByName("GroundAssets", c)),
          (f = this.game.cache.getImage("GroundAssets")),
          (a = a - (e.width - 32) / 2 + 32),
          (b = b - (e.height - 32) / 2 + 32),
          this.ground.bmd.ctx.drawImage(
            f,
            e.x,
            e.y,
            e.width,
            e.height,
            a,
            b,
            e.width,
            e.height,
          )
        );
      };
      return Snow;
    });
  }.call(this),
  function () {
    define("States/Level/Devices/TimedPusher", ["./Pusher"], function (Pusher) {
      "use strict";
      function TimedPusher(b, c) {
        ((this.drawDarkMask = this.drawDarkMask.bind(this)),
          (this.ocupy = this.ocupy.bind(this)),
          (this.checkState = this.checkState.bind(this)),
          (this.doRegister = this.doRegister.bind(this)),
          (this.destroy = this.destroy.bind(this)),
          (this.sounds = this.sounds.bind(this)));
        var e, f, g;
        (TimedPusher.__super__.constructor.call(this, b, c),
          (f = this.game.make.sprite(
            0,
            0,
            "MechAssets",
            "timed_pusher_base0000",
          )),
          f.anchor.set(0.5),
          this.base.addChild(f),
          (g = this.game.make.sprite(
            0,
            0,
            "MechAssets",
            "timed_pusher_light_off0000",
          )),
          g.anchor.set(0.5),
          this.base.addChild(g),
          (g.offFrameName = "timed_pusher_light_off0000"),
          (g.onFrameName = "timed_pusher_light_off0000"),
          this.lights.push(g),
          (this.baseLight = e =
            this.game.make.sprite(
              0,
              0,
              "MechAssets",
              "timed_pusher_light_off0000",
            )),
          e.anchor.set(0.5),
          this.base.addChild(e),
          (e.offFrameName = "timed_pusher_light_off0000"),
          (e.onFrameName = "timed_pusher_light_on0000"),
          (e.cacheAsBitmap = true),
          this.lights.push(e),
          (this.clock = this.game.make.graphics(0, 27)),
          (this.clock.cacheAsBitmap = true),
          this.registerDevice(),
          (this.downState = 0));
      }
      extend(TimedPusher, Pusher);
      TimedPusher.prototype.timer = null;
      TimedPusher.prototype.sounds = function () {
        return ["pusher", "clock"];
      };
      TimedPusher.prototype.destroy = function () {
        return (
          null != this.sound && this.sound.stop(),
          TimedPusher.__super__.destroy.apply(this, arguments)
        );
      };
      TimedPusher.prototype.doRegister = function () {};
      TimedPusher.prototype.checkState = function () {
        var a, b, c, d, e, f, g, h;
        if (
          ((f = this.joint.GetJointTranslation()),
          0 === this.downState && f > 0
            ? ((this.downState = 1),
              this.game.level.sounds.pusher.play(),
              null != this.sound && this.sound.isPlaying && this.sound.stop())
            : 1 === this.downState &&
              f <= 0 &&
              ((this.downState = 0),
              this.game.level.sounds.pusher.play(),
              null != this.sound && this.sound.isPlaying && this.sound.stop()),
          f > 0
            ? ((this.state = 1),
              this.signal.dispatch(this),
              null == this.timer &&
                ((this.timer = this.game.time.create(true)),
                this.timer.add(
                  this.options.properties.time,
                  (function (a) {
                    return function () {
                      return (
                        (a.state = 0),
                        a.game.level.sounds.pusher.play(),
                        a.signal.dispatch(a),
                        (a.timer = null)
                      );
                    };
                  })(this),
                )),
              this.timer.stop(false),
              this.timer.start())
            : !this.timer &&
              1 === this.state &&
              f <= 0 &&
              ((this.state = 0), this.signal.dispatch(this)),
          1 === this.state)
        ) {
          if (
            (null == this.baseLight.mask &&
              (this.base.addChild(this.clock),
              (this.baseLight.mask = this.clock)),
            0 !== this.downState ||
              (null != this.sound && this.sound.isPlaying) ||
              ((d = 22796),
              (this.sound = this.game.level.sounds.clock.play(
                null,
                (d - this.options.properties.time) / 1e3,
              ))),
            (a = 0),
            (b = 0),
            (g = 20),
            (c = Math.max(
              0,
              Math.min(1, 1 - this.timer.ms / this.options.properties.time),
            )),
            (c = Math.ceil(12 * c) / 12),
            (h = -2 * Math.PI * c - Math.PI / 2),
            (e = -Math.PI / 2),
            console.log(
              "angling " +
                this.timer.ms +
                " " +
                this.options.properties.time +
                " " +
                (1 - this.timer.ms / this.options.properties.time),
            ),
            this.lastDrawnAngle !== h)
          )
            return (
              this.clock.clear(),
              this.clock.beginFill(16777215, 1),
              this.clock.moveTo(a, b),
              this.clock.arc(a, b, g, h, e),
              this.clock.lineTo(a, b),
              (this.clock.cacheAsBitmap = true),
              (this.lastDrawnAngle = h)
            );
        } else if (this.lastDrawnAngle)
          return (
            this.base.removeChild(this.clock),
            (this.baseLight.mask = null),
            (this.lastDrawnAngle = null)
          );
      };
      TimedPusher.prototype.ocupy = function (a) {
        var b, c;
        return (
          (b = this.options.x / 32),
          (c = this.options.y / 32),
          this.ocupyTile(a, b, c),
          this.ocupyTile(a, b - 1, c),
          this.ocupyTile(a, b - 2, c),
          this.ocupyTile(a, b + 1, c),
          this.ocupyTile(a, b, c - 1),
          this.ocupyTile(a, b - 1, c - 1),
          this.ocupyTile(a, b - 2, c - 1),
          this.ocupyTile(a, b + 1, c - 1)
        );
      };
      TimedPusher.prototype.drawDarkMask = function (a) {
        var b, c;
        if (1 === this.state)
          return (
            (a.ctx.globalCompositeOperation = "lighter"),
            (c = {
              x: this.options.x + a.offset.x,
              y: this.options.y + a.offset.y + 12,
            }),
            (b = a.ctx.createRadialGradient(c.x, c.y, 20, c.x, c.y, 80)),
            b.addColorStop(0, "rgba(255,255,255,1)"),
            b.addColorStop(0.5, "rgba(255,255,255,0.2)"),
            b.addColorStop(1, "transparent"),
            a.circle(c.x, c.y, 90, b)
          );
      };
      return TimedPusher;
    });
  }.call(this),
  function () {
    define("States/Level/Devices/Wind", ["./BoxedDevice"], function (
      BoxedDevice,
    ) {
      "use strict";
      function Wind(b, c) {
        ((this.drawDarkMask = this.drawDarkMask.bind(this)),
          (this.ocupy = this.ocupy.bind(this)),
          (this.updateState = this.updateState.bind(this)),
          (this.update = this.update.bind(this)),
          (this.destroy = this.destroy.bind(this)),
          (this.sounds = this.sounds.bind(this)));
        var e, f, g, h, i, j, k, l;
        (c.rotation || (c.rotation = 0),
          (c.rotation += 90),
          Wind.__super__.constructor.call(this, b, c),
          this.sprite.anchor.set(0.5),
          (i = new box2d.b2PolygonShape()),
          this.options.properties.flat
            ? i.SetAsOrientedBox(
                this.options.boxWidth / 2,
                this.options.boxHeight / 2,
                new box2d.b2Vec2(0, 0.3),
                0,
              )
            : ((j = []),
              j.push(new box2d.b2Vec2(-this.options.boxWidth / 2 - 0.6, 0)),
              j.push(new box2d.b2Vec2(this.options.boxWidth / 2 + 0.6, 0)),
              j.push(
                new box2d.b2Vec2(
                  this.options.boxWidth / 2,
                  this.options.boxHeight,
                ),
              ),
              j.push(
                new box2d.b2Vec2(
                  -this.options.boxWidth / 2,
                  this.options.boxHeight,
                ),
              ),
              i.Set(j)),
          (f = new box2d.b2FixtureDef()),
          (f.shape = i),
          (f.friction = 0.4),
          (f.restitution = 0),
          (f.density = 0.2),
          (g = new box2d.b2Vec2(0, 0)),
          (g = g.SelfRotateRadians(this.options.rotation || 0)),
          (e = this.body.data.CreateFixture(f)),
          (e.id = this.body.world.getNextFixtureId()),
          (this.body.mass = 0),
          (l =
            null != this.options.properties.windWidth
              ? this.options.properties.windWidth
              : this.options.windWidth),
          (h = new box2d.b2PolygonShape()),
          h.SetAsOrientedBox(
            l / 2,
            this.options.properties.length / 2,
            new box2d.b2Vec2(0, this.options.properties.length / 2 + 0.5),
            0,
          ),
          (f = new box2d.b2FixtureDef()),
          (f.shape = h),
          (f.isSensor = true),
          (f.userData = { lightProperties: { type: "transparent" } }),
          (this.windSensor = this.body.data.CreateFixture(f)),
          (this.windSensor.id = this.body.world.getNextFixtureId()),
          (this.body.mass = 0),
          (this.activeBodies = {}),
          this.body.setFixtureContactCallback(
            this.windSensor,
            (function (a) {
              return function (b, c, d, e, f, g) {
                var h;
                if (null != c.sprite.character) {
                  if (!f && null != a.activeBodies[c.id])
                    return delete a.activeBodies[c.id];
                  if (f && null == a.activeBodies[c.id])
                    return ((h = { body: c }), (a.activeBodies[c.id] = h));
                }
              };
            })(this),
          ),
          this.sprite.animations.add(
            "loop",
            Phaser.Animation.generateFrameNames("wind_base", 0, 4, "", 4),
            30,
            true,
          ),
          (k = this.windEffect =
            this.game.make.sprite(
              this.options.x - b.physics.box2d.mpx(g.x),
              this.options.y - b.physics.box2d.mpx(g.y),
              "MechAssets",
            )),
          (k.anchor.y = 1),
          (k.anchor.x = 0.5),
          k.animations.add(
            "loop",
            Phaser.Animation.generateFrameNames("wind_effect", 0, 30, "", 4),
            30,
            true,
          ),
          k.animations.play("loop"),
          k.animations.next(Math.floor(30 * Math.random())),
          (k.height = b.physics.box2d.mpx(this.options.properties.length)),
          (k.rotation = this.options.rotation || 0),
          (k.visible = false),
          this.game.layers.overChars.addChild(k),
          this.registerDevice());
      }
      extend(Wind, BoxedDevice);
      Wind.prototype.options = {
        boxWidth: 2.5,
        boxHeight: 0.6,
        windWidth: 2.6,
        windHeight: 10,
        atlasName: "MechAssets",
        frameName: "wind_base0000",
        lightAtlas: "MechAssets",
        lightFrame: "wind_base_light",
        layer: "liquids",
      };
      Wind.prototype.boxSize = { x: -3, y: 2 };
      Wind.prototype.sounds = function () {
        return "wind";
      };
      Wind.prototype.destroy = function () {
        return (
          null != this.sound && this.sound.stopInstance(),
          Wind.__super__.destroy.apply(this, arguments)
        );
      };
      Wind.prototype.update = function () {
        var a, b, c, d, e, f, g;
        if (
          1 ===
          (this.options.properties.invertInput ? +!this.state : this.state)
        ) {
          ((e = this.activeBodies), (f = []));
          for (c in e)
            ((d = e[c]),
              (b = new box2d.b2Vec2(0, 1)),
              (b = b.SelfRotateRadians(this.options.rotation || 0)),
              (a = d.body.data
                .GetPosition()
                .SelfSub(this.body.data.GetPosition())),
              b
                .SelfMul(1.2 + 0.2 * Math.sin(this.game.time.now / 1e3))
                .SelfMul(100)
                .SelfMul(1 - a.GetLength() / this.options.properties.length),
              d.body.data.ApplyForce(b, new box2d.b2Vec2(0, 0)),
              d.body.data.SetLinearVelocity(
                d.body.data.GetLinearVelocity().SelfMul(0.975),
              ),
              (g = d.body.data.GetLinearVelocity().GetLength()),
              f.push(
                d.body.data.SetLinearVelocity(
                  d.body.data
                    .GetLinearVelocity()
                    .SelfNormalize()
                    .SelfMul(Math.min(g, 15)),
                ),
              ));
          return f;
        }
      };
      Wind.prototype.updateState = function () {
        var a;
        return (
          this.running || (this.running = false),
          (a = this.options.properties.invertInput ? +!this.state : this.state),
          1 === a && false === this.windEffect.visible
            ? ((this.windEffect.visible = true),
              this.sprite.animations.play("loop"),
              (this.running = true),
              (this.game.level.sounds.wind.loop = true),
              (this.sound = this.game.level.sounds.wind.playInstance()),
              (this.sound.volume = 0.2))
            : 0 === a && true === this.windEffect.visible
              ? ((this.windEffect.visible = false),
                null != this.sound &&
                  (this.sound.stopInstance(), (this.sound = null)),
                _.delay(
                  (function (a) {
                    return function () {
                      return (
                        a.sprite.animations.stop(),
                        (a.sprite.frameName = "wind_base0000")
                      );
                    };
                  })(this),
                  400,
                ))
              : void 0
        );
      };
      Wind.prototype.ocupy = function (a) {
        var b, c;
        return (
          (b = this.options.x / 32),
          (c = this.options.y / 32),
          this.ocupyTile(a, b - 1, c),
          this.ocupyTile(a, b - 1, c - 1),
          this.ocupyTile(a, b, c),
          this.ocupyTile(a, b, c - 1),
          this.ocupyTile(a, b - 2, c),
          this.ocupyTile(a, b - 2, c - 1)
        );
      };
      Wind.prototype.drawDarkMask = function (a) {
        var b, c, d, e;
        if (1 === this.state)
          return (
            (a.ctx.globalCompositeOperation = "lighter"),
            (e = {
              x: this.sprite.x + a.offset.x,
              y: this.sprite.y + a.offset.y,
            }),
            (b = new box2d.b2Vec2(36, 0).SelfRotateRadians(
              this.options.rotation,
            )),
            (c = new box2d.b2Vec2(-36, 0).SelfRotateRadians(
              this.options.rotation,
            )),
            (d = a.ctx.createRadialGradient(
              e.x + b.x,
              e.y + b.y,
              20,
              e.x + b.x,
              e.y + b.y,
              90,
            )),
            d.addColorStop(0, "rgba(255,255,255,1)"),
            d.addColorStop(0.5, "rgba(255,255,255,0.3)"),
            d.addColorStop(1, "transparent"),
            a.circle(e.x + b.x, e.y + b.y, 90, d),
            (d = a.ctx.createRadialGradient(
              e.x + c.x,
              e.y + c.y,
              20,
              e.x + c.x,
              e.y + c.y,
              90,
            )),
            d.addColorStop(0, "rgba(255,255,255,1)"),
            d.addColorStop(0.5, "rgba(255,255,255,0.3)"),
            d.addColorStop(1, "transparent"),
            a.circle(e.x + c.x, e.y + c.y, 90, d)
          );
      };
      return Wind;
    });
  }.call(this),
  function () {
    define("States/Level/Devices/Window", ["./Device"], function (Device) {
      "use strict";
      function Window(a, b) {
        var d, e, f, g, h, i, j;
        (b.width < b.height
          ? ((j = b.width),
            (b.width = b.height),
            (b.height = j),
            (b.x = b.x + b.height / 2),
            (b.y = b.y + b.width / 2),
            (b.rotation = -90))
          : ((b.x = b.x + b.width / 2), (b.y = b.y + b.height / 2)),
          Window.__super__.constructor.call(this, a, b),
          (this.sprite = this.game.make.sprite(
            this.options.x,
            this.options.y,
            "MechAssets",
            "_default0000",
          )),
          this.game.physics.box2d.enable(this.sprite),
          this.game.layers.overGround.addChild(this.sprite),
          (this.body = this.sprite.body),
          this.body.clearFixtures(),
          this.body.data.SetAngle(this.options.rotation),
          (this.body.static = true),
          (h = new box2d.b2PolygonShape()),
          h.SetAsOrientedBox(
            this.options.width / 2,
            this.options.height / 2,
            new box2d.b2Vec2(0, 0),
            0,
          ),
          (f = new box2d.b2FixtureDef()),
          (f.shape = h),
          (f.friction = 0.7),
          (f.restitution = 0),
          (f.density = 0),
          (f.userData = f.userData =
            { lightProperties: { type: "transparent" } }),
          (f.filter.categoryBits = 1),
          (f.filter.maskBits = 61695),
          (e = this.body.data.CreateFixture(f)),
          (e.id = this.body.world.getNextFixtureId()),
          new box2d.b2Vec2(
            this.options.properties.dx,
            this.options.properties.dy,
          ),
          (this.state = 0),
          this.registerDevice(),
          (g = this.game.make.sprite(0, 0, "MechAssets", "WindowLeft0000")),
          g.anchor.set(0.5),
          this.sprite.addChild(g),
          (g.x = this.mpx(this.options.width / 2 - 0.5)),
          (g.y = this.mpx(this.options.height / 2 - 0.5)),
          (i = this.game.make.sprite(0, 0, "MechAssets", "WindowRight0000")),
          i.anchor.set(0.5),
          this.sprite.addChild(i),
          (i.x = -this.mpx(this.options.width / 2 - 0.5)),
          (i.y = this.mpx(this.options.height / 2 - 0.5)),
          (d = this.game.make.sprite(0, 0, "MechAssets", "WindowCenter0000")),
          d.anchor.set(0.5),
          this.sprite.addChild(d),
          (d.x = 0),
          (d.y = 0),
          (d.scale.x = (this.options.width - 2) / 3),
          (this.sprite.scale.x = 1.05),
          (this.sprite.scale.y = 1.05));
      }
      extend(Window, Device);
      Window.prototype.options = {
        atlasName: null,
        frameName: null,
        lightAtlas: "MechAssets",
        properties: { group: 0, dx: 4, dy: 0 },
      };
      return Window;
    });
  }.call(this),
  function () {
    define("States/Level/Devices/_define", [
      "require",
      "./BackgroundCover",
      "./Ball",
      "./Beamer",
      "./Box",
      "./BoxedDevice",
      "./BoxHeavy",
      "./BoxMirror",
      "./BoxPrototype",
      "./Device",
      "./Diamond",
      "./Door",
      "./Hanging",
      "./InfiniteMirror",
      "./Lever",
      "./LightPusher",
      "./Liquid",
      "./MovingPlatform",
      "./Portal",
      "./Pulley",
      "./Pusher",
      "./Roman",
      "./RotMirror",
      "./Slider",
      "./Snow",
      "./TimedPusher",
      "./Wind",
      "./Window",
    ], function (require) {
      "use strict";
      window.Devices = {
        BackgroundCover: require("./BackgroundCover"),
        Ball: require("./Ball"),
        Beamer: require("./Beamer"),
        Box: require("./Box"),
        BoxedDevice: require("./BoxedDevice"),
        BoxHeavy: require("./BoxHeavy"),
        BoxMirror: require("./BoxMirror"),
        BoxPrototype: require("./BoxPrototype"),
        Device: require("./Device"),
        Diamond: require("./Diamond"),
        Door: require("./Door"),
        Hanging: require("./Hanging"),
        InfiniteMirror: require("./InfiniteMirror"),
        Lever: require("./Lever"),
        LightPusher: require("./LightPusher"),
        Liquid: require("./Liquid"),
        MovingPlatform: require("./MovingPlatform"),
        Portal: require("./Portal"),
        Pulley: require("./Pulley"),
        Pusher: require("./Pusher"),
        Roman: require("./Roman"),
        RotMirror: require("./RotMirror"),
        Slider: require("./Slider"),
        Snow: require("./Snow"),
        TimedPusher: require("./TimedPusher"),
        Wind: require("./Wind"),
        Window: require("./Window"),
      };
      return window.Devices;
    });
  }.call(this),
  function () {
    define("States/Level/Ground", [
      "./Devices/Liquid",
      "./Devices/Snow",
      "outlineFilter",
      "inlineFilter",
      "shadowFilter",
      "seedrandom",
    ], function (
      Liquid,
      Snow,
      OutlineFilter,
      InlineFilter,
      ShadowFilter,
      seedrandom,
    ) {
      "use strict";
      function Ground(b, c, d) {
        ((this.CreateLiquid = this.CreateLiquid.bind(this)),
          (this.CreateSnow = this.CreateSnow.bind(this)),
          (this.CreateSnows = this.CreateSnows.bind(this)),
          (this.createGroundFixture = this.createGroundFixture.bind(this)),
          (this.destroy = this.destroy.bind(this)),
          (this.drawForeground = this.drawForeground.bind(this)),
          (this.decorate = this.decorate.bind(this)),
          (this.getNaviesPoints = this.getNaviesPoints.bind(this)),
          (this.getTileAt = this.getTileAt.bind(this)),
          (this.drawTile = this.drawTile.bind(this)));
        ((this.options = _.extend(this.options, d)),
          Ground.__super__.constructor.call(this, b),
          this.game.physics.box2d.enable(this),
          (this.body.mass = 0),
          this.body.clearFixtures(),
          (this.mapData = c),
          (this.options.width = this.mapData.width * this.mapData.tileWidth),
          (this.options.height = this.mapData.height * this.mapData.tileHeight),
          this.convertTilemap(this.mapData),
          this.CreateSnows(this.mapData),
          (Phaser.Physics.Box2D.worldBoundsFilterCategory = 65535),
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
          ),
          this.drawForeground(),
          this.applyFilter());
      }
      extend(Ground, Phaser.Sprite);
      Ground.prototype.filterPadding = 10;
      Ground.prototype.options = {
        tileWidth: 32,
        tileHeight: 32,
        key: "map",
      };
      Ground.prototype.getTileRight = function (a, b, c) {
        return null != a.data[c] && null != a.data[c][b + 1]
          ? a.data[c][b + 1]
          : null;
      };
      Ground.prototype.getTileLeft = function (a, b, c) {
        return null != a.data[c] && null != a.data[c][b - 1]
          ? a.data[c][b - 1]
          : null;
      };
      Ground.prototype.getTileUp = function (a, b, c) {
        return null != a.data[c - 1] && null != a.data[c - 1][b]
          ? a.data[c - 1][b]
          : null;
      };
      Ground.prototype.getTileDown = function (a, b, c) {
        return null != a.data[c + 1] && null != a.data[c + 1][b]
          ? a.data[c + 1][b]
          : null;
      };
      Ground.prototype.drawTile = function (a, b, c, d) {
        var e, f, g, h;
        return (
          10 === d && (d = 0),
          11 === d && (d = 1),
          12 === d && (d = 2),
          55 === d && (d = 5),
          0 === d
            ? ((h = Math.floor(4 * Math.random())), (g = "MaskBox0000" + h))
            : (g = "MaskBox" + d + "0000"),
          (e = this.game.cache.getFrameByName("GroundAssets", g)),
          (f = this.game.cache.getImage("GroundAssets")),
          (b = b - (e.width - 32) / 2 + 32),
          (c = c - (e.height - 32) / 2 + 32),
          a.drawImage(f, e.x, e.y, e.width, e.height, b, c, e.width, e.height)
        );
      };
      Ground.prototype.getTileAt = function (a, b) {
        return this.mapData.layers[0].data[b][a];
      };
      Ground.prototype.convertTilemap = function (a) {
        var b,
          c,
          d,
          e,
          f,
          g,
          h,
          i,
          j,
          k,
          l,
          m,
          n,
          o,
          p,
          q,
          r,
          s,
          t,
          u,
          v,
          w,
          x,
          y,
          z,
          A,
          B,
          C;
        for (
          m = 0,
            this.map = a,
            A = 0,
            v = 0,
            w = 0,
            C = 0,
            this.h = h = a.height,
            this.w = z = a.width,
            this.groundBody = c = this.body,
            this.groundBody.data.m_userData = "ground",
            this.game.level.groundBody = this.groundBody.data,
            n = this.game.add.bitmapData(
              this.options.width + 64,
              this.options.height + 64,
            );
          C < h;
        ) {
          for (A = 0, B = 0; B < z; )
            ((x = a.layers[m].data[C][B]),
              x &&
                x.index > -1 &&
                ((d = B * this.options.tileWidth),
                (e = C * this.options.tileHeight),
                0 === x.properties.type
                  ? (0 === A &&
                      ((v = B * x.width), (w = C * x.height), (A = 1)),
                    (r = this.getTileRight(a.layers[m], B, C)),
                    r && 0 === r.properties.type
                      ? ((A += 1),
                        this.drawTile(n.ctx, d, e, x.properties.type))
                      : ((t = new box2d.b2PolygonShape()),
                        (y = []),
                        (u = this.groundBody.world.pxm(c.world.mpx(1) * A)),
                        (s = this.groundBody.world.pxm(c.world.mpx(1))),
                        y.push(new box2d.b2Vec2(0, 0)),
                        y.push(new box2d.b2Vec2(-u, 0)),
                        y.push(new box2d.b2Vec2(-u, -s)),
                        y.push(new box2d.b2Vec2(0, -s)),
                        _.each(y, function (a) {
                          return (
                            (a.x -= c.world.pxm(v)),
                            (a.y -= c.world.pxm(w))
                          );
                        }),
                        t.Set(y),
                        (A = 0),
                        this.createGroundFixture(t),
                        this.drawTile(n.ctx, d, e, x.properties.type)))
                  : 5 === x.properties.type ||
                      6 === x.properties.type ||
                      7 === x.properties.type ||
                      55 === x.properties.type
                    ? (0 === A &&
                        ((v = B * x.width), (w = C * x.height), (A = 1)),
                      (r = this.getTileRight(a.layers[m], B, C)),
                      r && r.properties.type === x.properties.type
                        ? (A > 1 &&
                            this.drawTile(n.ctx, d, e, x.properties.type),
                          (A += 1))
                        : ((t = this.createGroundShape(
                            8,
                            new box2d.b2Vec2(
                              c.world.pxm(d) - A + 1,
                              c.world.pxm(e),
                            ),
                          )),
                          this.createGroundFixture(t),
                          this.drawTile(n.ctx, d - c.world.mpx(A - 1), e, 8),
                          (t = this.createGroundShape(
                            9,
                            new box2d.b2Vec2(c.world.pxm(d), c.world.pxm(e)),
                          )),
                          this.createGroundFixture(t),
                          this.drawTile(n.ctx, d, e, 9),
                          (t = new box2d.b2PolygonShape()),
                          (y = []),
                          (u = this.groundBody.world.pxm(c.world.mpx(1) * A)),
                          (s = this.groundBody.world.pxm(c.world.mpx(1))),
                          y.push(new box2d.b2Vec2(-1, -s / 2 + 0.05)),
                          y.push(new box2d.b2Vec2(1 - u, -s / 2 + 0.05)),
                          y.push(new box2d.b2Vec2(1 - u, -s)),
                          y.push(new box2d.b2Vec2(-1, -s)),
                          _.each(y, function (a) {
                            return (
                              (a.x -= c.world.pxm(v)),
                              (a.y -= c.world.pxm(w))
                            );
                          }),
                          t.Set(y),
                          this.createGroundFixture(t),
                          this.CreateLiquid(x.properties.type, B + 1, C, A),
                          (A = 0)))
                    : -1 === x.properties.type
                      ? this.drawTile(n.ctx, d, e, 0)
                      : ((t = this.createGroundShape(
                          x.properties.type,
                          new box2d.b2Vec2(c.world.pxm(d), c.world.pxm(e)),
                        )),
                        this.createGroundFixture(t),
                        this.drawTile(n.ctx, d, e, x.properties.type))),
              B++);
          C++;
        }
        for (
          f = this.game.make.bitmapData(
            this.options.width + 64,
            this.options.height + 64,
          ),
            g = this.game.cache.getFrameByName(
              "TempleAssets",
              "ForeGround0000",
            ),
            j = this.game.cache.getImage("TempleAssets"),
            i = l = 0,
            p = Math.ceil(this.options.width / 256);
          0 <= p ? l <= p : l >= p;
          i = 0 <= p ? ++l : --l
        )
          for (
            k = o = 0, q = Math.ceil(this.options.height / 256);
            0 <= q ? o <= q : o >= q;
            k = 0 <= q ? ++o : --o
          )
            ((B = 256 * i),
              (C = 256 * k),
              f.ctx.drawImage(
                j,
                g.x,
                g.y,
                g.width,
                g.height,
                B,
                C,
                g.width,
                g.height,
              ));
        return (
          (b = this.game.add.bitmapData(
            this.options.width + 64,
            this.options.height + 64,
          )),
          b.alphaMask(f, n),
          (this.bmd = b),
          (this.maskBmd = n),
          (this.foregroundBmd = f),
          c
        );
      };
      Ground.prototype.getNaviesPoints = function () {
        var a, b, c, d, f, g, h, i, j, k, l, m;
        for (
          i = this.map,
            d = this.h,
            m = this.w,
            g = 0,
            b = this.groundBody,
            this.rng = seedrandom("ASDFA"),
            (function (a) {
              return function () {
                return Math.round(3 * a.rng() + 3.5);
              };
            })(this),
            j = (function (a) {
              return function (a, b) {
                return null != i.layers[g].data[a] &&
                  null != i.layers[g].data[a][b]
                  ? i.layers[g].data[a][b]
                  : null;
              };
            })(),
            l = [
              { x: Math.floor(d / 4), y: Math.floor(d / 4) },
              { x: Math.floor((3 * d) / 4), y: Math.floor(d / 4) },
              { x: Math.floor(d / 4), y: Math.floor((3 * d) / 4) },
              { x: Math.floor((3 * d) / 4), y: Math.floor(d / 4) },
            ],
            a = (function (a) {
              return function (a) {
                return a > 0 ? 1 : a < 0 ? -1 : 0;
              };
            })(),
            f = 0,
            h = l.length;
          f < h;
          f++
        )
          for (
            k = l[f],
              k.valid = false,
              c = { x: a(Math.random() - 0.5), y: a(Math.random() - 0.5) };
            k.x > 0 && k.x < m && k.y > 0 && k.y < d;
          ) {
            if (null == j(k.y, k.x).properties.type) {
              k.valid = true;
              break;
            }
            ((k.x += c.x), (k.y += c.y));
          }
        return (
          (l = l.filter(function (a) {
            return a.valid;
          })),
          _.each(l, function (a) {
            return ((a.x *= b.world.mpx(1)), (a.y *= b.world.mpx(1)));
          }),
          l
        );
      };
      Ground.prototype.decorate = function (a) {
        var b,
          c,
          d,
          f,
          g,
          h,
          i,
          j,
          k,
          l,
          m,
          n,
          o,
          p,
          q,
          r,
          s,
          t,
          u,
          v,
          w,
          x,
          y,
          z,
          A,
          B,
          C,
          D,
          E,
          F,
          G,
          H,
          I,
          J;
        for (
          s = this.map,
            k = this.h,
            H = this.w,
            o = 0,
            c = this.groundBody,
            this.rng = seedrandom("ASDFA"),
            z = (function (a) {
              return function () {
                return Math.round(3 * a.rng() + 3.5);
              };
            })(this),
            n = 0,
            q = a.length;
          n < q;
          n++
        )
          ((v = a[n]), null != v.ocupy && v.ocupy(s.layers[o].data));
        for (
          t = (function (a) {
            return function (a, b) {
              return null != s.layers[o].data[a] &&
                null != s.layers[o].data[a][b]
                ? s.layers[o].data[a][b]
                : null;
            };
          })(),
            J = 1,
            f = [],
            g = new Phaser.RenderTexture(
              this.game,
              this.options.width + 64,
              this.options.height + 64,
              "decosTexture",
              void 0,
              1,
            );
          J < k;
        ) {
          for (0, I = 1; I < H - 1; ) {
            for (F = s.layers[o].data[J][I], l = x = 0; x <= 6; l = ++x) {
              for (j = null, m = y = 0; y <= 6; m = ++y)
                if (
                  ((h = Math.max(Math.min(I + l, H - 2), 0)),
                  (i = Math.max(Math.min(J + m, k - 1), 0)),
                  null != t(i, h).properties.type &&
                    !t(i, h).ocupied &&
                    f.indexOf(t(i, h)) < 0 &&
                    f.indexOf(t(i - 1, h)) < 0 &&
                    f.indexOf(t(i, h + 1)) < 0 &&
                    f.indexOf(t(i - 1, h + 1)) < 0 &&
                    f.indexOf(t(i, h - 1)) < 0 &&
                    f.indexOf(t(i - 1, h - 1)) < 0)
                ) {
                  ((j = s.layers[o].data[i][h]), f.push(j));
                  break;
                }
              if (null != j) break;
            }
            I += z();
          }
          J += z();
        }
        for (w = 0, l = E = 0, r = f.length; E < r; l = ++E)
          ((d = f[l]),
            (F = s.layers[o].data[d.y][d.x]),
            (b = this.getTileUp(s.layers[o], d.x, d.y)),
            (A = this.getTileRight(s.layers[o], d.x, d.y)),
            (p = this.getTileLeft(s.layers[o], d.x, d.y)),
            (G = null),
            (B = 0),
            (C = [1, 1]),
            (u = 1),
            0 === F.properties.type &&
            null != b &&
            null != b.properties.type &&
            null != A &&
            null != A.properties.type &&
            null != p &&
            null != p.properties.type
              ? ((G = "O_" + ((w % 2) + 1)),
                (B =
                  "1" === w
                    ? (Math.floor(3 * Math.random()) * Math.PI) / 2
                    : 0))
              : 0 !== F.properties.type ||
                  (null != b && null != b.properties.type)
                ? 0 === F.properties.type
                  ? ((G = "X"),
                    (B = (Math.floor(3 * Math.random()) * Math.PI) / 2))
                  : 1 === F.properties.type
                    ? (G = "A")
                    : 2 === F.properties.type
                      ? ((G = "A"), (C = [-1, 1]))
                      : 3 === F.properties.type
                        ? (G = "V")
                        : 4 === F.properties.type && ((G = "V"), (C = [-1, 1]))
                : ((G = "T_" + ((w % 3) + 1)),
                  (u = 2 * Math.round(Math.random()) - 1)),
            w++,
            null != G &&
              ((D = this.game.make.sprite(
                (d.x + 0.5) * c.world.mpx(1),
                (d.y + 0.5) * c.world.mpx(1),
                "TempleAssets",
                "decor_" + G + "0000",
              )),
              (D.rotation = B),
              D.scale.set(u * C[0], C[1]),
              D.anchor.set(0.5),
              g.renderXY(D, D.x + 32, D.y + 32, false),
              D.destroy()));
        return (
          this.game.cache.addRenderTexture("decosTexture", g),
          (D = this.game.make.sprite(
            -32,
            -32,
            this.game.cache.getRenderTexture("decosTexture").texture,
          )),
          this.game.layers.decorations.addChild(D),
          (this.game.layers.decorations.cacheAsBitmap = true)
        );
      };
      Ground.prototype.drawForeground = function () {
        return (this.image = this.game.make.image(0, 0, this.bmd));
      };
      Ground.prototype.applyFilter = function () {
        var a, b, c, d, e, f, g;
        return (
          (a = this.game.make.tileSprite(
            0,
            0,
            this.options.width,
            this.options.height,
            "TempleAssets",
            "BackGround0000",
          )),
          this.game.layers.background.addChild(a),
          (a.cacheAsBitmap = true),
          (g = this.options.width + 64),
          (b = this.options.height + 64),
          (c = new InlineFilter(this.game, g, b, 3, 16711680)),
          c.init(),
          (d = new OutlineFilter(this.game, g, b, 3.5, 0)),
          d.init(),
          (f = new ShadowFilter(this.game, g, b, 8, 0)),
          f.init(),
          (this.image.filters = [c, d, f]),
          (e = new Phaser.RenderTexture(
            this.game,
            g,
            b,
            "groundTexture",
            void 0,
            1,
          )),
          (this.game.renderer.renderSession.resolution = 1),
          e.renderRawXY(this.image, 0, 0, true),
          (this.game.renderer.renderSession.resolution = this.game.resolution),
          this.game.cache.addRenderTexture("groundTexture", e),
          (this.sprite = this.game.make.sprite(
            -32,
            -32,
            this.game.cache.getRenderTexture("groundTexture").texture,
          )),
          this.game.layers.ground.addChild(this.sprite),
          (this.sprite.cacheAsBitmap = true),
          this.image.destroy(),
          this.bmd.destroy(),
          this.maskBmd.destroy(),
          this.foregroundBmd.destroy()
        );
      };
      Ground.prototype.destroy = function () {
        return (
          this.sprite.destroy(),
          this.image.destroy(),
          this.bmd.destroy(),
          this.maskBmd.destroy(),
          this.foregroundBmd.destroy(),
          Ground.__super__.destroy.call(this)
        );
      };
      Ground.prototype.createGroundFixture = function (a, b, c) {
        var d, e;
        return (
          (e = new box2d.b2FixtureDef()),
          (e.shape = a),
          (e.filter.categoryBits = 1),
          (e.filter.maskBits = 4369),
          (e.friction = 0.8),
          (e.isSensor = b),
          (e.userData = c),
          (d = this.groundBody.data.CreateFixture(e)),
          (d.id = this.groundBody.world.getNextFixtureId())
        );
      };
      Ground.prototype.createGroundShape = function (a, b) {
        var c, d, e, f;
        return (
          (e = 1),
          (d = 1),
          (c = new box2d.b2PolygonShape()),
          0 === a || 10 === a
            ? ((f = []),
              f.push(new box2d.b2Vec2(0, 0)),
              f.push(new box2d.b2Vec2(-e, 0)),
              f.push(new box2d.b2Vec2(-e, -d)),
              f.push(new box2d.b2Vec2(0, -d)))
            : 1 === a || -2 === a || 11 === a
              ? ((f = []),
                f.push(new box2d.b2Vec2(-e, 0)),
                f.push(new box2d.b2Vec2(-e, -d)),
                f.push(new box2d.b2Vec2(0, -d)))
              : 2 === a || 12 === a
                ? ((f = []),
                  f.push(new box2d.b2Vec2(0, 0)),
                  f.push(new box2d.b2Vec2(-e, -d)),
                  f.push(new box2d.b2Vec2(0, -d)))
                : 3 === a
                  ? ((f = []),
                    f.push(new box2d.b2Vec2(0, 0)),
                    f.push(new box2d.b2Vec2(-e, 0)),
                    f.push(new box2d.b2Vec2(-e, -d)))
                  : 4 === a
                    ? ((f = []),
                      f.push(new box2d.b2Vec2(0, 0)),
                      f.push(new box2d.b2Vec2(-e, 0)),
                      f.push(new box2d.b2Vec2(0, -d)))
                    : 5 === a || 6 === a || 7 === a
                      ? ((f = []),
                        f.push(new box2d.b2Vec2(0, -d / 2)),
                        f.push(new box2d.b2Vec2(-e, -d / 2)),
                        f.push(new box2d.b2Vec2(-e, -d)),
                        f.push(new box2d.b2Vec2(0, -d)))
                      : 8 === a
                        ? ((f = []),
                          f.push(new box2d.b2Vec2(0, 0)),
                          f.push(new box2d.b2Vec2(-e - 0.3, -d / 2)),
                          f.push(new box2d.b2Vec2(-e - 0.3, -d)),
                          f.push(new box2d.b2Vec2(0, -d)))
                        : 9 === a &&
                          ((f = []),
                          f.push(new box2d.b2Vec2(0.3, -d / 2)),
                          f.push(new box2d.b2Vec2(-e, 0)),
                          f.push(new box2d.b2Vec2(-e, -d)),
                          f.push(new box2d.b2Vec2(0.3, -d))),
          _.each(f, function (a) {
            return ((a.x -= b.x), (a.y -= b.y));
          }),
          c.Set(f),
          c
        );
      };
      Ground.prototype.CreateSnows = function (a) {
        var b,
          c,
          d,
          e,
          f,
          g,
          h,
          i,
          j,
          k,
          l,
          m,
          n,
          o,
          p,
          q,
          r,
          s,
          t,
          u,
          v,
          w,
          x,
          y,
          z;
        for (
          c = a.layers[0].data,
            j = c.length,
            i = c[0].length,
            v = [],
            console.log("WE"),
            d = g = 0,
            m = j;
          0 <= m ? g <= m : g >= m;
          d = 0 <= m ? ++g : --g
        )
          for (
            [], e = k = 0, n = i;
            0 <= n ? k <= n : k >= n;
            e = 0 <= n ? ++k : --k
          )
            d >= 0 &&
              e >= 0 &&
              d < j &&
              e < i &&
              ((x = c[d][e]),
              10 === x.properties.type
                ? void 0 === u || null === u
                  ? (u = { x: d, y: e, length: 1, dir: "WE" })
                  : (u.length += 1)
                : null != u && (v.push(u), (u = null)));
        for (
          console.log("SE"), f = l = 0, o = i + j;
          0 <= o ? l <= o : l >= o;
          f = 0 <= o ? ++l : --l
        )
          for (
            [], d = w = 0, p = f;
            0 <= p ? w <= p : w >= p;
            d = 0 <= p ? ++w : --w
          )
            ((e = f - d),
              d >= 0 &&
                e >= 0 &&
                d < j &&
                e < i &&
                ((x = c[d][e]),
                11 === x.properties.type
                  ? null == u
                    ? (u = { x: d, y: e, length: 1, dir: "SE" })
                    : (u.length += 1)
                  : null != u && (v.push(u), (u = null))));
        for (
          console.log("SW"), f = y = q = -Math.max(i, j), r = Math.max(i, j);
          q <= r ? y <= r : y >= r;
          f = q <= r ? ++y : --y
        )
          for (
            [], d = z = 0, s = j;
            0 <= s ? z <= s : z >= s;
            d = 0 <= s ? ++z : --z
          )
            ((e = f + d),
              d >= 0 &&
                e >= 0 &&
                d < j &&
                e < i &&
                ((x = c[d][e]),
                12 === x.properties.type
                  ? null == u
                    ? (u = { x: d, y: e, length: 1, dir: "SW" })
                    : (u.length += 1)
                  : null != u && (v.push(u), (u = null))));
        for (console.log(v), b = 0, h = v.length; b < h; b++)
          ((t = v[b]), this.CreateSnow(this, t));
      };
      Ground.prototype.CreateSnow = function (a, b) {
        return new Snow(this.game, a, b);
      };
      Ground.prototype.CreateLiquid = function (a, b, d, e) {
        return new Liquid(this.game, b - e, d, { type: a, width: e });
      };
      return Ground;
    });
  }.call(this),
  function () {
    define("States/Level/character", ["./CharCursors", "Phaser"], function (
      CharCursors,
    ) {
      "use strict";
      function Character(b, d, f, g) {
        ((this.drawDarkMask = this.drawDarkMask.bind(this)),
          (this.update = this.update.bind(this)),
          (this.setFriction = this.setFriction.bind(this)),
          (this.setOnIce = this.setOnIce.bind(this)),
          (this.animateStairs = this.animateStairs.bind(this)),
          (this.destroy = this.destroy.bind(this)),
          (this._doKill = this._doKill.bind(this)),
          (this.kill = this.kill.bind(this)),
          (this.liquidTouched = this.liquidTouched.bind(this)));
        var h, i, j, k, l, m, n, o, p, q, r, s;
        return (
          (this.maxSpeed = this.defaultMaxSpeed),
          Character.__super__.constructor.call(this, b),
          (d += this.game.physics.box2d.mpx(1)),
          (f -= this.game.physics.box2d.mpx(1)),
          (this.data = { char: g, diamonds: 0, silverDiamond: 0 }),
          (this.sprite = this.game.make.sprite(
            d,
            f,
            "CharAssets",
            "_default0000",
          )),
          (this.sprite.character = this),
          (this.sprite.scale.x = this.spriteScale),
          (this.sprite.scale.y = this.spriteScale),
          this.game.layers.chars.addChild(this.sprite),
          this.game.physics.box2d.enable(this.sprite),
          (this.body = this.sprite.body),
          this.body.clearFixtures(),
          (this.body.fixedRotation = true),
          (this.body.data.m_userData = "pers"),
          this.body.data.SetBullet(true),
          (this.signal = new Phaser.Signal()),
          (m = (function (a) {
            return function (b, c, d) {
              var e, f, g;
              return (
                (e = new box2d.b2CircleShape(b)),
                e.m_p.SetXY(c[0], c[1]),
                (g = new box2d.b2FixtureDef()),
                (g.shape = e),
                (g.density = 0),
                (g.filter.categoryBits = 16),
                (g.filter.maskBits = 4353),
                (g.friction = d),
                (f = a.body.data.CreateFixture(g)),
                (f.id = a.body.world.getNextFixtureId()),
                f
              );
            };
          })(this)),
          (n = (function (a) {
            return function (b, c, d, e) {
              var f, g, h, i, j;
              return (
                (j = []),
                (f = a.dr),
                j.push(new box2d.b2Vec2(b - f, d)),
                j.push(new box2d.b2Vec2(-b + f, d)),
                j.push(new box2d.b2Vec2(c - f, e)),
                j.push(new box2d.b2Vec2(-c + f, e)),
                (i = new box2d.b2PolygonShape()),
                i.Set(j),
                (h = new box2d.b2FixtureDef()),
                (h.shape = i),
                (h.friction = 0),
                (h.density = 1.4),
                (h.filter.categoryBits = 16),
                (h.filter.maskBits = 4353),
                (g = a.body.data.CreateFixture(h)),
                (g.id = a.body.world.getNextFixtureId()),
                g
              );
            };
          })(this)),
          (p = this.r1),
          (q = this.r2),
          (r = this.y1),
          (s = this.y2),
          (h = new box2d.b2CircleShape(0.1)),
          h.m_p.SetXY(0, 0),
          (i = new box2d.b2FixtureDef()),
          (i.shape = h),
          (i.density = 0),
          (i.filter.categoryBits = 4096),
          (i.filter.maskBits = 4096),
          (i.filter.groupIndex = -1),
          (i.friction = 0),
          (this.portalSensor = this.body.data.CreateFixture(i)),
          (this.portalSensor.id = this.body.world.getNextFixtureId()),
          (this.portalSensor.m_userData = { "portal-sensor": true }),
          m(p, [0, r], 0),
          (this.feetSensor = m(q, [0, s], this.feetFriction)),
          n(p, q, r, s),
          (this.feetSensor.m_userData = "feet"),
          (this.feetSensor.contacts = []),
          (o = "fb" === g ? "fire" : "water"),
          (this.prefix = o),
          (this.bodySprite = b.make.sprite(0, 0, "CharAssets", "_default0000")),
          this.sprite.addChild(this.bodySprite),
          (l = b.make.sprite(0, 0, "CharAssets")),
          l.anchor.set(0.5),
          l.animations.add(
            "running",
            Phaser.Animation.generateFrameNames(
              o + "_legs_running",
              0,
              7,
              "",
              4,
            ),
            30,
            true,
          ),
          "wg" === this.data.char &&
            l.animations.add(
              "onice",
              Phaser.Animation.generateFrameNames(
                o + "_legs_running",
                0,
                7,
                "",
                4,
              ),
              10,
              true,
            ),
          (l.frameName = o + "_legs_idle0000"),
          this.bodySprite.addChild(l),
          (j = b.make.sprite(0, 0, "CharAssets")),
          j.animations.add(
            "idle",
            Phaser.Animation.generateFrameNames(o + "_head_idle", 0, 29, "", 4),
            30,
            true,
          ),
          j.animations.add(
            "falling",
            Phaser.Animation.generateFrameNames(
              o + "_head_falling",
              0,
              4,
              "",
              4,
            ),
            30,
            true,
          ),
          j.animations.add(
            "jumping",
            Phaser.Animation.generateFrameNames(
              o + "_head_jumping",
              0,
              10,
              "",
              4,
            ),
            30,
            true,
          ),
          j.animations.add(
            "rising",
            Phaser.Animation.generateFrameNames(
              o + "_head_rising",
              0,
              4,
              "",
              4,
            ),
            30,
            true,
          ),
          j.anchor.set(0.5),
          j.animations.play("idle"),
          this.bodySprite.addChild(j),
          (k = b.make.sprite(0, 0, "CharAssets")),
          k.anchor.set(0.5),
          k.animations.add(
            "loop",
            Phaser.Animation.generateFrameNames(o + "_ice_legs", 0, 4, "", 4),
            10,
            true,
          ),
          (k.visible = false),
          this.bodySprite.addChild(k),
          (this.bodyParts = {}),
          (this.bodyParts.legs = l),
          (this.bodyParts.ice = k),
          (this.bodyParts.head = j),
          (this.bodySprite.hitArea = new PIXI.Circle(0, 0, 0.65 * l.height)),
          this.body.setFixtureContactCallback(
            this.feetSensor,
            (function (a) {
              return function (b, c, d, e, f, g) {
                var h;
                if (e.m_isSensor) {
                  if (
                    null != e.m_userData &&
                    "liquid_death" === e.m_userData.type
                  )
                    return f
                      ? (a.liquidTouched(e.m_userData.liquidType),
                        (a.isOnLiquid = true))
                      : (a.isOnLiquid = false);
                } else {
                  if (f && g.m_manifold.localNormal.Length() > 0)
                    return a.feetSensor.contacts.push(g);
                  if ((h = a.feetSensor.contacts.indexOf(g)) >= 0)
                    return a.feetSensor.contacts.splice(h, 1);
                }
              };
            })(this),
            this,
          ),
          (this.cursors = new CharCursors(this.game, g)),
          (this.sprite.char = this.char = g),
          this
        );
      }
      extend(Character, Phaser.Group);
      Character.prototype.facing = "left";
      Character.prototype.feetFriction = 0.5;
      Character.prototype.r1 = 0.48;
      Character.prototype.r2 = 0.2;
      Character.prototype.dr = 0.03;
      Character.prototype.y1 = 0.2;
      Character.prototype.y2 = -0.9;
      Character.prototype.spriteScale = 0.95;
      Character.prototype.jumpImpulse = 1;
      Character.prototype.jumpVelocity = 15.5;
      Character.prototype.jumpIceVelocity = 10;
      Character.prototype.runForce = 50;
      Character.prototype.floatForce = 30;
      Character.prototype.defaultMaxSpeed = 8.5;
      Character.prototype.waterIceMaxSpeed = 2;
      Character.prototype.absoluteMaxSpeed = 40;
      Character.prototype.liquidTouched = function (a) {
        if (
          7 === a ||
          ("wg" === this.char && 6 === a) ||
          ("fb" === this.char && 5 === a)
        )
          return this.kill();
      };
      Character.prototype.kill = function () {
        if (!this.dying) return ((this.dying = true), _.delay(this._doKill, 0));
      };
      Character.prototype._doKill = function () {
        var a, b;
        return (
          this.game.level.sounds.death.play(),
          this.game.level.sounds.levelMusic.stop(),
          this.game.level.sounds.levelMusicOver.play(),
          (b = this.game.make.sprite(
            0,
            -0.7 * this.game.physics.box2d.mpx(1),
            "CharAssets",
          )),
          (a = b.animations.add(
            "play",
            Phaser.Animation.generateFrameNames("death_smoke", 0, 45, "", 4),
            30,
            false,
          )),
          this.body.data.GetLinearVelocity().x < 0 && (b.scale.x = -1),
          b.animations.play("play"),
          b.anchor.set(0.5),
          a.onComplete.add(
            (function (a) {
              return function () {
                return (
                  (a.sprite.visible = false),
                  (a.isDead = true),
                  a.signal.dispatch()
                );
              };
            })(this),
          ),
          this.sprite.addChild(b),
          (this.dead = true)
        );
      };
      Character.prototype.destroy = function () {
        return (
          Character.__super__.destroy.apply(this, arguments),
          this.cursors.destroy()
        );
      };
      Character.prototype.animateStairs = function (a) {
        var b;
        return (
          (this.bodyParts.head.visible = false),
          (this.bodyParts.legs.visible = false),
          (b = this.game.make.sprite(0, 0, "CharAssets")),
          b.animations.add(
            "up",
            Phaser.Animation.generateFrameNames(
              this.prefix + "_stairs",
              0,
              30,
              "",
              4,
            ),
            25,
            false,
          ),
          b.anchor.set(0.5, 1),
          this.game.add
            .tween(b.scale)
            .to({ x: 0.8, y: 0.8 }, 360, Phaser.Easing.Linear.None, true, 0),
          this.sprite.addChild(b),
          (this.body.x = a.pos.x),
          (this.body.y = a.pos.y + 4),
          b.animations.play("up")
        );
      };
      Character.prototype.setOnIce = function (a) {
        return a && !this.isOnIce
          ? ((this.isOnIce = true), this.setFriction())
          : !a && this.isOnIce
            ? ((this.isOnIce = false), this.setFriction())
            : void 0;
      };
      Character.prototype.setFriction = function () {
        var a, b;
        for (
          "fb" === this.data.char &&
            (this.isOnIce
              ? ((this.feetSensor.m_friction = 0),
                (this.maxSpeed = this.defaultMaxSpeed))
              : ((this.feetSensor.m_friction = this.feetFriction),
                (this.maxSpeed = this.defaultMaxSpeed))),
            "wg" === this.data.char &&
              (this.isOnIce
                ? ((this.feetSensor.m_friction = 0.7),
                  (this.maxSpeed = this.waterIceMaxSpeed))
                : ((this.feetSensor.m_friction = this.feetFriction),
                  (this.maxSpeed = this.defaultMaxSpeed))),
            this.feetSensor.Refilter(),
            a = this.feetSensor.m_body.m_contactList,
            b = [];
          null != a;
        )
          (a.contact.ResetFriction(), b.push((a = a.next)));
        return b;
      };
      Character.prototype.update = function () {
        var a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t;
        if (
          !(
            (null != this.game.level && this.game.level.ended) ||
            this.game.physics.box2d.paused
          )
        ) {
          if (this.dying)
            return (
              (this.bodySprite.visible = false),
              (this.bodyParts.legs.visible = false),
              (this.bodyParts.head.visible = false),
              void (
                this.dead &&
                this.body.data.SetLinearVelocity(new box2d.b2Vec2(0, 0))
              )
            );
          if (
            ((k = this.jumpImpulse),
            this.jumpVelocity,
            (q = this.runForce),
            (h = this.floatForce),
            this.defaultMaxSpeed,
            (this.cursors.right.isDown || this.cursors.left.isDown) &&
            this.isOnLiquid
              ? this.waterplaying ||
                ((this.waterplaying = true),
                (this.game.level.sounds.waterSteps.loop = true),
                (this.game.level.sounds.waterSteps.volume = 0.5),
                this.game.level.sounds.waterSteps.play())
              : true === this.waterplaying &&
                ((this.waterplaying = false),
                this.game.level.sounds.waterSteps.stop()),
            (this.cursors.right.isDown || this.cursors.left.isDown) &&
            this.isOnIce
              ? this.iceplaying ||
                ((this.iceplaying = true),
                (this.game.level.sounds["iceSteps_" + this.data.char].loop =
                  true),
                this.game.level.sounds["iceSteps_" + this.data.char].play())
              : true === this.iceplaying &&
                ((this.iceplaying = false),
                this.game.level.sounds["iceSteps_" + this.data.char].stop()),
            (j = new box2d.b2Vec2(0, -1)),
            this.feetSensor.contacts.length > 0 &&
              (_.each(
                this.feetSensor.contacts,
                (function (a) {
                  return function (a) {
                    return (
                      a.m_normal || (a.m_normal = new box2d.b2Vec2()),
                      a.m_fixtureA.m_body.GetWorldVector(
                        a.m_manifold.localNormal,
                        a.m_normal,
                      )
                    );
                  };
                })(),
              ),
              (this.feetSensor.contacts = _.sortBy(
                this.feetSensor.contacts,
                (function (a) {
                  return function (a) {
                    return a.m_normal.Dot(j);
                  };
                })(),
              )),
              (d = this.feetSensor.contacts[0]),
              (l = d.m_normal)),
            (g = this.game.time.elapsed / 1e3),
            (e = (130 * g) / this.currentRunForce),
            this.body.data.GetLinearVelocity().Length() < 1 &&
              this.currentRunForce > 0.5 * q &&
              (e = q),
            this.cursors.left.isDown
              ? null != d
                ? (this.currentRunForce < q &&
                    (this.currentRunForce = Math.min(
                      this.currentRunForce + e,
                      q,
                    )),
                  (n = l.y > 0.6 ? l.y : 0),
                  (i = l
                    .Clone()
                    .SelfCrossSV(-this.currentRunForce)
                    .SelfMul(Math.max(0, Math.sqrt(n)))),
                  n > 0.6 && i.y >= 0 && i.y < 20 && (i.y += 20))
                : (i = new box2d.b2Vec2(h, 0))
              : this.cursors.right.isDown
                ? null != d
                  ? (this.currentRunForce < q &&
                      (this.currentRunForce = Math.min(
                        this.currentRunForce + e,
                        q,
                      )),
                    (n = l.y > 0.6 ? l.y : 0),
                    (i = l
                      .Clone()
                      .SelfCrossSV(this.currentRunForce)
                      .SelfMul(Math.max(0, Math.sqrt(n)))),
                    n > 0.6 && i.y >= 0 && i.y < 20 && (i.y += 20))
                  : (i = new box2d.b2Vec2(-h, 0))
                : ((this.currentRunForce = 0.475 * q),
                  this.isOnIce && "wg" === this.data.char
                    ? ((i = new box2d.b2Vec2(
                        20 * -this.body.data.GetLinearVelocity().x,
                        0,
                      )),
                      this.body.data.SetLinearVelocity(new box2d.b2Vec2(0, 0)))
                    : (i = new box2d.b2Vec2(
                        7 * -this.body.data.GetLinearVelocity().x,
                        0,
                      ))),
            this.prohibitJump &&
              !this.cursors.up.isDown &&
              (this.prohibitJump = false),
            !this.prohibitJump &&
              this.cursors.up.isDown &&
              ((null != l && l.y > 0.2) ||
                this.feetSensor.contacts.length >= 2))
          ) {
            for (
              this.body.data.ApplyLinearImpulse({ x: 0, y: k }, { x: 0, y: 0 }),
                this.isOnIce
                  ? "fb" === this.data.char
                    ? l.y > 0.9
                      ? ((t = new box2d.b2Vec2(
                          this.body.data.GetLinearVelocity().x,
                          3 * l.y,
                        )),
                        this.body.data.SetLinearVelocity(t))
                      : ((t = new box2d.b2Vec2(3 * l.x, 3 * l.y)),
                        this.body.data.SetLinearVelocity(t))
                    : ((t = new box2d.b2Vec2(
                        this.body.data.GetLinearVelocity().x,
                        this.jumpIceVelocity,
                      )),
                      this.body.data.SetLinearVelocity(t))
                  : ((t =
                      l.y > 0.65
                        ? new box2d.b2Vec2(
                            this.body.data.GetLinearVelocity().x,
                            this.jumpVelocity,
                          )
                        : new box2d.b2Vec2(
                            this.body.data.GetLinearVelocity().x,
                            Math.sqrt(Math.sqrt(l.y)) * this.jumpVelocity,
                          )),
                    t.Length() > this.jumpVelocity &&
                      t.SelfNormalize().SelfMul(this.jumpVelocity),
                    this.body.data.SetLinearVelocity(t),
                    (f = true)),
                o = this.feetSensor.m_body.m_contactList,
                p = new box2d.b2Vec2(0, -1),
                p;
              null != o;
            )
              ((c = o.contact.m_fixtureA.m_body),
                "reactable" === c.m_userData &&
                  c.ApplyLinearImpulse(p, { x: 0, y: 0 }, true),
                (o = o.next));
            ((this.prohibitJump = true),
              "wg" === this.char
                ? this.game.level.sounds.jump_wg.play()
                : this.game.level.sounds.jump_fb.play());
          }
          (null != i &&
            (f && ((i.y = 0), (f = false)),
            this.isOnIce &&
              ("fb" === this.data.char && i.SelfMul(0.2),
              "wg" === this.data.char && i.SelfMul(1),
              (s = this.body.data.GetLinearVelocity()),
              s.Length() > this.maxSpeed &&
                (s.SelfNormalize().SelfMul(this.maxSpeed),
                this.body.data.SetLinearVelocity(s))),
            (s = this.body.data.GetLinearVelocity()),
            i.x > 0 &&
              s.x < this.maxSpeed &&
              this.body.data.ApplyForce(i, { x: 0, y: 0 }),
            i.x < 0 &&
              s.x > -this.maxSpeed &&
              this.body.data.ApplyForce(i, { x: 0, y: 0 })),
            s.Length() > this.absoluteMaxSpeed &&
              (s.SelfNormalize().SelfMul(this.absoluteMaxSpeed),
              this.body.data.SetLinearVelocity(s)),
            (s = this.body.data.GetLinearVelocity()),
            (m = s.Clone().SelfNormalize()),
            (a = Math.atan2(Math.max(-0.333, m.y), m.x)),
            null != l
              ? this.cursors.left.isDown
                ? ((b = "jumping"),
                  (r = -1),
                  (a = Math.atan2(l.y, l.x) - Math.PI / 2),
                  (a = Math.max(Math.min(a, 0.25 * Math.PI), 0.1 * -Math.PI)))
                : this.cursors.right.isDown
                  ? ((b = "jumping"),
                    (r = 1),
                    (a = Math.atan2(l.y, l.x) - Math.PI / 2),
                    (a = Math.max(Math.min(a, 0.1 * Math.PI), 0.25 * -Math.PI)))
                  : ((b = "idle"), (r = 1), (a = 0))
              : s.x > 4
                ? ((b = "jumping"), (r = -1), (a = a))
                : s.x < -4
                  ? ((b = "jumping"), (r = 1), (a += Math.PI))
                  : s.y > 3
                    ? ((b = "rising"), (r = 1), (a = 0))
                    : s.y < -3
                      ? ((b = "falling"), (r = 1), (a = 0))
                      : this.cursors.left.isDown
                        ? ((b = "jumping"),
                          (r = -1),
                          (a = this.bodyParts.head.rotation))
                        : this.cursors.right.isDown
                          ? ((b = "jumping"),
                            (r = 1),
                            (a = this.bodyParts.head.rotation))
                          : ((b = "idle"), (r = 1), (a = 0)),
            this.bodyParts.head.scale.set(r, 1),
            (this.bodyParts.head.rotation = a),
            this.bodyParts.head.animations.play(b),
            "rising" === b
              ? this.bodyParts.legs.renderOrderID <
                  this.bodyParts.head.renderOrderID &&
                (this.sprite.removeChild(this.bodyParts.legs, false, true),
                this.sprite.addChild(this.bodyParts.legs, true))
              : this.bodyParts.legs.renderOrderID >
                  this.bodyParts.head.renderOrderID &&
                (this.sprite.removeChild(this.bodyParts.head, false, true),
                this.sprite.addChild(this.bodyParts.head, true)),
            "jumping" === b
              ? (-1 === r &&
                  "left" !== this.facing &&
                  (this.bodyParts.legs.scale.set(-1, 1),
                  this.bodyParts.ice.scale.set(-1, 1),
                  (this.facing = "left")),
                1 === r &&
                  "right" !== this.facing &&
                  (this.bodyParts.legs.scale.set(1, 1),
                  this.bodyParts.ice.scale.set(1, 1),
                  (this.facing = "right")),
                this.isOnIce
                  ? (this.bodyParts.ice.animations.play("loop"),
                    (this.bodyParts.ice.visible = true))
                  : (this.bodyParts.ice.animations.stop(),
                    (this.bodyParts.ice.visible = false)),
                "wg" === this.data.char && this.isOnIce
                  ? this.bodyParts.legs.animations.play("onice")
                  : this.bodyParts.legs.animations.play("running"))
              : "idle" !== this.facing &&
                (this.bodyParts.ice.animations.stop(),
                (this.bodyParts.ice.visible = false),
                this.bodyParts.legs.animations.stop(),
                (this.bodyParts.legs.frameName =
                  this.prefix + "_legs_idle0000"),
                (this.facing = "idle")));
        }
      };
      Character.prototype.drawDarkMask = function (a) {
        var b, c;
        return (
          (a.ctx.globalCompositeOperation = "lighter"),
          (c = {
            x: this.sprite.x + a.offset.x,
            y: this.sprite.y + a.offset.y,
          }),
          (b = a.ctx.createRadialGradient(c.x, c.y, 20, c.x, c.y, 180)),
          b.addColorStop(0, "rgba(255,255,255,1)"),
          b.addColorStop(0.5, "rgba(255,255,255,0.3)"),
          b.addColorStop(1, "transparent"),
          a.circle(c.x, c.y, 220, b)
        );
      };
      return Character;
    });
  }.call(this),
  function () {
    define("States/Level/MechManager", [
      "./Devices/Device",
      "./Devices/_define",
    ], function () {
      "use strict";
      function MechManager(b) {
        ((this.deviceChanged = this.deviceChanged.bind(this)),
          (this.resetStates = this.resetStates.bind(this)),
          (this.connectToWall = this.connectToWall.bind(this)),
          (this.registerDevice = this.registerDevice.bind(this)),
          (this.game = b),
          (this.deviceGroups = {}));
      }
      extend(MechManager, Object);
      MechManager.prototype.registerDevice = function (a) {
        var b, c;
        if (
          ((c = a.options.properties.group),
          (b = this.deviceGroups)[c] || (b[c] = []),
          this.deviceGroups[c].push(a),
          null != a.signal)
        )
          return a.signal.add(this.deviceChanged);
      };
      MechManager.prototype.connectPortals = function () {
        var a, b, c, d, e, f, g, h, i, j, k, l;
        ((j = {}), (k = this.deviceGroups));
        for (f in k)
          for (d = k[f], e = 0, g = d.length; e < g; e++)
            ((c = d[e]),
              "portal" === c.options.type &&
                (j[(h = c.options.properties.portalId)] || (j[h] = []),
                j[c.options.properties.portalId].push(c)));
        l = [];
        for (f in j)
          ((i = j[f]),
            (i[0].other = i[1]),
            (i[1].other = i[0]),
            (a = i[0].options.properties).inverted || (a.inverted = false),
            (b = i[1].options.properties).inverted || (b.inverted = false),
            this.connectToWall(i[0]),
            l.push(this.connectToWall(i[1])));
        return l;
      };
      MechManager.prototype.connectToWall = function (a) {
        var b, c, d, e, f, g, h;
        if (
          ((g = this.game.physics.box2d.pxm(a.options.x)),
          (h = this.game.physics.box2d.pxm(a.options.y)),
          (d = new box2d.b2Vec2(g, h)),
          (c = d
            .Clone()
            .SelfAdd(
              new box2d.b2Vec2(0.5, 0).SelfRotateRadians(a.options.rotation),
            )),
          (f = d
            .Clone()
            .SelfAdd(
              new box2d.b2Vec2(-0.5, 0).SelfRotateRadians(a.options.rotation),
            )),
          -1 ===
            this.game.level.ground.getTileAt(Math.floor(c.x), Math.floor(c.y))
              .properties.type && (b = c),
          -1 ===
            this.game.level.ground.getTileAt(Math.floor(f.x), Math.floor(f.y))
              .properties.type && (b = f),
          null != b)
        )
          return (
            b.SelfAdd(
              new box2d.b2Vec2(0, -0.5).SelfRotateRadians(a.options.rotation),
            ),
            (e = {
              center: { x: -b.x, y: -b.y },
              rotation: a.options.rotation,
              width: 0.5,
              height: 1.5,
            }),
            a.createFakeBlock(e)
          );
      };
      MechManager.prototype.resetStates = function () {
        var a, b, c, d, e;
        ((d = this.deviceGroups), (e = []));
        for (c in d)
          ((b = d[c]),
            e.push(
              (function () {
                var c, d, e;
                for (e = [], c = 0, d = b.length; c < d; c++)
                  ((a = b[c]), e.push(a.updateState(true)));
                return e;
              })(),
            ));
        return e;
      };
      MechManager.prototype.deviceChanged = function (a) {
        var b, c, d, e, f, g, h, i, j;
        for (
          console.log("--"),
            g = a.state,
            h = this.deviceGroups[a.options.properties.group],
            c = 0,
            e = h.length;
          c < e;
          c++
        )
          ((b = h[c]), null != b.signal && (g = g || b.state));
        for (
          i = this.deviceGroups[a.options.properties.group],
            j = [],
            d = 0,
            f = i.length;
          d < f;
          d++
        )
          ((b = i[d]),
            null == b.signal && (b.state = g),
            j.push(b._updateState()));
        return j;
      };
      MechManager.classNames = {
        pusher: Devices.Pusher,
        lever: Devices.Lever,
        box: Devices.Box,
        platform: Devices.MovingPlatform,
        beamer: Devices.Beamer,
        rotmirror: Devices.RotMirror,
        lightpusher: Devices.LightPusher,
        portal: Devices.Portal,
        ball: Devices.Ball,
        pulley: Devices.Pulley,
        hanging: Devices.Hanging,
        boxmirror: Devices.BoxMirror,
        boxheavy: Devices.BoxHeavy,
        infinitemirror: Devices.InfiniteMirror,
        slider: Devices.Slider,
        timedpusher: Devices.TimedPusher,
        wind: Devices.Wind,
        cover: Devices.BackgroundCover,
        window: Devices.Window,
        roman: Devices.Roman,
      };
      MechManager.className = function (a) {
        return MechManager.classNames[a];
      };
      return MechManager;
    });
  }.call(this),
  function () {
    define("States/Level/CameraManager", [], function () {
      "use strict";
      function CameraManager(b) {
        ((this.destroy = this.destroy.bind(this)),
          (this.checkBounds = this.checkBounds.bind(this)),
          (this.animate = this.animate.bind(this)),
          (this.focusOn = this.focusOn.bind(this)),
          (this.updateCamera = this.updateCamera.bind(this)),
          (this.update = this.update.bind(this)));
        var c, d;
        ((this.game = b.game),
          (this.level = b),
          (this.camGraphics = this.game.add.graphics(0, 0)),
          (this.camGraphics.fixedToCamera = true),
          (this.viewportPadding = { top: 64, left: 0, bottom: 0, right: 0 }),
          (this.worldPadding = {
            top: 100,
            left: 200,
            bottom: 100,
            right: 200,
          }),
          (this.target = {
            x: 0,
            y: 0,
            scale: 1,
            vx: 0,
            vy: 0,
            vscale: 0,
            ax: 0,
            ay: 0,
            ascale: 0,
          }),
          this.updateCamera(),
          (this.minScale = d =
            Math.min(
              (0.9 * this.game.realWidth) / this.game.level.size.width,
              (0.9 * this.game.realHeight) / this.game.level.size.height,
            )),
          (this.maxScale = 1.5),
          (this.level.root.x = (-this.game.level.size.width / 2) * d),
          (this.level.root.y = (-this.game.level.size.height / 2) * d),
          this.level.root.scale.set(d),
          (this.camFreeze = true),
          (c = _.debounce(
            (function (a) {
              return function () {
                return (a.wheelScale = null);
              };
            })(this),
            1e3,
          )),
          $(window).on(
            "wheel",
            (function (a) {
              return function (b) {
                return (
                  console.log("zoom", b.originalEvent.deltaY),
                  b.originalEvent.deltaY > 0
                    ? (a.wheelScale = Math.min(
                        a.maxScale,
                        Math.max(a.minScale, 0.8 * a.level.root.scale.x),
                      ))
                    : (a.wheelScale = Math.min(
                        a.maxScale,
                        Math.max(a.minScale, 1.2 * a.level.root.scale.x),
                      )),
                  b.stopPropagation(),
                  b.preventDefault(),
                  c()
                );
              };
            })(this),
          ),
          this.game.TouchManager.register(
            this,
            "pinch",
            (function (a) {
              return function (b) {
                if (
                  !a.game.level.pers1.cursors.active &&
                  !a.game.level.pers2.cursors.active
                )
                  return (
                    null == a.userScale &&
                      ((a.pinchScale = a.level.root.scale.x),
                      (a.pinchOrigin = {
                        x: -a.level.root.x,
                        y: -a.level.root.y,
                      }),
                      (a.pinchCenter = {
                        x:
                          -a.level.root.x -
                          a.game.realWidth / 2 +
                          b.center.x / a.pinchScale,
                        y:
                          -a.level.root.y -
                          a.game.realHeight / 2 +
                          b.center.y / a.pinchScale,
                      })),
                    (a.userScale = Math.min(
                      a.maxScale,
                      Math.max(a.minScale, b.scale * a.pinchScale),
                    )),
                    (a.userCenter = new box2d.b2Vec2(
                      a.pinchOrigin.x +
                        a.pinchCenter.x * a.userScale -
                        a.pinchCenter.x * a.pinchScale -
                        b.deltaX / a.game.camera.scale.x,
                      a.pinchOrigin.y +
                        a.pinchCenter.y * a.userScale -
                        a.pinchCenter.y * a.pinchScale -
                        b.deltaY / a.game.camera.scale.y,
                    ))
                  );
              };
            })(this),
          ),
          this.game.TouchManager.register(
            this,
            "pinchend",
            (function (a) {
              return function (b) {
                return ((a.userScale = null), (a.userCenter = null));
              };
            })(this),
          ),
          this.game.TouchManager.register(
            null,
            "pan",
            (function (a) {
              return function (b) {
                if (
                  !a.game.level.pers1.cursors.active &&
                  !a.game.level.pers2.cursors.active
                )
                  return (
                    null == a.userCenter &&
                      (a.panOrigin = {
                        x: -a.level.root.x,
                        y: -a.level.root.y,
                      }),
                    (a.userCenter = new box2d.b2Vec2(
                      a.panOrigin.x - b.deltaX / a.game.camera.scale.x,
                      a.panOrigin.y - b.deltaY / a.game.camera.scale.y,
                    ))
                  );
              };
            })(this),
          ),
          this.game.TouchManager.register(
            null,
            "panend",
            (function (a) {
              return function (b) {
                return (a.userCenter = null);
              };
            })(this),
          ));
      }
      extend(CameraManager, Object);
      CameraManager.prototype.update = function () {
        if (!this.camFreeze) return (this.updateCamera(), this.animate());
      };
      CameraManager.prototype.updateCamera = function () {
        var a, b, c, d, e, f, g, h, i, j, k;
        if (null != this.level.pers1 && null != this.level.pers2)
          return (
            (f = new box2d.b2Vec2(
              this.level.pers1.sprite.x,
              this.level.pers1.sprite.y,
            )),
            (g = new box2d.b2Vec2(
              this.level.pers2.sprite.x,
              this.level.pers2.sprite.y,
            )),
            (b = g.Clone().SelfSub(f)),
            (k = {
              width:
                this.game.realWidth -
                this.viewportPadding.left -
                this.viewportPadding.right,
              height:
                this.game.realHeight -
                this.viewportPadding.top -
                this.viewportPadding.bottom,
            }),
            (i = j = 1),
            (c =
              Math.abs(b.x) + this.worldPadding.left + this.worldPadding.right),
            (d =
              Math.abs(b.y) + this.worldPadding.top + this.worldPadding.bottom),
            (c = Math.min(c, this.game.level.size.width)),
            (d = Math.min(d, this.game.level.size.height)),
            c > k.width && (i = k.width / c),
            d > k.height && (j = k.height / d),
            (h = i < 1 || j < 1 ? Math.min(i, j) : 1),
            (e =
              "elements" === this.game.gameConfig.id ||
              this.game.bowser.mobile ||
              this.game.width <= 780 ||
              this.game.height <= 480
                ? { width: 20, height: 15 }
                : { width: 40, height: 30 }),
            h * this.game.physics.box2d.mpx(e.width) > this.game.realWidth &&
              (h = this.game.realWidth / this.game.physics.box2d.mpx(e.width)),
            h * this.game.physics.box2d.mpx(e.height) > this.game.realHeight &&
              (h =
                this.game.realHeight / this.game.physics.box2d.mpx(e.height)),
            null != this.userScale && (h = this.userScale),
            null != this.wheelScale && (h = this.wheelScale),
            (a = f.Clone().SelfAdd(b.Clone().SelfMul(0.5)).SelfMul(h)),
            null != this.userCenter &&
              (a = new box2d.b2Vec2(this.userCenter.x, this.userCenter.y)),
            this.level.debug &&
              ((h = 1),
              (a = new box2d.b2Vec2(
                this.game.realWidth / 2,
                this.game.realHeight / 2,
              )),
              (this.game.camera.x = 0),
              (this.game.camera.y = 0)),
            this.focusOn(a, h),
            this.level.debug ? void 0 : this.checkBounds()
          );
      };
      CameraManager.prototype.focusOn = function (a, b) {
        return (
          (this.target.x = Math.round(-a.x + this.game.realWidth / 2)),
          (this.target.y = Math.round(-a.y + this.game.realHeight / 2)),
          (this.target.scale = b)
        );
      };
      CameraManager.prototype.animate = function () {
        var a, b;
        if (
          this.target.x !== this.level.root.x ||
          this.target.y !== this.level.root.y ||
          this.target.scale !== this.level.root.scale.x
        )
          return (
            (a = null != this.userCenter ? 1 / 3 : 1 / 15),
            (b = 0.5),
            (this.target.ax = (this.target.x - this.level.root.x) * a),
            (this.target.ay = (this.target.y - this.level.root.y) * a),
            (this.target.ascale =
              (this.target.scale - this.level.root.scale.x) * a),
            (this.target.vx += this.target.ax),
            (this.target.vx *= b),
            (this.target.vy += this.target.ay),
            (this.target.vy *= b),
            (this.target.vscale += this.target.ascale),
            (this.target.vscale *= b),
            (this.level.root.x += this.target.vx),
            (this.level.root.y += this.target.vy),
            (this.level.root.scale.x += this.target.vscale),
            (this.level.root.scale.y += this.target.vscale)
          );
      };
      CameraManager.prototype.checkBounds = function () {
        var a, b, c, d, e, f;
        ((d = { left: false, top: false, right: false, bottom: false }),
          (b = new Phaser.Rectangle(
            0,
            0,
            this.game.level.size.width,
            this.game.level.size.height,
          )),
          (c = 0),
          (e = this.game.realWidth),
          (f = 0),
          (a = this.game.realHeight),
          c <= this.target.x + b.x * this.target.scale &&
            ((d.left = true), (this.target.x = b.x * this.target.scale)),
          e >= this.target.x + b.right * this.target.scale &&
            ((d.right = true),
            (this.target.x = e - b.right * this.target.scale)),
          f <= this.target.y + b.y * this.target.scale &&
            ((d.top = true), (this.target.y = b.top * this.target.scale)),
          a >= this.target.y + b.bottom * this.target.scale &&
            ((d.bottom = true),
            (this.target.y = a - b.bottom * this.target.scale)),
          b.width * this.target.scale < this.game.realWidth &&
            (d.right || d.left) &&
            (this.target.x =
              this.game.realWidth / 2 - (b.width * this.target.scale) / 2),
          b.height * this.target.scale < this.game.realHeight &&
            (d.top || d.bottom) &&
            (this.target.y =
              this.game.realHeight / 2 - (b.height * this.target.scale) / 2),
          (this.target.x -= this.game.realWidth / 2),
          (this.target.y -= this.game.realHeight / 2));
      };
      CameraManager.prototype.destroy = function () {
        return (
          this.camGraphics.destroy(),
          $(window).off("wheel"),
          this.game.TouchManager.unregister(this, "pinch pinchend"),
          this.game.TouchManager.unregister(null, "pan panend")
        );
      };
      return CameraManager;
    });
  }.call(this),
  function () {
    define("States/Level/Clock", [
      "./IngameMenu",
      "../Common/StoneButton",
      "Phaser",
    ], function (IngameMenu, StoneButton) {
      "use strict";
      function Clock(b, c, e) {
        ((this.getElapsedSeconds = this.getElapsedSeconds.bind(this)),
          (this.resume = this.resume.bind(this)),
          (this.stop = this.stop.bind(this)),
          (this.pause = this.pause.bind(this)),
          (this.update = this.update.bind(this)),
          (this.start = this.start.bind(this)));
        var f;
        (Clock.__super__.constructor.call(
          this,
          b,
          c,
          e,
          "TempleAssets",
          "Clock0000",
        ),
          (this.text = f = b.make.bitmapText(0, 0, "font_en", "00:00", 24)),
          f.anchor.set(0),
          (f.x = -this.text.textWidth / 2),
          (f.y = -this.height / 2 + this.text.textHeight + 20),
          this.addChild(f),
          (this.text.text = this.game.secondsToString(0)));
      }
      extend(Clock, Phaser.Sprite);
      Clock.prototype.start = function () {
        if (null != this.game) return (this.startTime = this.game.time.now);
      };
      Clock.prototype.update = function () {
        var a;
        if (null != this.startTime && !this.stopped && null == this.pauseTime)
          return (
            (a = this.getElapsedSeconds()),
            (this.text.text = this.game.secondsToString(a)),
            (this.text.x = -this.text.textWidth / 2),
            (this.text.y = -this.height / 2 + this.text.textHeight + 20)
          );
      };
      Clock.prototype.pause = function () {
        if (null == this.pauseTime)
          return (this.pauseTime = this.game.time.now);
      };
      Clock.prototype.stop = function () {
        return (this.stopped = true);
      };
      Clock.prototype.resume = function () {
        if (this.game)
          return (
            (this.startTime =
              this.startTime + (this.game.time.now - this.pauseTime)),
            (this.pauseTime = null)
          );
      };
      Clock.prototype.getElapsedSeconds = function () {
        return Math.round((this.game.time.now - this.startTime) / 1e3);
      };
      return Clock;
    });
  }.call(this),
  function () {
    define("States/Level/LevelUI", [
      "../Common/Button",
      "./Clock",
      "../Common/MuteButton",
      "Phaser",
    ], function (Button, Clock, MuteButton) {
      "use strict";
      function LevelUI(b, e) {
        ((this.pauseClicked = this.pauseClicked.bind(this)),
          (this.show = this.show.bind(this)),
          (this.layoutContent = this.layoutContent.bind(this)));
        var g, h;
        (LevelUI.__super__.constructor.call(this, b, 0, 0),
          this.game.layers.ui.addChild(this),
          (this.pauseButton = h =
            new Button(
              this.game,
              this.game.realWidth / 2,
              -this.game.realHeight / 2,
              "PopupAssets",
              "PauseButton0000",
              this.pauseClicked,
            )),
          h.sprite.anchor.set(1, 0),
          (h.hitArea = new PIXI.Circle(-h.width / 2, h.width / 2, 2 * h.width)),
          this.addChild(h),
          (this.clock = g = new Clock(this.game, 0, -this.game.realHeight / 2)),
          g.anchor.set(0.5, 0.05),
          this.addChild(g),
          (this.visible = false));
      }
      extend(LevelUI, Phaser.Group);
      LevelUI.prototype.layoutContent = function () {
        return (
          null != this.game &&
            ((this.pauseButton.x = this.game.realWidth / 2),
            (this.pauseButton.y = -this.game.realHeight / 2),
            (this.clock.y = -this.game.realHeight / 2)),
          (this.clock.x = 0)
        );
      };
      LevelUI.prototype.show = function () {
        return (this.visible = true);
      };
      LevelUI.prototype.pauseClicked = function () {
        return (console.log("pause"), this.game.level.togglePause());
      };
      return LevelUI;
    });
  }.call(this),
  function () {
    define("States/End", ["./Level/EndMenu", "./Level/GameOverMenu"], function (
      EndMenu,
      GameOverMenu,
    ) {
      "use strict";
      function End() {
        return (
          (this.shutdown = this.shutdown.bind(this)),
          (this.pauseUpdate = this.pauseUpdate.bind(this)),
          (this.layoutContent = this.layoutContent.bind(this)),
          (this.create = this.create.bind(this)),
          (this.init = this.init.bind(this)),
          End.__super__.constructor.apply(this, arguments)
        );
      }
      extend(End, Phaser.State);
      End.prototype.init = function (a) {
        return (this.levelState = a);
      };
      End.prototype.create = function () {
        return this.levelState.success
          ? (this.game.progress.update(this.levelState),
            (this.menu = new EndMenu(this.game, this.levelState)),
            this.menu.show())
          : ((this.menu = new GameOverMenu(this.game, this.levelState)),
            this.menu.show(),
            (this.restartKey = this.game.input.keyboard.addKey(
              Phaser.Keyboard.R,
            )),
            this.restartKey.onDown.add(this.levelState.retry));
      };
      End.prototype.layoutContent = function () {
        if (null != this.menu.layoutContent) return this.menu.layoutContent();
      };
      End.prototype.pauseUpdate = function () {
        return (this.menu.update(), this.game.tweens.update());
      };
      End.prototype.shutdown = function () {
        return (
          console.log(
            "shuting down end, with levelstate ",
            this.game.state.states.level,
          ),
          this.game.state.states.level.killAll()
        );
      };
      return End;
    });
  }.call(this),
  function () {
    var a = function (a, b) {
        return function () {
          return a.apply(b, arguments);
        };
      },
      b = function (a, b) {
        function d() {
          this.constructor = a;
        }
        for (var e in b) c.call(b, e) && (a[e] = b[e]);
        return (
          (d.prototype = b.prototype),
          (a.prototype = new d()),
          (a.__super__ = b.prototype),
          a
        );
      },
      c = {}.hasOwnProperty;
    define("States/Level/Level", [
      "require",
      "box2d",
      "States/Level/Devices/_define",
      "outlineFilter",
      "inlineFilter",
      "shadowFilter",
      "bevelFilter",
      "colorMatrix",
      "./Ground",
      "./character",
      "./MechManager",
      "./CameraManager",
      "./PauseMenu",
      "./CursorToggle",
      "./LevelUI",
      "States/End",
      "../Common/Navies",
    ], function (require) {
      require("box2d");
      require("States/Level/Devices/_define");
      var Ground = require("./Ground");
      var character = require("./character");
      var MechManager = require("./MechManager");
      var CameraManager = require("./CameraManager");
      var PauseMenu = require("./PauseMenu");
      var CursorToggle = require("./CursorToggle");
      var LevelUI = require("./LevelUI");
      var End = require("States/End");
      var Navies = require("../Common/Navies");
      function Level() {
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
        Level.__super__.constructor.call(this);
      }
      extend(Level, Phaser.State);
      Level.prototype.useDust = true;
      Level.prototype.init = function (a) {
        return (
          (this.levelPath = "data/" + a.filename),
          (this.levelData = a),
          (this.levelState = {
            diamonds: { red: 0, blue: 0, silver: 0 },
            time: 1 / 0,
          }),
          (this.game.time.advancedTiming = true),
          (this.game.sound.mute = !this.game.settings.fx)
        );
      };
      Level.prototype.create = function () {
        (this.game.load.tilemap(
          "map",
          this.levelPath,
          null,
          Phaser.Tilemap.TILED_JSON,
        ),
          this.game.load.onLoadComplete.addOnce(this.baseLoadComplete, this),
          this.game.load.start());
      };
      Level.prototype.baseLoadComplete = function () {
        _.defer(
          (function (a) {
            return function () {
              var b;
              return (
                (a.mapData = a.parseMapPropper()),
                (b = "./assets/atlasses/Temples/" + a.game.currentTemple.id),
                a.game.load.atlasJSONArray(
                  "TempleAssets",
                  b + "/TempleAssets.png",
                  b + "/TempleAssets.json",
                ),
                a.preloadAudioFiles(),
                a.game.load.onLoadComplete.addOnce(a.loadComplete, a),
                a.game.load.start()
              );
            };
          })(this),
        );
      };
      Level.prototype.preloadAudioFiles = function () {
        var a, b, c, d, e, f, g, h, i, k, l, m, n, o, p, q;
        for (
          "dark" === this.levelData.type
            ? ((h = "levelMusic_dark"),
              (k = "levelMusicOver"),
              (i = "levelMusicFinish"))
            : "speed" === this.levelData.type
              ? ((h = "levelMusic_speed"),
                (k = "levelMusicOver"),
                (i = "levelMusicFinish_speed"))
              : ((h = "levelMusic"),
                (k = "levelMusicOver"),
                (i = "levelMusicFinish")),
            q = { levelMusic: h, levelMusicOver: k, levelMusicFinish: i },
            this.sounds = [],
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
            ]),
            m = this.mapData.objects.Objects,
            d = 0,
            f = m.length;
          d < f;
          d++
        )
          ((l = m[d]),
            (a = MechManager.className(l.type)),
            null != a
              ? ((b =
                  (null != a.prototype.sounds && a.prototype.sounds()) || []),
                Array.isArray(b) || [b],
                (this.sounds = this.sounds.concat(b)))
              : console.warn("Object type " + l.type + " not found!"));
        for (
          this.sounds = _.uniq(this.sounds),
            n = this.sounds,
            o = [],
            e = 0,
            g = n.length;
          e < g;
          e++
        )
          ((p = n[e]),
            (c = (q[p] || p).charAt(0).toUpperCase() + (q[p] || p).slice(1)),
            o.push(this.game.load.audio(p, "./assets/audio/" + c + ".mp3")));
        return o;
      };
      Level.prototype.decodeAudio = function (a) {
        var b, c, d, e, f;
        for (f = {}, d = this.sounds, b = 0, c = d.length; b < c; b++)
          ((e = d[b]), (f[e] = this.game.add.audio(e)));
        return (
          (this.sounds = f),
          this.game.sound.setDecodedCallback(
            _.map(this.sounds),
            (function (a) {
              return function () {
                if (a.game.settings.music)
                  return (
                    (a.sounds.levelMusic.loop = true),
                    a.sounds.levelMusic.play()
                  );
              };
            })(this),
            this,
          ),
          a()
        );
      };
      Level.prototype.shutdown = function () {
        var a, b, c, d, e;
        if (
          (this.pers1.destroy(true),
          this.pers2.destroy(true),
          this.door1.destroy(true),
          this.door2.destroy(true),
          this.camManager.destroy(),
          null != this.darknessBmd &&
            this.darkness.events.onRemovedFromGroup.add(
              (function (a) {
                return function () {
                  return a.darknessBmd.destroy();
                };
              })(this),
            ),
          _.each(this.objects, function (a) {
            return a.destroy(true);
          }),
          _.each(this.game.layers, function (a) {
            return (a.update = (function (a) {
              return function () {};
            })());
          }),
          this.game.settingsSignal.remove(this.onSettingChange),
          null != this.cursorToggle &&
            (this.game.TouchManager.unregister(this.pers1.bodySprite, "tap"),
            this.game.TouchManager.unregister(this.pers2.bodySprite, "tap")),
          null != this.navies)
        ) {
          for (d = this.navies, e = [], a = 0, b = d.length; a < b; a++)
            ((c = d[a]), e.push(c.destroy(true)));
          return e;
        }
      };
      Level.prototype.killAll = function () {
        if (null != this.game)
          return (
            (this.game.physics.box2d.paused = true),
            (this.game.paused = true),
            this.ui.clock.destroy(true),
            this.ui.destroy(true),
            _.each(
              this.sounds,
              (function (a) {
                return function (a) {
                  return a.destroy();
                };
              })(),
            )
          );
      };
      Level.prototype.parseMapPropper = function () {
        var a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r;
        for (
          g = this.game.cache.getTilemapData("map").data,
            a = [],
            i = [],
            l = g.tilesets,
            b = 0,
            d = l.length;
          b < d;
          b++
        )
          ((p = l[b]),
            null != p.source &&
              ((p.src = p.source),
              (h = p.src.split("/").pop().replace(".json", "")),
              delete p.source,
              "Ground" === h ? a.push(p) : i.push(p)));
        for (g.tilesets = a, m = g.tilesets, c = 0, e = m.length; c < e; c++)
          ((p = m[c]),
            null != p.src &&
              "Ground" === (h = p.src.split("/").pop().replace(".json", "")) &&
              _.extend(p, this.game.cache.getJSON(h)));
        for (
          q = Phaser.TilemapParser.parseTiledJSON(g),
            g.tilesets = a.concat(i),
            n = g.tilesets,
            k = 0,
            f = n.length;
          k < f;
          k++
        )
          ((p = n[k]),
            null != p.src &&
              "Ground" !== (h = p.src.split("/").pop().replace(".json", "")) &&
              q.tilesets.push(_.extend(p, this.game.cache.getJSON(h))));
        return (
          (j = (function (a) {
            return function () {
              var a, b, c, d, e, f, g;
              for (g = {}, e = q.tilesets, d = 0, b = e.length; d < b; d++)
                if (((f = e[d]), null != f.tiles))
                  for (a in f.tiles)
                    ((c = f.tileproperties[a]),
                      (g[+f.firstgid + +a] = {
                        type: f.tiles[a].type,
                        properties: c,
                      }));
              return g;
            };
          })()),
          (r = j()),
          (o = (function (a) {
            return function (a) {
              var b, c, d, e;
              for (e = [], d = 0, b = a.length; d < b; d++)
                ((c = a[d]),
                  null != c.gid && null != r[+c.gid]
                    ? ("" === c.type && delete c.type,
                      e.push(_.deepObjectExtend(c, r[+c.gid])))
                    : e.push(void 0));
              return e;
            };
          })()),
          o(q.objects.Objects),
          o(q.objects.Chars),
          q
        );
      };
      Level.prototype.setupTutorial = function () {
        var a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s;
        if (
          ((h = this.game.cache.getTilemapData("map").data),
          null !=
            (s =
              _.findWhere(h.layers, {
                name: "Tutorial_" + this.game.settings.controls,
              }) || _.findWhere(h.layers, { name: "Tutorial" })))
        ) {
          for (q = {}, l = s.objects, e = 0, g = l.length; e < g; e++)
            ((j = l[e]),
              q[(i = j.properties.id)] || (q[i] = {}),
              null != j.text
                ? ((a = q[j.properties.id]).texts || (a.texts = []),
                  q[j.properties.id].texts.push(j))
                : ((b = q[j.properties.id]).rects || (b.rects = []),
                  q[j.properties.id].rects.push(
                    new Phaser.Rectangle(j.x, j.y, j.width, j.height),
                  )));
          ((this.tutorialTexts = []), (m = []));
          for (f in q)
            ((o = q[f]),
              console.log("text object", o),
              m.push(
                function () {
                  var a, b, e, f;
                  for (e = o.texts, f = [], a = 0, b = e.length; a < b; a++)
                    ((n = e[a]),
                      (r = this.game.lang.locale(n.text.text)),
                      (c = 18),
                      (k = n.x),
                      "tutorial_forest37_suffix" === n.text.text
                        ? ((d = this.game.lang.default_font),
                          "ru" === this.game.lang.getLanguage() &&
                            ((c = 12), (k += 50)))
                        : (d = this.game.lang.font),
                      (p = this.game.make.bitmapText(
                        k,
                        n.y,
                        d,
                        r,
                        c,
                        n.text.halign,
                      )),
                      (p.maxWidth = n.width),
                      (p.cacheAsBitmap = true),
                      (p.visible = false),
                      (p.rects = o.rects),
                      this.game.layers.tutorial.addChild(p),
                      f.push(this.tutorialTexts.push(p)));
                  return f;
                }.call(this),
              ));
          return m;
        }
      };
      Level.prototype.loadComplete = function () {
        var a, b, c, e, f, g, m, n, o, p;
        for (
          this.loadCompleted = true,
            this.game.clearBeforeRender = false,
            this.game.level = this,
            this.setupLayers(),
            $(
              '<div style="top:0; left: 0; width: 100%; height: 100%; position:absolute"></div>',
            ),
            this.game.config.enableDebug &&
              $(window).on(
                "keydown",
                (function (a) {
                  return function (b) {
                    if (81 === b.keyCode) return (a.debug = !a.debug);
                  };
                })(this),
              ),
            this.showfps = this.game.config.showFps,
            this.game.MechManager = new MechManager(this.game),
            this.game.physics.startSystem(Phaser.Physics.BOX2D),
            this.game.physics.box2d.setPTMRatio(32),
            this.game.physics.setBoundsToWorld = (function (a) {
              return function () {};
            })(),
            a = new Ground(this.game, this.mapData),
            this.ground = a,
            this.size = {
              width: a.options.width,
              height: a.options.height,
            },
            this.game.physics.box2d.gravity.y = 1e3,
            this.objects = this.createObjects(
              this.map,
              this.mapData.objects.Objects,
            ),
            this.createCharObjects(this.map, this.mapData.objects.Chars),
            o = _.values(this.game.physics.box2d.walls),
            b = 0,
            e = o.length;
          b < e;
          b++
        )
          ((p = o[b]),
            p.setBodyContactCallback(
              this.pers1,
              (function (a) {
                return function (b, c, d, e, f, g) {
                  return (console.log("char1 is dead"), a.pers1.kill());
                };
              })(this),
              this,
            ),
            p.setBodyContactCallback(
              this.pers2,
              (function (a) {
                return function (b, c, d, e, f, g) {
                  return (console.log("char2 is dead"), a.pers2.kill());
                };
              })(this),
              this,
            ));
        if (this.useDust)
          for (
            n = a.getNaviesPoints(), this.navies = [], c = 0, f = n.length;
            c < f;
            c++
          )
            ((m = n[c]),
              (g = new Navies(
                this.game,
                m.x,
                m.y,
                Math.floor(1 + 3 * Math.random()),
              )),
              g.scale.set(0.3 + 0.7 * Math.random()),
              this.game.layers.overGround.addChild(g),
              this.navies.push(g));
        (this.useDust &&
          null !=
            _.find(this.objects, function (a) {
              return "beamer" === a.options.type;
            }) &&
          this.fillDustLayer(),
          a.decorate(this.objects),
          this.setupDarkness(),
          this.setupTutorial(),
          (this.pauseMenu = new PauseMenu(this.game, this)),
          (this.pauseKey = this.game.input.keyboard.addKey(Phaser.Keyboard.P)),
          this.pauseKey.onDown.add(this.togglePause),
          (this.ui = new LevelUI(this.game, this)),
          (this.camManager = new CameraManager(this)),
          (this.root.alpha = 0),
          requestAnimationFrame(
            (function (a) {
              return function () {
                if (
                  ((a.game.stage.backgroundColor = 0),
                  a.onReady.dispatch(),
                  (a.root.alpha = 1),
                  (a.game.layers.ui.alpha = 1),
                  a.ui.show(),
                  null != a.cursorToggle)
                )
                  return a.cursorToggle.init();
              };
            })(this),
          ),
          (this.game.physics.box2d.useElapsedTime = true),
          (this.game.physics.box2d.paused = true),
          (this.game.physics.box2d.update = function () {
            var a;
            if (!this.paused)
              return (
                (a = Math.min(0.04, this.game.time.elapsed / 1e3)),
                this.world.Step(
                  a,
                  this.velocityIterations,
                  this.positionIterations,
                )
              );
          }),
          this.decodeAudio(
            (function (a) {
              return function () {
                return (console.log("load completed"), a.startLevel());
              };
            })(this),
          ));
      };
      Level.prototype.layoutContent = function () {
        if (
          (null != this.ui && this.ui.layoutContent(),
          null != this.pauseMenu && this.pauseMenu.layoutContent(),
          null != this.cursorToggle && this.cursorToggle.layoutContent(),
          null != this.pers1 &&
            null != this.pers1.cursors.layoutContent &&
            this.pers1.cursors.layoutContent(),
          null != this.pers2 && null != this.pers2.cursors.layoutContent)
        )
          return this.pers2.cursors.layoutContent();
      };
      Level.prototype.start = function () {};
      Level.prototype.startLevel = function () {
        var a;
        for (
          this.game.time.addvancedTiming = true,
            _.delay(
              (function (a) {
                return function () {
                  if (a.game.time.suggestedFps < 40)
                    return (
                      (a.useDust = false),
                      _.each(a.navies, function (a) {
                        return a.destroy();
                      }),
                      a.game.layers.dust.destroy()
                    );
                };
              })(this),
              3e3,
            ),
            this.levelStarted = true,
            this.game.MechManager.resetStates(),
            this.game.physics.box2d.paused = false,
            this.game.forceSingleUpdate = false,
            a = 0;
          a <= 3;
          ++a
        )
          this.game.updateLogic(this.game.time.desiredFpsMult);
        return (
          this.game.updateRender(
            this.game.time.slowMotion * this.game.time.desiredFps,
          ),
          (this.game.forceSingleUpdate = true),
          (this.game.physics.box2d.paused = true),
          console.log("start timer, and whatever"),
          _.delay(
            (function (a) {
              return function () {
                return (
                  (a.camManager.camFreeze = false),
                  _.delay(function () {
                    if (
                      ((a.restartKey = a.game.input.keyboard.addKey(
                        Phaser.Keyboard.R,
                      )),
                      a.restartKey.onDown.add(a.retry),
                      null != a.game.physics.box2d)
                    )
                      return (
                        a.ui.clock.start(),
                        (a.game.physics.box2d.paused = false)
                      );
                  }, 400)
                );
              };
            })(this),
            1600,
          )
        );
      };
      Level.prototype.togglePause = function () {
        return (
          (this.game.paused = !this.game.paused),
          this.game.paused
            ? ((this.root.alpha.cacheAsBitmap = true),
              this.pauseMenu.show(),
              this.ui.clock.pause())
            : ((this.root.alpha.cacheAsBitmap = false),
              (this.root.alpha = 1),
              this.pauseMenu.hide(),
              this.ui.clock.resume())
        );
      };
      Level.prototype.pauseUpdate = function () {
        if (this.loadCompleted)
          return (
            this.pauseMenu.update(),
            null != this.pauseMenu.settingsMenu &&
              this.pauseMenu.settingsMenu.update(),
            this.game.tweens.update(),
            this.camManager.update()
          );
      };
      Level.prototype.setupLayers = function () {
        var a, layers;
        return (
          (layers = {}),
          (this.root = this.game.make.group(0, 0)),
          (a = (function (a) {
            return function (key) {
              return (
                (layers[key] = a.game.make.group()),
                (layers[key].name = key),
                a.root.addChild(layers[key])
              );
            };
          })(this)),
          a("background"),
          a("tutorial"),
          a("underGround"),
          a("lights"),
          a("ground"),
          a("overGround"),
          a("chars"),
          a("overChars"),
          a("decorations"),
          a("liquids"),
          (layers.liquids.update = function () {
            return _.each(this.children, function (a) {
              return a.update();
            });
          }),
          this.game.add.existing(this.root),
          (layers.ui = this.game.make.group()),
          (layers.ui.alpha = 0),
          this.game.add.existing(layers.ui),
          (layers.ui.update = function () {
            return _.each(this.children, function (a) {
              return a.update();
            });
          }),
          (layers.dust = this.game.make.group()),
          (layers.dust.sources = []),
          this.root.addChild(layers.dust),
          (this.game.layers = layers)
        );
      };
      Level.prototype.setupDarkness = function () {
        var a, b;
        if (null != this.levelData.type && "dark" === this.levelData.type)
          return (
            (this.darknessBmd = a =
              this.game.add.bitmapData(
                this.size.width + 64,
                this.size.height + 64,
              )),
            (a.offset = { x: 32, y: 32 }),
            (this.darkness = b = this.game.make.sprite(-32, -32, a)),
            (b.blendMode = Phaser.blendModes.MULTIPLY),
            (this.game.layers.darkGradients = this.game.make.group(0, 0)),
            this.root.addChild(this.game.layers.darkGradients),
            this.root.addChild(b),
            this.updateDarkness(a),
            (this.game.layers.darkGradients.update = (function (b) {
              return function () {
                if (null != b.game.physics) return b.updateDarkness(a);
              };
            })(this))
          );
      };
      Level.prototype.updateDarkness = function (a) {
        var b, c, d, e;
        for (
          a.ctx.globalCompositeOperation = "source-over",
            a.ctx.beginPath(),
            a.ctx.rect(0, 0, this.size.width + 64, this.size.height + 64),
            a.ctx.fillStyle = "#000000",
            a.ctx.fill(),
            this.pers1.drawDarkMask(a),
            this.pers2.drawDarkMask(a),
            e = this.objects,
            b = 0,
            c = e.length;
          b < c;
          b++
        )
          ((d = e[b]), null != d.drawDarkMask && d.drawDarkMask(a));
        return (a.dirty = true);
      };
      Level.prototype.fillDustLayer = function () {
        var a, b, c, d;
        for (
          d = this.game.layers.dust, a = 0, b = Math.ceil(this.size.width / 20);
          0 <= b ? a <= b : a >= b;
          0 <= b ? ++a : --a
        )
          ((c = this.game.make.sprite(
            Math.random() * this.size.width,
            Math.random() * this.size.height,
            "GroundAssets",
            "BeamDust0000",
          )),
            (c.rotation = 180 * Math.random()),
            d.add(c));
        return (
          (d.maskGraphics = this.game.make.graphics(0, 0)),
          this.root.addChild(d.maskGraphics),
          (d.mask = d.maskGraphics),
          d
        );
      };
      Level.prototype.createObjects = function (a, b) {
        var c, d, e, f, g, h;
        for (e = [], f = 0, g = b.length; f < g; f++)
          ((h = b[f]),
            console.log("create", h.name, h.type),
            (c = MechManager.className(h.type)),
            null != c
              ? ((d = new c(this.game, h)), e.push(d))
              : console.warn("Object type " + h.type + " not found!"));
        return (this.game.MechManager.connectPortals(), e);
      };
      Level.prototype.createCharObjects = function (a, b) {
        var c, d, f;
        for (this.totalDiamonds = 0, c = 0, d = b.length; c < d; c++)
          ((f = b[c]),
            console.log("found char object", f.type),
            "char" === f.type &&
              (null == f.properties || "fb" === f.properties.char
                ? ((this.pers1 = new character(this.game, f.x, f.y, "fb")),
                  this.pers1.signal.add(this.checkEndGame))
                : "wg" === f.properties.char &&
                  ((this.pers2 = new character(this.game, f.x, f.y, "wg")),
                  this.pers2.signal.add(this.checkEndGame))),
            "door" === f.type &&
              (null == f.properties || "fb" === f.properties.char
                ? ((this.door1 = new Devices.Door(this.game, f.x, f.y, "fb")),
                  this.door1.signal.add(this.checkEndGame))
                : "wg" === f.properties.char &&
                  ((this.door2 = new Devices.Door(this.game, f.x, f.y, "wg")),
                  this.door2.signal.add(this.checkEndGame))),
            "diamond" === f.type &&
              (new Devices.Diamond(this.game, f.x, f.y, f.properties.char),
              "silver" !== f.properties.char && this.totalDiamonds++));
        return (
          this.setupCursorToggle(),
          this.game.settingsSignal.add(this.onSettingChange)
        );
      };
      Level.prototype.onSettingChange = function (a) {
        if ("controls" === a)
          return (
            null != this.cursorToggle &&
              (this.cursorToggle.destroy(), (this.cursorToggle = null)),
            this.setupCursorToggle()
          );
      };
      Level.prototype.setupCursorToggle = function () {
        if ("single" === this.game.settings.controls)
          return (
            this.game.TouchManager.register(
              this.pers1.bodySprite,
              "tap",
              (function (a) {
                return function (b) {
                  return a.cursorToggle.setChar("fb", b);
                };
              })(this),
            ),
            this.game.TouchManager.register(
              this.pers2.bodySprite,
              "tap",
              (function (a) {
                return function (b) {
                  return a.cursorToggle.setChar("wg", b);
                };
              })(this),
            ),
            (this.cursorToggle = new CursorToggle(this.game)),
            this.game.layers.ui.addChild(this.cursorToggle),
            this.cursorToggle.onChange.add(
              (function (a) {
                return function (b) {
                  return "fb" === b
                    ? (a.pers1.cursors.show(), a.pers2.cursors.hide())
                    : (a.pers1.cursors.hide(), a.pers2.cursors.show());
                };
              })(this),
            )
          );
      };
      Level.prototype.updateMusic = function () {
        if (
          (null != this.sounds.levelMusic && this.sounds.levelMusic.stop(),
          this.game.settings.music)
        )
          return this.sounds.levelMusic.play();
      };
      Level.prototype.checkEndGame = function () {
        if (!this.ended)
          return (
            this.door1.isUp &&
              this.door2.isUp &&
              ((this.ended = true),
              (this.game.physics.box2d.paused = true),
              this.animateFinish()),
            this.pers1.isDead || this.pers2.isDead
              ? ((this.ended = true),
                (this.game.physics.box2d.paused = true),
                this.gameOver())
              : void 0
          );
      };
      Level.prototype.animateFinish = function () {
        return (
          this.game.level.sounds.levelMusic.stop(),
          this.game.level.sounds.levelMusicFinish.play(),
          this.pers1.animateStairs(this.door1),
          this.pers2.animateStairs(this.door2),
          _.delay(
            (function (a) {
              return function () {
                return a.gameFinish();
              };
            })(this),
            1600,
          )
        );
      };
      Level.prototype.gameFinish = function () {
        return (
          (this.levelState.diamonds =
            this.pers1.data.diamonds + this.pers2.data.diamonds),
          (this.levelState.silverDiamond =
            this.pers1.data.silverDiamond + this.pers2.data.silverDiamond),
          (this.levelState.time = this.ui.clock.getElapsedSeconds()),
          this.ui.clock.stop(),
          (this.levelData.totalDiamonds = this.totalDiamonds),
          this.game.state.add("endGame", End),
          this.game.state.start("endGame", false, false, {
            success: true,
            data: this.levelData,
            state: this.levelState,
            retry: this.retry,
          })
        );
      };
      Level.prototype.update = function () {
        if (this.loadCompleted)
          return (
            this.showfps && $("#debug-fps").html(this.game.time.fps),
            this.debug && this.game.debug.box2dWorld(),
            this.ui.update(),
            this.useDust && this.updateDust(),
            null != this.tutorialTexts && this.updateTutorial(),
            this.camManager.update()
          );
      };
      Level.prototype.updateTutorial = function () {
        var a, b, c, d, e, f, g, h, i, j, k;
        for (f = this.tutorialTexts, h = [], a = 0, c = f.length; a < c; a++) {
          for (
            j = f[a], k = false, g = j.rects, b = 0, d = g.length;
            b < d;
            b++
          )
            ((e = g[b]),
              (e.contains(this.pers1.sprite.x, this.pers1.sprite.y) ||
                e.contains(this.pers2.sprite.x, this.pers2.sprite.y)) &&
                (k = true));
          (k &&
            !j.shown &&
            ((j.visible = true),
            (j.shown = true),
            (j.alpha = 0),
            this.game.add.tween(j).to({ alpha: 1 }, 400, "Linear", true)),
            !k && j.shown
              ? ((j.shown = false),
                (j.alpha = 1),
                (i = this.game.add
                  .tween(j)
                  .to({ alpha: 0 }, 400, "Linear", true)),
                h.push(
                  i.onComplete.add(
                    (function (a) {
                      return function (a) {
                        return (a.visible = false);
                      };
                    })(),
                  ),
                ))
              : h.push(void 0));
        }
        return h;
      };
      Level.prototype.updateDust = function () {
        var a, b, c, d, e, f, g, h, i, j, k, l, m, n, o;
        if (
          null != this.game.layers.dust &&
          this.game.layers.dust.sources.length > 0
        ) {
          for (
            i = false, j = this.game.layers.dust.sources, c = 0, e = j.length;
            c < e;
            c++
          )
            ((o = j[c]), o.dirty && (i = true));
          if (i) {
            for (
              this.game.layers.dust.maskGraphics.clear(),
                this.game.layers.dust.maskGraphics.lineStyle(40, 0, 1),
                a = true,
                k = this.game.layers.dust.sources,
                d = 0,
                f = k.length;
              d < f;
              d++
            )
              ((o = k[d]),
                null != o.points &&
                  o.points.length > 0 &&
                  ((a = false),
                  o.drawBeam(this.game.layers.dust.maskGraphics, o.points)));
            this.game.layers.dust.visible = !a;
          }
          for (
            l = this.game.layers.dust.children, m = [], b = h = 0, g = l.length;
            h < g;
            b = ++h
          )
            ((n = l[b]),
              (n.angle += 0.002 * ((b % 2) * 2 - 1)),
              m.push(n.anchor.set(Math.sin(n.angle), Math.cos(n.angle))));
          return m;
        }
      };
      Level.prototype.retry = function () {
        return (
          this.game.level.sounds.levelMusic.stop(),
          this.game.state.add("level", Level),
          this.game.state.fade("level", true, false, this.levelData),
          this.killAll()
        );
      };
      Level.prototype.gameOver = function () {
        return (
          this.ui.clock.stop(),
          this.game.state.add("endGame", End),
          this.game.state.start("endGame", false, false, {
            success: false,
            data: this.levelData,
            state: this.levelState,
            retry: this.retry,
          })
        );
      };
      Level.prototype.quit = function () {
        return (
          this.game.level.sounds.levelMusic.stop(),
          this.game.state.fade(
            "levelMenu",
            true,
            false,
            this.game.currentTemple,
          ),
          this.killAll()
        );
      };
      return Level;
    });
  }.call(this),
  function () {
    define("States/Common/RewardedAdMenu", [
      "require",
      "Phaser",
      "../Level/IngameMenu",
      "../Common/StoneButton",
      "./RewardedUnavailableMenu",
    ], function (require) {
      require("Phaser");
      var IngameMenu = require("../Level/IngameMenu");
      var StoneButton = require("../Common/StoneButton");
      var RewardedUnavailableMenu = require("./RewardedUnavailableMenu");
      function RewardedAdMenu(b, c) {
        ((this.close = this.close.bind(this)),
          (this.rewardedShown = this.rewardedShown.bind(this)),
          (this.watchAd = this.watchAd.bind(this)),
          (this.rewardedAdCompleted = this.rewardedAdCompleted.bind(this)),
          (this.renderContent = this.renderContent.bind(this)),
          RewardedAdMenu.__super__.constructor.call(this, b, c),
          (this.onClose = new Phaser.Signal()),
          (this.button = c.button),
          (this.buttonClick = c.buttonClick),
          (this.rewarded = false));
      }
      extend(RewardedAdMenu, IngameMenu);
      RewardedAdMenu.prototype.renderContent = function () {
        var a, b;
        return (
          (b = this.game.make.bitmapText(
            0,
            -this.contentSize.halfHeight / 2 + 30,
            this.game.lang.font,
            this.game.lang.locale("rewarded_header1"),
            26,
          )),
          b.anchor.set(0.5),
          this.board.addChild(b),
          (b = this.game.make.bitmapText(
            0,
            -this.contentSize.halfHeight / 2 + 120,
            this.game.lang.font,
            this.game.lang.locale("rewarded_header2"),
            26,
          )),
          b.anchor.set(0.5),
          this.board.addChild(b),
          (a = new StoneButton(
            this.game,
            -this.contentSize.width / 4,
            (1.1 * this.contentSize.halfHeight) / 2,
            this.game.lang.locale("rewarded_close"),
            this.close,
          )),
          a.anchor.set(0.5),
          this.board.addChild(a),
          (this.watchButton = a =
            new StoneButton(
              this.game,
              this.contentSize.width / 4,
              (1.1 * this.contentSize.halfHeight) / 2,
              this.game.lang.locale("rewarded_watch"),
              this.watchAd,
            )),
          a.anchor.set(0.5),
          this.board.addChild(a)
        );
      };
      RewardedAdMenu.prototype.rewardedAdCompleted = function () {
        return (this.rewarded = true);
      };
      RewardedAdMenu.prototype.watchAd = function () {
        if (!this.debounceClick)
          return (
            (this.game.sound.mute = true),
            (this.game.paused = true),
            (this.watchButton.alpha = 0.5),
            (this.debounceClick = true)
          );
      };
      RewardedAdMenu.prototype.rewardedShown = function () {
        return (
          (this.game.sound.mute = !this.game.settings.fx),
          (this.game.paused = false),
          this.rewarded ||
            ((this.menu = new RewardedUnavailableMenu(this.game)),
            this.menu.show()),
          (this.button.data.rewarded = true),
          this.buttonClick(this.button),
          (this.rewarded = false)
        );
      };
      RewardedAdMenu.prototype.close = function () {
        return (
          this.hide(),
          _.delay(
            (function (a) {
              return function () {
                return a.onClose.dispatch();
              };
            })(this),
            1e3,
          )
        );
      };
      return RewardedAdMenu;
    });
  }.call(this),
  function () {
    define("States/Common/SoftLockMenu", [
      "../Level/IngameMenu",
      "../Common/StoneButton",
      "Phaser",
    ], function (IngameMenu, StoneButton) {
      "use strict";
      function SoftLockMenu(b, c) {
        ((this.close = this.close.bind(this)),
          (this.renderContent = this.renderContent.bind(this)),
          SoftLockMenu.__super__.constructor.call(this, b, c),
          (this.onClose = new Phaser.Signal()));
      }
      extend(SoftLockMenu, IngameMenu);
      SoftLockMenu.prototype.renderContent = function () {
        var a, b, c;
        return (
          (c =
            this.game.lang.locale("this") +
            " " +
            this.game.lang.locale(this.options.label) +
            " " +
            this.game.lang.locale("not_yet")),
          (b = this.game.make.bitmapText(
            0,
            -this.contentSize.halfHeight / 2 + 30,
            this.game.lang.font,
            c,
            26,
          )),
          b.anchor.set(0.5),
          this.board.addChild(b),
          (b = this.game.make.bitmapText(
            0,
            -this.contentSize.halfHeight / 2 + 140,
            this.game.lang.font,
            this.game.lang.locale("complete_more"),
            22,
          )),
          b.anchor.set(0.5),
          this.board.addChild(b),
          (b = this.game.make.bitmapText(
            0,
            -this.contentSize.halfHeight / 2 + 200,
            this.game.lang.font,
            this.game.lang.locale("to_unlock"),
            22,
          )),
          b.anchor.set(0.5),
          this.board.addChild(b),
          (a = new StoneButton(
            this.game,
            0,
            (1.1 * this.contentSize.halfHeight) / 2,
            this.game.lang.locale("Ok!"),
            this.close,
          )),
          a.anchor.set(0.5),
          this.board.addChild(a)
        );
      };
      SoftLockMenu.prototype.close = function () {
        return (
          this.hide(),
          _.delay(
            (function (a) {
              return function () {
                return a.onClose.dispatch();
              };
            })(this),
            1e3,
          )
        );
      };
      return SoftLockMenu;
    });
  }.call(this),
  function () {
    define("States/LevelMenu/LevelMenuButtons", [
      "require",
      "Phaser",
      "./LevelButton",
      "States/Buy/BuyMenu",
      "States/Common/RewardedAdMenu",
      "States/Common/SoftLockMenu",
      "colorMatrix",
      "bevelFilter",
      "outlineFilter",
    ], function (require) {
      var Phaser = require("Phaser");
      var LevelButton = require("./LevelButton");
      var BuyMenu = require("States/Buy/BuyMenu");
      var RewardedAdMenu = require("States/Common/RewardedAdMenu");
      var SoftLockMenu = require("States/Common/SoftLockMenu");
      var ColorMatrix = require("colorMatrix");
      var BevelFilter = require("bevelFilter");
      var OutlineFilter = require("outlineFilter");
      function LevelMenuButtons(b, c) {
        ((this.buttonClick = this.buttonClick.bind(this)),
          (this.toggleNumbers = this.toggleNumbers.bind(this)),
          (this.destroy = this.destroy.bind(this)),
          (this.layoutContent = this.layoutContent.bind(this)),
          (this.showPopup = this.showPopup.bind(this)),
          LevelMenuButtons.__super__.constructor.call(this, b),
          (this.onClick = new Phaser.Signal()),
          (this.templeData = c),
          (this.currentMenu = null),
          this.addContent());
      }
      extend(LevelMenuButtons, Phaser.Sprite);
      LevelMenuButtons.prototype.addContent = function () {
        var a,
          b,
          c,
          d,
          g,
          h,
          i,
          j,
          k,
          l,
          m,
          n,
          o,
          p,
          q,
          r,
          s,
          t,
          u,
          v,
          w,
          x,
          y,
          z,
          A,
          B,
          C,
          D,
          E,
          F;
        for (
          j = 0.9 * this.game.realHeight,
            D = Math.min(1.2 * j, 0.9 * this.game.realWidth),
            3,
            y = Math.min(j, D) < 800 ? 0.5 : 0.6,
            h = (function (a) {
              return function (a) {
                return _.find(B.levels, function (b) {
                  return b._id === a;
                });
              };
            })(),
            B = this.templeData,
            g = (function (a) {
              return function (b, c) {
                var d, e, f, g, i, k, l, m, n, o, p, q, r;
                for (
                  null == c && (c = 1),
                    e = a.game.add.bitmapData(D, j),
                    e.ctx.strokeStyle = a.templeData.color,
                    e.ctx.lineWidth = 16 * y,
                    o = B.edges,
                    i = 0,
                    m = o.length;
                  i < m;
                  i++
                )
                  ((f = o[i]),
                    (q = h(f.source)),
                    (r = h(f.target)),
                    (b || q.state + r.state > 2) &&
                      (e.ctx.moveTo(q.x * D, q.y * j),
                      e.ctx.lineTo(r.x * D, r.y * j),
                      e.ctx.stroke()));
                for (p = B.levels, k = 0, n = p.length; k < n; k++)
                  ((l = p[k]),
                    (b || l.state > 0 || l.rewarded) &&
                      ((g =
                        "puzzle" === l.type
                          ? "DiamondPuzzle_Bkg_Mask"
                          : "speed" === l.type
                            ? "DiamondSpeed_Bkg_Mask"
                            : "dark" === l.type
                              ? "DiamondDark_Bkg_Mask"
                              : "Diamond_Bkg_Mask"),
                      (d = a.game.make.sprite(0, 0, "MenuAssets", g + "0000")),
                      d.scale.set(y * c),
                      e.draw(
                        d,
                        l.x * D - d.width / 2,
                        l.y * j - d.height / 2,
                      )));
                return a.game.make.image(0, 0, e);
              };
            })(this),
            this.imageAll = g(true),
            this.imageAllBig = g(true, 1.2),
            this.imageDone = g(false),
            l = new BevelFilter(this.game, D, j, 180, 0, 0, 1),
            l.init(),
            m = new BevelFilter(this.game, D, j, 200, 0, 0, -1),
            m.init(),
            t = new BevelFilter(this.game, D, j, 200, 0, 1, 1),
            t.init(),
            i = new ColorMatrix(this.game, D, j, 16766496),
            a = new ColorMatrix(
              this.game,
              D,
              j,
              parseInt("0x" + this.templeData.color.replace("#", "")),
            ),
            u = new OutlineFilter(this.game, D, j, 3, 0),
            u.init(),
            d = (function (a) {
              return function (b, c) {
                var d, e;
                return (
                  (b.filters = c),
                  (d = new Phaser.RenderTexture(
                    a.game,
                    D,
                    j,
                    "treeTexture",
                    void 0,
                    1,
                  )),
                  (a.game.renderer.renderSession.resolution = 1),
                  d.renderRawXY(b, 0, 0, true),
                  (a.game.renderer.renderSession.resolution =
                    a.game.resolution),
                  a.game.cache.addRenderTexture("treeTexture", d),
                  (e = a.game.make.sprite(
                    0,
                    0,
                    a.game.cache.getRenderTexture("treeTexture").texture,
                  )),
                  (e.x = -D / 2),
                  (e.y = -j / 2),
                  a.addChild(e),
                  e
                );
              };
            })(this),
            d(this.imageAllBig, [t, a]),
            d(this.imageAll, [m, a, u]),
            d(this.imageDone, [l, i]),
            this.imageAll.key.destroy(),
            this.imageAllBig.key.destroy(),
            this.imageDone.key.destroy(),
            this.imageAll.destroy(),
            this.imageAllBig.destroy(),
            this.imageDone.destroy(),
            z = (function (a) {
              return function (a) {
                return 0 === a
                  ? "0000"
                  : 1 === a
                    ? "0000"
                    : 2 === a
                      ? "0001"
                      : 3 === a
                        ? "0002"
                        : 4 === a
                          ? "0003"
                          : void 0;
              };
            })(),
            s = this.game.make.group(0, 0),
            x = this.game.make.group(0, 0),
            this.numbers = [],
            v = B.levels,
            k = n = 0,
            p = v.length;
          n < p;
          k = ++n
        )
          ((o = v[k]),
            (E = o.x * D - D / 2),
            (F = o.y * j - j / 2),
            o.locked
              ? ((q = new Phaser.Sprite(
                  this.game,
                  E,
                  F,
                  "MenuAssets",
                  "Lock0000",
                )),
                q.scale.set(y),
                q.anchor.set(0.5),
                this.addChild(q))
              : ((c = this.buttonClick),
                (b = new LevelButton(this.game, E, F, o.type, z(o.state), c)),
                b.scale.set(y),
                b.anchor.set(0.5),
                (b.data = o),
                this.addChild(b),
                o.state > 0 &&
                  o.isNew &&
                  ((r = new Phaser.BitmapText(
                    this.game,
                    E,
                    F,
                    this.game.lang.font,
                    this.game.lang.locale("new"),
                  )),
                  (r.x += 40),
                  (r.y -= 20),
                  r.scale.set(y),
                  r.anchor.set(0.5),
                  s.addChild(r))),
            (A = {
              font: "28px Arial",
              fill: "#ffffff",
              fontWeight: "bold",
              stroke: "#000000",
              strokeThickness: 4,
            }),
            (C = this.game.make.text(E, F + 3, o.id, A)),
            C.anchor.set(0.5),
            (C.cacheAsBitmap = true),
            (C.visible = false),
            this.addChild(C),
            this.numbers.push(C));
        return (this.addChild(s), this.addChild(x));
      };
      LevelMenuButtons.prototype.showPopup = function (a) {
        var b;
        if (null === this.currentMenu)
          return (
            console.log("show popup for", a.type),
            "rewarded" === a.type
              ? (b = new RewardedAdMenu(this.game, {
                  button: a.button,
                  buttonClick: a.buttonClick,
                }))
              : "softLock" === a.type
                ? (b = new SoftLockMenu(this.game, { label: "level" }))
                : "buyTemple" === a.type && (b = new BuyMenu(this.game)),
            (this.currentMenu = b),
            b.show(),
            b.onClose.add(
              (function (a) {
                return function () {
                  return (a.currentMenu.destroy(), (a.currentMenu = null));
                };
              })(this),
            )
          );
      };
      LevelMenuButtons.prototype.layoutContent = function () {
        if (null != this.currentMenu && null != this.currentMenu.layoutContent)
          return this.currentMenu.layoutContent();
      };
      LevelMenuButtons.prototype.destroy = function () {
        return (
          null != this.currentMenu && this.currentMenu.destroy(),
          LevelMenuButtons.__super__.destroy.apply(this, arguments)
        );
      };
      LevelMenuButtons.prototype.toggleNumbers = function (a) {
        var b, c, d, e, f;
        for (d = this.numbers, e = [], b = 0, c = d.length; b < c; b++)
          ((f = d[b]), e.push((f.visible = a)));
        return e;
      };
      LevelMenuButtons.prototype.buttonClick = function (a) {
        return this.onClick.dispatch(a);
      };
      return LevelMenuButtons;
    });
  }.call(this),
  function () {
    define("States/LevelMenu/LevelMenuGrid", [
      "./LevelMenuButtons",
      "Phaser",
    ], function (LevelMenuButtons) {
      "use strict";
      function LevelMenuGrid() {
        return LevelMenuGrid.__super__.constructor.apply(this, arguments);
      }
      extend(LevelMenuGrid, LevelMenuButtons);
      return LevelMenuGrid;
    });
  }.call(this),
  function () {
    define("States/LevelMenu/LevelMenuTree", [
      "./LevelMenuButtons",
      "Phaser",
    ], function (LevelMenuButtons) {
      "use strict";
      function LevelMenuTree() {
        return LevelMenuTree.__super__.constructor.apply(this, arguments);
      }
      extend(LevelMenuTree, LevelMenuButtons);
      return LevelMenuTree;
    });
  }.call(this),
  function () {
    define("States/Buy/Buy", ["./BuyMenu", "Phaser"], function (BuyMenu) {
      "use strict";
      function Buy() {
        return (
          (this.doKill = this.doKill.bind(this)),
          (this.create = this.create.bind(this)),
          (this.init = this.init.bind(this)),
          Buy.__super__.constructor.apply(this, arguments)
        );
      }
      extend(Buy, Phaser.State);
      Buy.prototype.init = function (a) {
        return (this.levelState = a);
      };
      Buy.prototype.create = function () {
        return (
          (this.menu = new BuyMenu(this.game)),
          this.menu.show(),
          this.menu.onClose.add(this.doKill)
        );
      };
      Buy.prototype.doKill = function () {
        return (
          this.menu.destroy(),
          _.delay(
            (function (a) {
              return function () {
                return a.shutdown();
              };
            })(this),
            1e3,
          )
        );
      };
      return Buy;
    });
  }.call(this),
  function () {
    define("States/LevelMenu/LevelMenu", [
      "require",
      "Phaser",
      "../Common/UIState",
      "./LevelButton",
      "States/Level/Level",
      "../Common/BackButton",
      "../Common/Button",
      "./LevelMenuGrid",
      "./LevelMenuTree",
      "./LevelMenuButtons",
      "States/Buy/Buy",
      "States/Complete/Complete",
    ], function (require) {
      require("Phaser");
      var UIState = require("../Common/UIState");
      require("./LevelButton");
      var Level = require("States/Level/Level");
      var BackButton = require("../Common/BackButton");
      var Button = require("../Common/Button");
      var LevelMenuGrid = require("./LevelMenuGrid");
      var LevelMenuTree = require("./LevelMenuTree");
      require("./LevelMenuButtons");
      var Buy = require("States/Buy/Buy");
      var Complete = require("States/Complete/Complete");
      class LevelMenu extends UIState {
        constructor() {
          super(...arguments);
          ((this.goBack = this.goBack.bind(this)),
            (this.startLevel = this.startLevel.bind(this)),
            (this.layoutContent = this.layoutContent.bind(this)),
            (this.afterAddContent = this.afterAddContent.bind(this)),
            (this.toggleNumbers = this.toggleNumbers.bind(this)),
            (this.preload = this.preload.bind(this)),
            (this.init = this.init.bind(this)),
            (this.onReady = new Phaser.Signal()));
        }
        preload() {
          var a;
          if (
            (super.preload(arguments),
            (a = "./assets/atlasses/Temples/" + this.templeData.id),
            this.game.load.atlasJSONArray(
              "TempleAssets",
              a + "/TempleAssets.png",
              a + "/TempleAssets.json",
            ),
            this.game.device.desktop)
          )
            return ((this.divID = "rtb-v-1"), (this.blockID = "R-A-800494-9"));
        }
        layoutContent() {
          var a, b, c;
          return (
            super.layoutContent(),
            (c = this.game.realWidth),
            (a = this.game.realHeight),
            (this.bkg.width = c),
            (this.bkg.height = a),
            (this.bkg.x = -c / 2),
            (this.bkg.y = -a / 2),
            null != this.text &&
              (a > 800
                ? ((this.text.fontSize = 38),
                  this.text.anchor.set(0, 0.5),
                  (this.text.y = -a / 2 + 100),
                  (this.text.x = 0 - this.text.width / 2))
                : ((this.text.fontSize = 32),
                  this.text.anchor.set(0, 0.5),
                  (this.text.x = -c / 2 + 50),
                  (this.text.y = -a / 2 + 50))),
            this.resize(),
            null != this.back &&
              (this.templeData.type,
              (b = this.back.sprite.height / 4),
              (this.back.x = -c / 2 + this.back.sprite.width / 2 + b),
              (this.back.y = a / 2 - this.back.sprite.height / 2 - b)),
            null != this.showNumBtn &&
              ((this.showNumBtn.x =
                this.game.realWidth / 2 -
                this.showNumBtn.label.textWidth / 2 -
                40),
              (this.showNumBtn.y =
                this.game.realHeight / 2 -
                this.showNumBtn.label.textHeight / 2 -
                40)),
            null != this.buttons && this.buttons.destroy(),
            "tree" === this.templeData.type
              ? ((this.buttons = new LevelMenuTree(this.game, this.templeData)),
                this.buttons.onClick.add(this.startLevel),
                this.root.addChild(this.buttons))
              : ((this.buttons = new LevelMenuGrid(this.game, this.templeData)),
                this.buttons.onClick.add(this.startLevel),
                this.root.addChild(this.buttons))
          );
        }
      }
      LevelMenu.prototype.init = function (a) {
        return (
          this.game.progress.get("temples")[0].levels[0].played ||
            (this.game.progress.setPlayed(
              this.game.progress.get("temples")[0].levels[0],
            ),
            this.game.state.add("level", Level),
            this.game.state.start(
              "level",
              true,
              false,
              this.game.progress.get("temples")[0].levels[0],
            )),
          (this.templeData = a),
          (this.game.currentTemple = a)
        );
      };
      LevelMenu.prototype.addContent = function () {
        var a, b, c, f, g, h;
        return (
          console.log("createing MenuState"),
          (this.game.stage.backgroundColor = "#000000"),
          (h = this.game.realWidth),
          (c = this.game.realHeight),
          (this.bkg = b =
            this.game.make.tileSprite(
              -h / 2,
              -c / 2,
              h,
              c,
              "TempleAssets",
              "MenuBackground0000",
            )),
          this.root.addChild(b),
          "tree" === this.templeData.type
            ? ((this.back = a =
                new BackButton(
                  this.game,
                  -h / 2 + 100,
                  c / 2 - 100,
                  this.game.lang.locale("Back"),
                  this.goBack,
                )),
              this.root.addChild(this.back),
              (this.showNumBtn = new Button(
                this.game,
                0,
                0,
                "",
                "",
                this.toggleNumbers,
              )),
              (this.showNumBtn.numsVisible = false),
              (f = this.game.make.bitmapText(
                0,
                0,
                this.game.lang.font,
                this.game.lang.locale("level_numbers"),
                20,
              )),
              f.anchor.set(0.5),
              (this.showNumBtn.label = f),
              this.showNumBtn.addChild(f),
              this.root.addChild(this.showNumBtn))
            : (c > 800
                ? ((g = this.game.make.bitmapText(
                    0,
                    -c / 2 + 120,
                    this.game.lang.font,
                    this.game.lang.locale(this.templeData.label),
                    38,
                  )),
                  g.anchor.set(0, 0.5),
                  (g.y = -c / 2 + 120),
                  (g.x = 0 - g.width / 2))
                : ((g = this.game.make.bitmapText(
                    -h / 2 + 50,
                    -c / 2 + 50,
                    this.game.lang.font,
                    this.game.lang.locale(this.templeData.label),
                    32,
                  )),
                  g.anchor.set(0, 0.5),
                  (g.x = -h / 2 + 50),
                  (g.y = -c / 2 + 50)),
              (this.text = g),
              this.root.addChild(g),
              (this.back = a =
                new BackButton(
                  this.game,
                  -h / 2 + 100,
                  0,
                  this.game.lang.locale("Back"),
                  this.goBack,
                )),
              this.root.addChild(a)),
          this.afterAddContent(),
          this.onReady.dispatch()
        );
      };
      LevelMenu.prototype.toggleNumbers = function () {
        return (
          (this.showNumBtn.numsVisible = !this.showNumBtn.numsVisible),
          this.buttons.toggleNumbers(this.showNumBtn.numsVisible)
        );
      };
      LevelMenu.prototype.afterAddContent = function () {
        return (
          this.game.progress.firstComplete &&
            ((this.game.progress.firstComplete = false),
            this.game.state.add("gameComplete", Complete),
            this.game.state.start("gameComplete", false, false, {
              success: true,
            })),
          this.layoutContent()
        );
      };
      LevelMenu.prototype.startLevel = function (a) {
        return (
          this.game.progress.setPlayed(a.data),
          null != this.game.menuMusic &&
            (this.game.menuMusic.fadeOut(500),
            this.game.menuMusic.onFadeComplete.add(function (a) {
              return a.stop();
            })),
          this.game.state.add("level", Level),
          this.game.state.fade("level", true, false, a.data, !a.data.rewarded)
        );
      };
      LevelMenu.prototype.goBack = function () {
        return "menu" !== this.game.state.current
          ? this.game.state.fade("menu", true, false)
          : console.log("dasfasdfa");
      };
      return LevelMenu;
    });
  }.call(this),
  function () {
    define("States/Menu/Menu", [
      "require",
      "Phaser",
      "../Common/UIState",
      "../Common/Button",
      "States/LevelMenu/LevelMenu",
      "States/Level/Level",
      "States/Buy/BuyMenu",
      "States/Settings/SettingsMenu",
      "States/Credits/CreditsMenu",
      "States/Menu/TempleHall",
      "States/Complete/Complete",
      "../Common/GoldButton",
    ], function (require) {
      require("Phaser");
      var UIState = require("../Common/UIState");
      var Button = require("../Common/Button");
      var LevelMenu = require("States/LevelMenu/LevelMenu");
      var Level = require("States/Level/Level");
      var BuyMenu = require("States/Buy/BuyMenu");
      var SettingsMenu = require("States/Settings/SettingsMenu");
      var CreditsMenu = require("States/Credits/CreditsMenu");
      require("States/Menu/TempleHall");
      require("States/Complete/Complete");
      var GoldButton = require("../Common/GoldButton");
      class Menu extends UIState {
        constructor() {
          super(...arguments);
          this.layoutContent = this.layoutContent.bind(this);
          this.skipToLevel = this.skipToLevel.bind(this);
          this.startTemple = this.startTemple.bind(this);
          this.showBuy = this.showBuy.bind(this);
          this.showCredits = this.showCredits.bind(this);
          this.showSettings = this.showSettings.bind(this);
          this.afterAddContent = this.afterAddContent.bind(this);
          this.preload = this.preload.bind(this);
          this.onReady = new Phaser.Signal();
        }
        layoutContent() {
          var a, b, c, d, e;
          if (
            (super.layoutContent(),
            this.game.realWidth,
            this.game.realHeight,
            null != this.appStoreButtons && this.appStoreButtons.length > 0)
          ) {
            for (
              e = this.appStoreButtons, b = c = 0, d = e.length;
              c < d;
              b = ++c
            )
              ((a = e[b]),
                (this.game.realWidth - 800) / 2 < 120
                  ? a.scale.set(0.4)
                  : (this.game.realWidth - 800) / 2 < 180
                    ? a.scale.set(0.45)
                    : a.scale.set(0.6),
                (a.x = this.game.realWidth / 2 - 20),
                (a.y = this.game.realHeight / 2 - 20 - b * a.height));
            this.upsellButton &&
              (this.game.realWidth >= 1250 && this.game.realHeight >= 810
                ? ((this.upsellButton.x = 0),
                  (this.upsellButton.y = this.game.realHeight / 2 - 50))
                : ((this.upsellButton.x = this.game.realWidth / 2 - 100),
                  (this.upsellButton.y = 0)));
          }
          if (
            (null != this.settingsButton &&
              ((this.settingsButton.x = -this.game.realWidth / 2 + 100),
              (this.settingsButton.y = this.game.realHeight / 2 - 100),
              this.game.realWidth <= 900 &&
                (this.settingsButton.x = -this.game.realWidth / 2 + 50)),
            null != this.creditsBtn &&
              ((this.creditsBtn.x = -this.game.realWidth / 2 + 200),
              (this.creditsBtn.y = this.game.realHeight / 2 - 100)),
            null != this.currentMenu && this.currentMenu.layoutContent(),
            null != this.appstoreLogo &&
              ((this.appstoreLogo.x = this.game.realWidth / 2 - 400),
              (this.appstoreLogo.y = -this.game.realHeight / 2 + 100)),
            null != this.playstoreLogo &&
              ((this.playstoreLogo.x = this.game.realWidth / 2 - 330),
              (this.playstoreLogo.y = -this.game.realHeight / 2 + 100)),
            null != this.availableImg)
          )
            return (
              (this.availableImg.x = this.game.realWidth / 2 - 420),
              (this.availableImg.y = -this.game.realHeight / 2 + 155)
            );
        }
      }
      Menu.prototype.afterAddContent = function () {
        var a, b, c, e, f, h, i, j, l;
        return (
          (c =
            "multi" === this.game.gameConfig.type
              ? ["SettingsButton0000", "SettingsButton0001"]
              : ["SettingsButton0002", "SettingsButton0003"]),
          (this.settingsButton = new Button(
            this.game,
            -this.game.realWidth / 2 + 100,
            this.game.realHeight / 2 - 100,
            "MenuAssets",
            c,
            this.showSettings,
            "pusher",
          )),
          this.root.addChild(this.settingsButton),
          (this.creditsBtn = b =
            new GoldButton(
              this.game,
              this.game.realWidth / 2 - 40,
              -this.game.realHeight / 2 + 40,
              "?",
              this.showCredits,
              30,
            )),
          (this.creditsBtn.hitArea = new PIXI.Circle(0, 0, 3 * b.width)),
          this.root.addChild(b),
          this.layoutContent()
        );
      };
      Menu.prototype.showSettings = function () {
        var a;
        return (
          (a = new SettingsMenu(this.game, this.levelState)),
          a.show(),
          (this.currentMenu = a),
          a.onClose.add(
            (function (b) {
              return function () {
                return (a.destroy(), (b.currentMenu = null));
              };
            })(this),
          )
        );
      };
      Menu.prototype.showCredits = function () {
        var a;
        return (
          (a = new CreditsMenu(this.game)),
          a.show(),
          (this.currentMenu = a),
          a.onClose.add(
            (function (b) {
              return function () {
                return (a.destroy(), (b.currentMenu = null));
              };
            })(this),
          )
        );
      };
      Menu.prototype.showBuy = function () {
        var a;
        return (
          (a = new BuyMenu(this.game)),
          a.show(),
          (this.currentMenu = a),
          a.onClose.add(
            (function (b) {
              return function () {
                return (a.destroy(), (b.currentMenu = null));
              };
            })(this),
          )
        );
      };
      Menu.prototype.startTemple = function (a) {
        return (
          this.game.state.add("levelMenu", LevelMenu),
          this.game.state.start("levelMenu", true, false, a)
        );
      };
      Menu.prototype.skipToLevel = function (a) {
        return (
          a || (a = { id: 0, filename: "", required: 0 }),
          this.game.state.add("level", Level),
          this.game.state.fade("level", true, false, a)
        );
      };
      return Menu;
    });
  }.call(this),
  function () {
    define("States/Menu/SingleMenu", [
      "require",
      "Phaser",
      "States/Menu/TempleHall",
      "States/Menu/Menu",
    ], function (require) {
      require("Phaser");
      var TempleHall = require("States/Menu/TempleHall");
      var Menu = require("States/Menu/Menu");
      class SingleMenu extends Menu {
        constructor() {
          super(...arguments);
          this.layoutContent = this.layoutContent.bind(this);
          this.addContent = this.addContent.bind(this);
          this.preload = this.preload.bind(this);
        }
        layoutContent() {
          super.layoutContent.call(this);
          this.templeHall.layoutContent();
        }
      }
      SingleMenu.prototype.addContent = function () {
        var a;
        return (
          (this.templeHall = a = new TempleHall(this.game, 0, 0)),
          this.root.addChild(a),
          a.onStart.add(this.startTemple),
          this.onReady.dispatch(),
          this.afterAddContent()
        );
      };
      return SingleMenu;
    });
  }.call(this),
  function () {
    define("States/Menu/TempleSelector", [
      "../Common/StoneButton",
      "../Common/Button",
      "Phaser",
    ], function (StoneButton, Button) {
      "use strict";
      function TempleSelector(b, c, f) {
        ((this.destroy = this.destroy.bind(this)),
          (this.layoutContent = this.layoutContent.bind(this)),
          (this.getTarget = this.getTarget.bind(this)),
          (this.update = this.update.bind(this)),
          (this.showBuyTemple = this.showBuyTemple.bind(this)),
          (this.showSoftLockWarning = this.showSoftLockWarning.bind(this)),
          (this.templeClicked = this.templeClicked.bind(this)),
          (this.resize = this.resize.bind(this)),
          (this.preload = this.preload.bind(this)));
        var g,
          h,
          i,
          j,
          k,
          l,
          m,
          n,
          o,
          p,
          q,
          r,
          s,
          t,
          u,
          v,
          w,
          x,
          y,
          z,
          A,
          B,
          C,
          D;
        for (
          TempleSelector.__super__.constructor.call(
            this,
            b,
            c,
            f,
            "MenuBackgrounds",
            "_default0000",
          ),
            this.onSelected = new Phaser.Signal(),
            this.onMove = new Phaser.Signal(),
            this.onTarget = new Phaser.Signal(),
            this.onShowPopup = new Phaser.Signal(),
            this.icon_distance = 256,
            this.strip_height = A = 300,
            D = this.game.realWidth,
            this.strip = this.game.make.sprite(
              1 / 0,
              0,
              "MenuBackgrounds",
              "_default0000",
            ),
            this.addChild(this.strip),
            j = Math.ceil(this.game.realWidth / 256),
            this.bs = i = [],
            i[0] = this.game.make.group(),
            i[1] = this.game.make.group(),
            p = q = 0,
            u = i.length;
          q < u;
          p = ++q
        ) {
          for (
            g = i[p], m = r = 0, y = j;
            0 <= y ? r <= y : r >= y;
            m = 0 <= y ? ++r : --r
          )
            ((h = this.game.make.sprite(
              -D / 2 + 255 * m,
              -A,
              "MenuBackgrounds",
              "SimpleBackground0000",
            )),
              g.addChild(h));
          ((g.cacheAsBitmap = true),
            (g.x = -p * g.width),
            this.strip.addChild(g));
        }
        for (
          C = b.progress.get("temples"),
            this.icons = [],
            m = s = 0,
            v = C.length;
          s < v;
          m = ++s
        )
          ((B = C[m]),
            (o = B.icon || B.id),
            B.locked && !this.game.config.devUnlock
              ? ((n = new Button(
                  b,
                  B.index * this.icon_distance,
                  -A / 2,
                  "TempleIcons",
                  [o + "Icon0000", o + "Icon0000"],
                  (function (a) {
                    return function () {
                      return a.showBuyTemple(B);
                    };
                  })(this),
                )),
                (w = new Phaser.Sprite(
                  this.game,
                  0,
                  0,
                  "MenuAssets",
                  "GoldLock0000",
                )),
                w.scale.set(1),
                w.anchor.set(0.5),
                n.addChild(w))
              : B.softLocked && !this.game.config.devUnlock
                ? (n = new Button(
                    b,
                    B.index * this.icon_distance,
                    -A / 2,
                    "TempleIcons",
                    [o + "Icon0000", o + "Icon0000"],
                    this.showSoftLockWarning,
                  ))
                : ((n = new Button(
                    b,
                    B.index * this.icon_distance,
                    -A / 2,
                    "TempleIcons",
                    [o + "Icon0001", o + "Icon0002"],
                    this.templeClicked,
                    null,
                  )),
                  B.hasNew &&
                    ((x = new Phaser.Sprite(
                      this.game,
                      0,
                      0,
                      "MenuAssets",
                      "NewSign0000",
                    )),
                    x.scale.set(0.7),
                    (x.x += 60),
                    (x.y -= 60),
                    x.anchor.set(0.5),
                    n.addChild(x))),
            n.anchor.set(0.5),
            (n.data = B),
            this.icons.push(n),
            this.strip.addChild(n));
        ((this.currentX = this._x = 0),
          (this.v = 0),
          (this.a = 0),
          (this.anchor = 0),
          b.TouchManager.register(
            this.strip,
            "panstart",
            (function (a) {
              return function (b) {
                return (a.panning = true);
              };
            })(this),
          ),
          b.TouchManager.register(
            this.strip,
            "panmove",
            (function (a) {
              return function (c) {
                if (true === a.panning)
                  return (
                    (a._x = a.currentX + c.deltaX / b.camera.scale.x),
                    (a.v = 10 * c.overallVelocityX)
                  );
              };
            })(this),
          ),
          b.TouchManager.register(
            this.strip,
            "panend",
            (function (a) {
              return function (b) {
                return ((a.panning = false), (a.didpan = true));
              };
            })(this),
          ),
          (l = this.game.make.group(0, 0)),
          (this.cover = k =
            this.game.make.sprite(
              0,
              50,
              "MenuBackgrounds",
              "SliderHolder0000",
            )),
          k.anchor.set(0.5, 1),
          (this.leftSide = t =
            this.game.make.tileSprite(
              -k.width / 2,
              50,
              (this.game.realWidth - k.width) / 2,
              k.height,
              "MenuBackgrounds",
              "HolderTexture0000",
            )),
          (this.rigthSide = z =
            this.game.make.tileSprite(
              k.width / 2,
              50,
              (this.game.realWidth - k.width) / 2,
              k.height,
              "MenuBackgrounds",
              "HolderTexture0000",
            )),
          t.anchor.set(1, 1),
          z.anchor.set(0, 1),
          l.addChild(k),
          l.addChild(t),
          l.addChild(z),
          (k.cacheAsBitmap = true),
          (t.cacheAsBitmap = true),
          (z.cacheAsBitmap = true),
          this.addChild(l),
          b.TouchManager.register(
            t,
            "touchstart",
            (function (a) {
              return function (a) {
                return console.log("prevent event");
              };
            })(),
          ),
          b.TouchManager.register(
            t,
            "mousedown",
            (function (a) {
              return function (a) {
                return console.log("prevent event");
              };
            })(),
          ),
          b.TouchManager.register(
            t,
            "panstart",
            (function (a) {
              return function (a) {
                return console.log("prevent event");
              };
            })(),
          ),
          b.TouchManager.register(
            z,
            "touchstart",
            (function (a) {
              return function (a) {
                return console.log("prevent event");
              };
            })(),
          ),
          b.TouchManager.register(
            z,
            "mousedown",
            (function (a) {
              return function (a) {
                return console.log("prevent event");
              };
            })(),
          ),
          b.TouchManager.register(
            z,
            "panstart",
            (function (a) {
              return function (a) {
                return console.log("prevent event");
              };
            })(),
          ),
          (p =
            null != this.game.currentTemple
              ? this.game.currentTemple.index
              : 0),
          (this._x = this.anchor = -this.icon_distance * p));
      }
      extend(TempleSelector, Phaser.Sprite);
      TempleSelector.prototype.preload = function () {};
      TempleSelector.prototype.resize = function () {
        var a;
        return (
          (a = this.game.realWidth),
          (this.background.width = a),
          (this.background.x = -a / 2),
          (this.leftSide.width = (this.game.realWidth - this.cover.width) / 2),
          (this.rigthSide.width = (this.game.realWidth - this.cover.width) / 2),
          (this.leftSide.x = -this.cover.width / 2),
          (this.rigthSide.x = this.cover.width / 2)
        );
      };
      TempleSelector.prototype.templeClicked = function (a) {
        return (
          this.didpan ||
            (this.game.currentSounds.pusher.play(),
            console.log("clicked temple" + a.data.id),
            this.onSelected.dispatch(a.data)),
          (this.didpan = false)
        );
      };
      TempleSelector.prototype.showSoftLockWarning = function () {
        return (
          this.didpan ||
            (console.log("should trigger to show 'complete more levels'"),
            this.onShowPopup.dispatch({ type: "softLock" })),
          (this.didpan = false)
        );
      };
      TempleSelector.prototype.showBuyTemple = function (a) {
        return (
          this.didpan ||
            (console.log("should trigger to show 'buy this temple'"),
            this.onShowPopup.dispatch({ type: "buyTemple", value: a })),
          (this.didpan = false)
        );
      };
      TempleSelector.prototype.update = function () {
        var a, b, c, d, e, f, g, h, i, j, k;
        for (
          this.panning
            ? (this.a = 0)
            : ((b = Math.min(0.04, this.game.time.elapsed / 1e3)),
              (this.a = (this.anchor - this._x) * b * 0.25),
              (this.v += this.a),
              (this.v *= 0.9),
              (this._x += this.v),
              (this.currentX = this._x)),
            this.anchor =
              this.icon_distance * Math.round(this._x / this.icon_distance),
            i = this.icons,
            e = 0,
            g = i.length;
          e < g;
          e++
        )
          ((d = i[e]),
            d.x + this._x >=
            ((this.icons.length - 2) / 2 + 1) * this.icon_distance
              ? (d.x -= this.icons.length * this.icon_distance)
              : d.x + this._x <
                  -((this.icons.length - 2) / 2 + 1) * this.icon_distance &&
                (d.x += this.icons.length * this.icon_distance));
        for (j = this.bs, c = f = 0, h = j.length; f < h; c = ++f)
          ((a = j[c]),
            a.x + this._x > a.width && (a.x -= 2 * a.width),
            a.x + this._x < -a.width && (a.x += 2 * a.width));
        if (
          (this.lastAnchor !== this.anchor &&
            ((this.lastAnchor = this.anchor),
            (k = this.getTarget()),
            this.onTarget.dispatch(k)),
          this.strip.x !== Math.round(this._x))
        )
          return ((this.strip.x = Math.round(this._x)), this.onMove.dispatch());
      };
      TempleSelector.prototype.getTarget = function () {
        return this.icons.sort(
          (function (a) {
            return function (b, c) {
              return Math.abs(a._x + b.x) - Math.abs(a._x + c.x);
            };
          })(this),
        )[0];
      };
      TempleSelector.prototype.layoutContent = function () {
        return (
          (this.leftSide.width = (this.game.realWidth - this.cover.width) / 2),
          (this.rigthSide.width = (this.game.realWidth - this.cover.width) / 2)
        );
      };
      TempleSelector.prototype.destroy = function () {
        return (
          this.game.TouchManager.unregister(this.leftSide, "touchstart"),
          this.game.TouchManager.unregister(this.leftSide, "mousedown"),
          this.game.TouchManager.unregister(this.leftSide, "panstart"),
          this.game.TouchManager.unregister(this.rigthSide, "touchstart"),
          this.game.TouchManager.unregister(this.rigthSide, "mousedown"),
          this.game.TouchManager.unregister(this.rigthSide, "panstart"),
          this.game.TouchManager.unregister(this.strip, "panstart"),
          this.game.TouchManager.unregister(this.strip, "panmove"),
          this.game.TouchManager.unregister(this.strip, "panend"),
          TempleSelector.__super__.destroy.apply(this, arguments)
        );
      };
      return TempleSelector;
    });
  }.call(this),
  function () {
    define("States/Menu/MultiHall", [
      "require",
      "Phaser",
      "../Common/GoldButton",
      "../Common/Navies",
      "States/Menu/TempleSelector",
      "States/Buy/BuyMenu",
      "States/Common/SoftLockMenu",
    ], function (require) {
      var Phaser = require("Phaser");
      require("../Common/GoldButton");
      var Navies = require("../Common/Navies");
      var TempleSelector = require("States/Menu/TempleSelector");
      var BuyMenu = require("States/Buy/BuyMenu");
      var SoftLockMenu = require("States/Common/SoftLockMenu");
      function MultiHall(b, c, d) {
        ((this.destroy = this.destroy.bind(this)),
          (this.showPopup = this.showPopup.bind(this)),
          (this.layoutContent = this.layoutContent.bind(this)),
          (this.update = this.update.bind(this)),
          (this.drawBackgrounds = this.drawBackgrounds.bind(this)),
          (this.setBackground = this.setBackground.bind(this)));
        var g, j;
        (MultiHall.__super__.constructor.call(this, b, c, d),
          (this.templeSelector = g =
            new TempleSelector(this.game, 0, this.game.realHeight / 2)),
          (this.w = this.game.realWidth),
          (this.h = this.game.realHeight),
          (this.paralaxFactor = 3),
          (this.bkg = this.drawBackgrounds()),
          this.addChild(this.bkg),
          (this.title = j = this.game.make.sprite(0, 0, "GameName")),
          j.anchor.set(0.5, 0.5),
          (j.cacheAsBitmap = true),
          this.addChild(j),
          (this.onStart = new Phaser.Signal()),
          g.onTarget.add(_.debounce(this.setBackground, 800)),
          g.onSelected.add(
            (function (a) {
              return function (b) {
                return a.onStart.dispatch(b);
              };
            })(this),
          ),
          g.onShowPopup.add(this.showPopup),
          this.addChild(g),
          (this.navies = new Navies(this.game, 0, 0)),
          this.addChild(this.navies),
          (this.game.time.advancedTiming = true),
          this.setBackground(g.getTarget(), false));
      }
      extend(MultiHall, Phaser.Sprite);
      MultiHall.prototype.setBackground = function (a, b) {
        var c, d;
        if (
          (null == b && (b = true),
          (c = this.backgroundImages[a.data.id]),
          this.currentBkg !== c)
        )
          return (
            b &&
              ((c.alpha = 0),
              (d = this.game.add
                .tween(c)
                .to({ alpha: 1 }, 800, Phaser.Easing.Quadratic.InOut, true)),
              d.onComplete.add(
                (function (a) {
                  return function () {
                    return (c.alpha = 1);
                  };
                })(),
              )),
            (this.currentBkg = c),
            this.bkg.addChild(c),
            this.bkg.bringToTop(c)
          );
      };
      MultiHall.prototype.drawBackgrounds = function () {
        var a, b, c, d, e, f, g, h, i, j, k;
        for (
          k = this.game.progress.get("temples"),
            this.backgroundImages = {},
            this.bkgBmd = a = this.game.make.bitmapData(1366, 768),
            a.fill(0, 0, 0, 1),
            c = this.game.make.sprite(0, 0, a),
            c.anchor.set(0.5),
            d = f = 0,
            g = k.length;
          f < g;
          d = ++f
        )
          ((j = k[d]),
            (i = j.id),
            (e = "TempleHall" + i.charAt(0).toUpperCase() + i.slice(1)),
            j.locked || j.softLocked
              ? (b = c)
              : ((b = this.game.make.sprite(0, 0, e)),
                b.anchor.set(0.5),
                (h = Math.max(this.w / 1366, this.h / 768)),
                b.scale.set(h),
                (b.cacheAsBitmap = true)),
            (this.backgroundImages[j.id] = b));
        return this.game.make.group(0, 0);
      };
      MultiHall.prototype.update = function () {
        return (
          this.game.config.showFps && $("#debug-fps").html(this.game.time.fps),
          this.templeSelector.update(),
          this.navies.update()
        );
      };
      MultiHall.prototype.layoutContent = function () {
        var a, b, c, d;
        ((this.w = this.game.realWidth),
          (this.h = this.game.realHeight),
          (d = Math.max(this.w / 1366, this.h / 768)),
          (c = this.backgroundImages));
        for (b in c) ((a = c[b]), a.scale.set(d), (a.x = 0));
        return (
          (this.templeSelector.y = this.game.realHeight / 2),
          this.templeSelector.layoutContent(),
          (this.title.y =
            -this.game.realHeight / 2 +
            (this.game.realHeight - this.templeSelector.height) / 2 -
            this.title.height / 2),
          (this.navies.y =
            this.game.realHeight / 2 - this.templeSelector.strip_height / 2)
        );
      };
      MultiHall.prototype.showPopup = function (a) {
        var b;
        return (
          console.log("show popup for", a.type),
          "softLock" === a.type
            ? (b = new SoftLockMenu(this.game, { label: "temple" }))
            : "buyTemple" === a.type && (b = new BuyMenu(this.game)),
          b.show(),
          b.onClose.add(b.destroy)
        );
      };
      MultiHall.prototype.destroy = function () {
        return (
          this.bkgBmd.destroy(),
          MultiHall.__super__.destroy.apply(this, arguments)
        );
      };
      return MultiHall;
    });
  }.call(this),
  function () {
    define("States/Menu/MultiMenu", [
      "require",
      "Phaser",
      "States/Menu/Menu",
      "States/Menu/MultiHall",
      "States/Menu/TempleSelector",
    ], function (require) {
      require("Phaser");
      var Menu = require("States/Menu/Menu");
      var MultiHall = require("States/Menu/MultiHall");
      require("States/Menu/TempleSelector");
      function MultiMenu() {
        return (
          (this.shutdown = this.shutdown.bind(this)),
          (this.layoutContent = this.layoutContent.bind(this)),
          (this.update = this.update.bind(this)),
          (this.addContent = this.addContent.bind(this)),
          (this.preload = this.preload.bind(this)),
          MultiMenu.__super__.constructor.apply(this, arguments)
        );
      }
      extend(MultiMenu, Menu);
      MultiMenu.prototype.preload = function () {
        return MultiMenu.__super__.preload.apply(this, arguments);
      };
      MultiMenu.prototype.addContent = function () {
        var a;
        return (
          (this.inputEnableChildren = true),
          (this.templeHall = a = new MultiHall(this.game, 0, 0)),
          this.root.addChild(a),
          a.onStart.add(this.startTemple),
          this.afterAddContent(),
          this.onReady.dispatch()
        );
      };
      MultiMenu.prototype.update = function () {
        if (null != this.templeHall) return this.templeHall.update();
      };
      MultiMenu.prototype.layoutContent = function () {
        return (
          MultiMenu.__super__.layoutContent.call(this),
          this.templeHall.layoutContent()
        );
      };
      MultiMenu.prototype.shutdown = function () {
        return this.templeHall.destroy();
      };
      return MultiMenu;
    });
  }.call(this),
  function () {
    define("States/Boot", [
      "require",
      "Phaser",
      "States/Menu/SingleMenu",
      "States/Menu/MultiMenu",
      "ProgressModel",
      "States/Complete/Complete",
      "States/LevelMenu/LevelMenu",
      "cacheBuster",
    ], function (require) {
      var Phaser = require("Phaser");
      var SingleMenu = require("States/Menu/SingleMenu");
      var MultiMenu = require("States/Menu/MultiMenu");
      var ProgressModel = require("ProgressModel");
      var CacheBuster = require("cacheBuster");
      require("States/Complete/Complete");
      require("States/LevelMenu/LevelMenu");
      function Boot() {
        ((this.initialize = this.initialize.bind(this)),
          (this.loadSettings = this.loadSettings.bind(this)),
          (this.setStorageAdapter = this.setStorageAdapter.bind(this)),
          (this.gameName = gameConfig.title));
      }
      extend(Boot, Phaser.State);
      Boot.prototype.preload = function () {
        return (
          console.log("Preloading Boot State"),
          this.game.load.atlasJSONArray(
            "PreloaderAssets",
            "./assets/atlasses/PreloaderAssets.png",
            "./assets/atlasses/PreloaderAssets.json",
          )
        );
      };
      Boot.prototype.create = function () {
        return (
          this.game.add.plugin(PhaserSuperStorage.StoragePlugin),
          this.game.add.plugin(CacheBuster),
          (this.game.load.cacheBuster = version),
          (this.game.gameConfig = gameConfig),
          this.setStorageAdapter().then(
            (function (a) {
              return function () {
                return a.loadSettings().then(function () {
                  return a.initialize().then(function () {
                    return a.game.state.start("load");
                  });
                });
              };
            })(this),
          )
        );
      };
      Boot.prototype.setStorageAdapter = function () {
        var a;
        return (
          (a = function () {
            try {
              return window.self !== window.top;
            } catch (a) {
              return (a, true);
            }
          }),
          new Promise(
            (function (b) {
              return function (c) {
                var d;
                return a()
                  ? ((d = new PhaserSuperStorage.StorageAdapters.IframeStorage(
                      "",
                      document.referrer,
                    )),
                    d
                      .init()
                      .then(function () {
                        return (b.game.storage.setAdapter(d), c());
                      })
                      .catch(function (a) {
                        return ((b.game.storage.forcePromises = true), c());
                      }))
                  : ((b.game.storage.forcePromises = true), c());
              };
            })(this),
          )
        );
      };
      Boot.prototype.loadSettings = function () {
        return this.game.loadSettings();
      };
      Boot.prototype.initialize = function () {
        var a, b;
        return (
          (this.game.camera.reset = function () {
            return (
              (this.target = null),
              (this._shake.duration = 0),
              this.resetFX()
            );
          }),
          "multi" === this.game.gameConfig.type
            ? this.game.state.add("menu", MultiMenu)
            : this.game.state.add("menu", SingleMenu),
          (this.game.sound.volume = 0.1),
          (this.game.sound.mute = !this.game.settings.fx),
          (this.game.stage.disableVisibilityChange = true),
          this.game.onBlur.add(
            (function (a) {
              return function () {
                return (a.game.sound.mute = true);
              };
            })(this),
          ),
          this.game.onPause.add(
            (function (a) {
              return function () {
                return (a.game.sound.mute = true);
              };
            })(this),
          ),
          this.game.onFocus.add(
            (function (a) {
              return function () {
                return (a.game.sound.mute = !a.game.settings.fx);
              };
            })(this),
          ),
          this.game.onResume.add(
            (function (a) {
              return function () {
                return (a.game.sound.mute = !a.game.settings.fx);
              };
            })(this),
          ),
          (this.game.camera.bounds = null),
          (b = 800),
          (a = 600),
          (this.game.width < b || this.game.height < a) &&
            this.game.camera.scale.set(
              Math.min(this.game.width / b, this.game.height / a),
            ),
          (this.game.camera.x = -this.game.width / 2),
          (this.game.camera.y = -this.game.height / 2),
          (this.game.realWidth = this.game.width / this.game.camera.scale.x),
          (this.game.realHeight = this.game.height / this.game.camera.scale.y),
          (this.game.make.resSprite = function (a, b, c, d) {
            return this.game.make.sprite(a, b, c, d);
          }),
          (this.game.gameConfig.temples = this.game.gameConfig.temples),
          $(window).on(
            "keydown",
            (function (a) {
              return function (a) {
                if (40 === a.keyCode || 38 === a.keyCode)
                  return a.preventDefault();
              };
            })(),
          ),
          "cordova" === this.game.gameConfig.target
            ? reutnr(
                new Promise(
                  (function (a) {
                    return function (b) {
                      return document.addEventListener(
                        "deviceready",
                        function () {
                          return a.doStart().then(function () {
                            return b();
                          });
                        },
                        false,
                      );
                    };
                  })(this),
                ),
              )
            : this.doStart()
        );
      };
      Boot.prototype.doStart = function () {
        return (
          (this.game.progress = new ProgressModel(this.game)),
          new Promise(
            (function (a) {
              return function (b) {
                return (a.game.progress.on("sync", b), a.game.progress.fetch());
              };
            })(this),
          )
        );
      };
      return Boot;
    });
  }.call(this),
  function () {
    define("States/Common/LoaderBar", ["./Button", "Phaser"], function (
      Button,
    ) {
      "use strict";
      function LoaderBar(a, b, d) {
        var e, f, g, h, i, j, k, l;
        (LoaderBar.__super__.constructor.call(this, a, b, d),
          (i = 200),
          (g = 20),
          (f = this.game.make.sprite(0, 0, "PreloaderAssets", "LoaderBar0000")),
          (f.x = -i / 2),
          (f.y = -g / 2),
          this.addChild(f),
          (j = new Phaser.Rectangle(0, 0, 0, g)),
          f.crop(j),
          (h = new Phaser.Sprite(
            this.game,
            0,
            0,
            "PreloaderAssets",
            "LoaderHolder0000",
          )),
          h.anchor.set(0.5),
          this.addChild(h),
          (k = new Phaser.Sprite(
            this.game,
            0,
            -80,
            "PreloaderAssets",
            "LoaderTitle0000",
          )),
          k.anchor.set(0.47),
          this.addChild(k),
          (l = (function (a) {
            return function (a) {
              var b;
              return (
                null != window.parent &&
                  ((b = { bytesLoaded: a, bytesTotal: 100 }),
                  window.parent.postMessage(b, "*")),
                (j.width = (a / 100) * i),
                f.crop(j)
              );
            };
          })()),
          (e = (function (a) {
            return function () {
              return (
                a.game.load.onFileComplete.remove(l),
                a.game.load.onLoadComplete.remove(e),
                a.destroy()
              );
            };
          })(this)),
          this.game.load.onFileComplete.add(l),
          this.game.load.onLoadComplete.add(e));
      }
      extend(LoaderBar, Phaser.Group);
      return LoaderBar;
    });
  }.call(this),
  function () {
    define("States/Load", [
      "require",
      "Phaser",
      "States/Common/LoaderBar",
      "States/LevelMenu/LevelMenu",
      "States/Menu/SingleMenu",
    ], function (require) {
      var Phaser = require("Phaser");
      require("States/Common/LoaderBar");
      var LevelMenu = require("States/LevelMenu/LevelMenu");
      var SingleMenu = require("States/Menu/SingleMenu");
      function Load() {
        this.gameName = "Fireboy Watergirl Forest Temple";
      }
      extend(Load, Phaser.State);
      Load.prototype.preload = function () {
        return (
          console.log("Loading"),
          (this.onFileComplete = this.onFileComplete.bind(this)),
          this.game.load.onFileComplete.add(this.onFileComplete),
          (this.onLoadComplete = this.onLoadComplete.bind(this)),
          this.game.load.onLoadComplete.add(this.onLoadComplete),
          this.loadAssets()
        );
      };
      Load.prototype.startGame = function () {
        return (
          this.game.state.add("menu", SingleMenu),
          this.game.state.start("menu"),
          this.game.load.onFileComplete.remove(this.onFileComplete),
          this.game.load.onLoadComplete.remove(this.onLoadComplete)
        );
      };
      Load.prototype.onFileComplete = function (a) {};
      Load.prototype.onLoadComplete = function () {
        this.startGame();
      };
      Load.prototype.loadAssets = function () {
        var a, b, c, e, f, g, h, i, j, k, l, m, n, o, p;
        if (
          ((this.game.load.crossOrigin = "anonymous"),
          this.game.load.atlasJSONArray(
            "MenuAssets",
            "./assets/atlasses/MenuAssets.png",
            "./assets/atlasses/MenuAssets.json",
          ),
          this.game.load.atlasJSONArray(
            "PopupAssets",
            "./assets/atlasses/PopupAssets.png",
            "./assets/atlasses/PopupAssets.json",
          ),
          this.game.load.bitmapFont(
            "font_en",
            "./assets/fonts/font.png",
            "./assets/fonts/font.fnt",
          ),
          this.game.load.bitmapFont(
            "font_ru",
            "./assets/fonts/fbwg_font_cyrillic.png",
            "./assets/fonts/fbwg_font_cyrillic.fnt",
          ),
          this.game.load.atlasJSONArray(
            "MenuBackgrounds",
            "./assets/atlasses/MenuBackgrounds.png",
            "./assets/atlasses/MenuBackgrounds.json",
          ),
          (o = _.isArray(this.game.gameConfig.assets)
            ? this.game.gameConfig.assets
            : [this.game.gameConfig.assets]),
          "multi" === this.game.gameConfig.type)
        ) {
          for (
            this.game.load.atlasJSONArray(
              "TempleIcons",
              "./assets/atlasses/TempleIcons.png",
              "./assets/atlasses/TempleIcons.json",
            ),
              e = 0,
              h = o.length;
            e < h;
            e++
          )
            ((a = o[e]),
              (k = a.charAt(0).toUpperCase() + a.slice(1)),
              this.game.load.image(
                "TempleHall" + k,
                "./assets/images/TempleHall" + k + ".jpg",
              ));
          this.game.load.image(
            "GameName",
            "./assets/images/GameNameElements.png",
          );
        } else
          ((a = o[0]),
            (k = a.charAt(0).toUpperCase() + a.slice(1)),
            this.game.load.image(
              "TempleHall",
              "./assets/images/TempleHall" + k + ".jpg",
            ),
            this.game.load.image(
              "GameName",
              "./assets/images/GameName" + k + ".png",
            ));
        for (
          this.game.load.atlasJSONArray(
            "CharAssets",
            "./assets/atlasses/CharAssets.png",
            "./assets/atlasses/CharAssets.json",
          ),
            this.game.load.image("HallBeam", "./assets/images/Beam.png"),
            this.game.load.atlasJSONArray(
              "PopupAssets",
              "./assets/atlasses/PopupAssets.png",
              "./assets/atlasses/PopupAssets.json",
            ),
            this.game.load.json(
              "Ground",
              "./assets/tilemaps/tilesets/Ground.json",
              null,
              Phaser.Tilemap.TILED_JSON,
            ),
            this.game.load.json(
              "Objects",
              "./assets/tilemaps/tilesets/Objects.json",
              null,
              Phaser.Tilemap.TILED_JSON,
            ),
            this.game.load.json(
              "LargeObjects",
              "./assets/tilemaps/tilesets/LargeObjects.json",
              null,
              Phaser.Tilemap.TILED_JSON,
            ),
            this.game.load.json(
              "Chars",
              "./assets/tilemaps/tilesets/Chars.json",
              null,
              Phaser.Tilemap.TILED_JSON,
            ),
            f = 0,
            i = o.length;
          f < i;
          f++
        )
          ((c = o[f]),
            (p = "./assets/atlasses/Temples/" + c),
            this.game.load.atlasJSONArray(
              "TempleAssets",
              p + "/TempleAssets.png",
              p + "/TempleAssets.json",
            ));
        for (
          this.game.load.atlasJSONArray(
            "GroundAssets",
            "./assets/atlasses/GroundAssets.png",
            "./assets/atlasses/GroundAssets.json",
          ),
            this.game.load.atlasJSONArray(
              "CharAssets",
              "./assets/atlasses/CharAssets.png",
              "./assets/atlasses/CharAssets.json",
            ),
            this.game.load.atlasJSONArray(
              "MechAssets",
              "./assets/atlasses/MechAssets.png",
              "./assets/atlasses/MechAssets.json",
            ),
            n = [
              "menuMusic",
              "levelMusic_speed",
              "levelMusic_dark",
              "levelMusicFinish_speed",
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
              "lever",
              "pusher",
              "platform",
              "wind",
              "portalOpen",
              "portalLoop",
              "portalClose",
              "portalTransport",
              "clock",
              "slider",
              "lightPusher",
            ],
            l = [],
            g = 0,
            j = n.length;
          g < j;
          g++
        )
          ((m = n[g]),
            (b = m.charAt(0).toUpperCase() + m.slice(1)),
            l.push(this.game.load.audio(m, "./assets/audio/" + b + ".mp3")));
        return l;
      };
      return Load;
    });
  }.call(this));

(!function () {
  define("main", [
    "require",
    "Phaser",
    "States/Boot",
    "States/Load",
    "States/Level/Level",
    "utils/lang/Lang",
    "TouchManager",
    "bowser",
    "underscore",
    "superStorage",
    "cacheBuster",
  ], function (require) {
    var b, c, Boot, bowser, Lang, Load, Phaser, TouchManager, j, k, game;
    return (
      (Phaser = require("Phaser")),
      (Boot = require("States/Boot")),
      (Load = require("States/Load")),
      require("States/Level/Level"),
      (Lang = require("utils/lang/Lang")),
      (TouchManager = require("TouchManager")),
      (bowser = require("bowser")),
      require("underscore"),
      require("superStorage"),
      require("cacheBuster"),
      (k = { vibrate: false, music: true, fx: true, controls: null }),
      (j = {
        width: window.innerWidth || $(window).width(),
        height: window.innerHeight || $(window).height(),
        renderer: Phaser.AUTO,
        parent: "container",
        transparent: false,
        multiTexture: false,
        antialias: true,
        resolution: window.devicePixelRatio,
        enableDebug: false,
        showFps: false,
        devUnlock: false,
        devSkipAds: false,
        simulateCordova: false,
        log: false,
      }),
      j.log ||
        (console.log = (function (a) {
          return function () {};
        })()),
      (game = new Phaser.Game(j)),
      Phaser.Device.whenReady(
        (function (a) {
          return function () {
            var j, m, n, o, p, q, r;
            return (
              (game.stage.disableVisibilityChange = true),
              (n =
                null != (p = game.device.desktop || !game.device.iPad)
                  ? p
                  : { click: "touchstart" }),
              document
                .getElementById("container")
                .addEventListener(n, function (a) {
                  return game.gameResumed(a);
                }),
              (game.bowser = bowser),
              (game.settingsSignal = new Phaser.Signal()),
              game.settingsSignal.add(function (a) {
                var b;
                if (
                  ("fx" === a &&
                    (game.paused || (game.sound.mute = !game.settings.fx)),
                  "music" === a &&
                    ((b = game.state.states[game.state.current]),
                    null != b.updateMusic))
                )
                  return b.updateMusic();
              }),
              (game.lang = new Lang()),
              (game.saveSettings = function () {
                return (
                  this.storage.setNamespace("fb-" + this.gameConfig.id),
                  this.storage.setItem(
                    "settings",
                    JSON.stringify(this.settings),
                  )
                );
              }),
              (game.loadSettings = function () {
                return (
                  this.storage.setNamespace("fb-" + this.gameConfig.id),
                  this.storage.getItem("settings").then(
                    (function (a) {
                      return function (b) {
                        return (
                          b
                            ? (a.settings = JSON.parse(b))
                            : ((a.settings = k),
                              a.bowser.tablet ||
                              a.bowser.mobile ||
                              a.device.iPad
                                ? (a.settings.controls = "single")
                                : (a.settings.controls = "keyboard")),
                          new Promise(function (a) {
                            return a();
                          })
                        );
                      };
                    })(this),
                  )
                );
              }),
              game.state.add("load", Load),
              game.state.add("boot", Boot),
              (game.TouchManager = new TouchManager()),
              game.TouchManager.start(game),
              game.state.start("boot"),
              (m = function (b) {
                var c, d, e, f, g;
                return (
                  (f = game.make.sprite()),
                  (d = game.make.graphics(0, 0)),
                  d.beginFill(0, 1),
                  d.drawRect(0, 0, game.realWidth, game.realHeight),
                  d.endFill(),
                  f.addChild(d),
                  b.showText &&
                    ((g = game.make.bitmapText(
                      0,
                      0,
                      game.lang.font,
                      game.lang.locale("loading"),
                      Math.min(30, 36 / Math.max(1, game.resolution)),
                    )),
                    g.anchor.set(0),
                    (g.alpha = 0),
                    (g.x = window.innerWidth / 2 - g.textWidth / 2),
                    (g.y = window.innerHeight / 2 - g.textHeight / 2),
                    f.addChild(g),
                    (d.text = g),
                    (e = game.time.time),
                    (c = function () {
                      var b, d, f;
                      if (
                        ((d = game.time.elapsedSince(e)),
                        (f = 800),
                        d > f && (g.alpha = 1),
                        (b = Math.floor((d - f) / 300) % 4),
                        0 === b &&
                          (g.text = game.lang.locale("loading") + "..."),
                        1 === b && (g.text = game.lang.locale("loading")),
                        2 === b && (g.text = game.lang.locale("loading") + "."),
                        3 === b &&
                          (g.text = game.lang.locale("loading") + ".."),
                        a.fading)
                      )
                        return requestAnimationFrame(c);
                    }),
                    requestAnimationFrame(c)),
                  game.stage.addChild(f),
                  f
                );
              }),
              (r = function (a, b) {
                var c;
                return (
                  (game.paused = false),
                  (a.alpha = 0),
                  (c = game.add.tween(a)),
                  c.to({ alpha: 1 }, 500, null),
                  c.onComplete.add(function () {
                    return (
                      (game.stage.backgroundColor = "#000000"),
                      game.tweens.remove(c),
                      b()
                    );
                  }),
                  c.start()
                );
              }),
              (o = function (a, b) {
                var c;
                return (
                  (game.stage.backgroundColor = "#000000"),
                  (game.paused = false),
                  (c = game.add.tween(a)),
                  c.to({ alpha: 0 }, 500, null),
                  c.onComplete.add(function () {
                    return (game.tweens.remove(c), b(), a.kill());
                  }),
                  c.start()
                );
              }),
              function () {
                var a;
                if (
                  game.bowser.tablet ||
                  game.bowser.mobile ||
                  game.device.iPad
                ) {
                  if (
                    ((a = document.getElementById("root")), a.requestFullscreen)
                  )
                    return a.requestFullscreen();
                  if (a.webkitRequestFullscreen)
                    return a.webkitRequestFullscreen();
                  if (a.mozRequestFullScreen) return a.mozRequestFullScreen();
                  if (a.msRequestFullscreen) return a.msRequestFullscreen();
                }
              },
              (game.state.actualFadeToState = function (a, b, c, d) {
                var e;
                return (
                  this.game.state.start(a, b, c, d),
                  (this.game.paused = false),
                  (e = (function (b) {
                    return function () {
                      var c;
                      return (
                        (b.fading = false),
                        null != b.overlay && b.overlay.kill(),
                        (b.overlay = c = m({ showText: false })),
                        (c.alpha = 1),
                        requestAnimationFrame(function () {
                          return o(c, function () {
                            if (
                              ((b.fading = false),
                              null != b.game.state.states[a].start)
                            )
                              return b.game.state.states[a].start();
                          });
                        })
                      );
                    };
                  })(this)),
                  null != this.game.state.states[a].onReady
                    ? this.game.state.states[a].onReady.addOnce(e)
                    : requestAnimationFrame(
                        (function (a) {
                          return function () {
                            return e();
                          };
                        })(),
                      )
                );
              }),
              (game.state.actualFadeToState = function (a, b, c, d) {
                var e;
                return (
                  this.game.state.start(a, b, c, d),
                  (this.game.paused = false),
                  (e = (function (b) {
                    return function () {
                      var c;
                      return (
                        (b.fading = false),
                        null != b.overlay && b.overlay.kill(),
                        (b.overlay = c = m({ showText: false })),
                        (c.alpha = 1),
                        requestAnimationFrame(function () {
                          return o(c, function () {
                            if (
                              ((b.fading = false),
                              null != b.game.state.states[a].start)
                            )
                              return b.game.state.states[a].start();
                          });
                        })
                      );
                    };
                  })(this)),
                  null != this.game.state.states[a].onReady
                    ? this.game.state.states[a].onReady.addOnce(e)
                    : requestAnimationFrame(
                        (function (a) {
                          return function () {
                            return e();
                          };
                        })(),
                      )
                );
              }),
              (game.state.fade = function (a, b, c, d, e) {
                var f;
                if ((null == e && (e = true), !this.fading))
                  return (
                    (this.fading = true),
                    (this.overlay = f = m({ showText: true })),
                    r(f, function () {
                      game.state.actualFadeToState(a, b, c, d);
                    })
                  );
              }),
              (_.deepObjectExtend = function (a, b) {
                var c;
                for (c in b)
                  null != a[c] &&
                  "object" == typeof a[c] &&
                  "object" == typeof b[c]
                    ? _.deepObjectExtend(a[c], b[c])
                    : null == a[c] && (a[c] = _.clone(b[c]));
                return a;
              }),
              (game.secondsToString = function (a) {
                var b, c, d;
                return (
                  (c = function (a) {
                    return (a < 10 ? "0" : "") + a;
                  }),
                  (d = a % 60),
                  (b = (a - d) / 60),
                  c(b) + ":" + c(d)
                );
              }),
              (j = function () {
                var a, b, c, d, e;
                return (
                  console.log(
                    "_resize to height: ",
                    window.innerWidth,
                    "or",
                    $(window).width(),
                  ),
                  game.TouchManager.resize(),
                  (e = window.innerWidth || $(window).width()),
                  (b = window.innerHeight || $(window).height()),
                  game.scale.setGameSize(e, b),
                  (d = 800),
                  (c = 600),
                  game.width < d || game.height < c
                    ? game.camera.scale.set(
                        Math.min(game.width / d, game.height / c),
                      )
                    : game.camera.scale.set(1, 1),
                  (game.camera.x = -game.width / 2),
                  (game.camera.y = -game.height / 2),
                  (game.realWidth = game.width / game.camera.scale.x),
                  (game.realHeight = game.height / game.camera.scale.y),
                  (game.bounds = new Phaser.Rectangle(
                    0,
                    0,
                    game.width,
                    game.height,
                  )),
                  (a = game.state.states[game.state.current]),
                  null != a && null != a.layoutContent && a.layoutContent(),
                  game.camera.update()
                );
              }),
              (Phaser.Sound.prototype.playInstance = function () {
                return (
                  this.instances || (this.instances = 0),
                  0 === this.instances || this.loop
                    ? this.play()
                    : this.restart(),
                  this.instances++,
                  this
                );
              }),
              (Phaser.Sound.prototype.stopInstance = function () {
                if (0 === --this.instances) return this.stop();
              }),
              (q = _.debounce(j, 200)),
              $(window).on("resize", q),
              q()
            );
          };
        })(this),
      )
    );
  });
}.call(this),
  function () {
    require.config({
      map: {
        "*": {
          "@azerion/phaser": "Phaser",
        },
      },
      baseUrl: "js",
      deps: ["main"],
      findNestedDependencies: false,
    });
  }.call(this),
  define("init", function () {}));
