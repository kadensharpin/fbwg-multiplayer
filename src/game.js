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
                ? (0 === A && ((v = B * x.width), (w = C * x.height), (A = 1)),
                  (r = this.getTileRight(a.layers[m], B, C)),
                  r && 0 === r.properties.type
                    ? ((A += 1), this.drawTile(n.ctx, d, e, x.properties.type))
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
                      ? (A > 1 && this.drawTile(n.ctx, d, e, x.properties.type),
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
          g = this.game.cache.getFrameByName("TempleAssets", "ForeGround0000"),
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
            return null != s.layers[o].data[a] && null != s.layers[o].data[a][b]
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
                  !t(i, h).occupied &&
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
                "1" === w ? (Math.floor(3 * Math.random()) * Math.PI) / 2 : 0))
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
}).call(this),
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
