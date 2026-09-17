import { Game, Graphics, Rectangle } from "phaser";
import * as box2d from "phaser-box2d";
import _ from "underscore";
import Level from "./Level";

type Insets = { top: number; left: number; bottom: number; right: number };

class CameraManager {
  private game: Game;
  private level: Level;
  private camGraphics: Graphics;
  private viewportPadding: Insets;
  private worldPadding: Insets;
  private target: {
    x: number;
    y: number;
    scale: number;
    vx: number;
    vy: number;
    vscale: number;
    ax: number;
    ay: number;
    ascale: number;
  };
  private readonly minScale: number;
  private readonly maxScale: number;
  private wheelScale?: number | null;
  private pinchScale?: number;
  private pinchOrigin?: { x: number; y: number };
  private pinchCenter?: { x: number; y: number };
  private userScale?: number | null;
  private userCenter?: box2d.b2Vec2 | null;
  private panOrigin?: { x: number; y: number };
  private readonly resetWheelZoom: () => void;
  camFreeze: boolean;

  constructor(level: Level) {
    this.onWheelEvent = this.onWheelEvent.bind(this);
    this.destroy = this.destroy.bind(this);
    this.checkBounds = this.checkBounds.bind(this);
    this.animate = this.animate.bind(this);
    this.focusOn = this.focusOn.bind(this);
    this.updateCamera = this.updateCamera.bind(this);
    this.update = this.update.bind(this);

    this.game = level.game;
    this.level = level;
    this.camGraphics = this.game.add.graphics(0, 0);
    this.camGraphics.fixedToCamera = true;
    this.viewportPadding = {
      top: 64,
      left: 0,
      bottom: 0,
      right: 0,
    };
    this.worldPadding = {
      top: 100,
      left: 200,
      bottom: 100,
      right: 200,
    };
    this.target = {
      x: 0,
      y: 0,
      scale: 1,
      vx: 0,
      vy: 0,
      vscale: 0,
      ax: 0,
      ay: 0,
      ascale: 0,
    };
    this.updateCamera();
    const size = this.game.level.size ?? { width: 0, height: 0 };
    this.minScale = Math.min(
      (this.game.realWidth * 0.9) / size.width,
      (this.game.realHeight * 0.9) / size.height,
    );
    this.maxScale = 1.5;
    if (this.level.root) {
      this.level.root.x = (-size.width / 2) * this.minScale;
      this.level.root.y = (-size.height / 2) * this.minScale;
      this.level.root.scale.set(this.minScale);
    }
    this.camFreeze = true;
    this.resetWheelZoom = _.debounce(() => {
      this.wheelScale = null;
    }, 1000);
    window.addEventListener("wheel", this.onWheelEvent);

    this.game.TouchManager.register(null, "pinch", (input) => {
      if (
        this.game.level.pers1?.cursors.active ||
        this.game.level.pers2?.cursors.active ||
        !this.level.root
      )
        return;
      if (
        this.userScale == null ||
        this.pinchScale == null ||
        this.pinchOrigin == null ||
        this.pinchCenter == null
      ) {
        this.pinchScale = this.level.root.scale.x;
        this.pinchOrigin = {
          x: -this.level.root.x,
          y: -this.level.root.y,
        };
        this.pinchCenter = {
          x:
            -this.level.root.x -
            this.game.realWidth / 2 +
            input.center.x / this.pinchScale!,
          y:
            -this.level.root.y -
            this.game.realHeight / 2 +
            input.center.y / this.pinchScale!,
        };
      }
      this.userScale = Math.min(
        this.maxScale,
        Math.max(this.minScale, input.scale * this.pinchScale!),
      );
      this.userCenter = new box2d.b2Vec2(
        this.pinchOrigin.x +
          this.pinchCenter.x * this.userScale -
          this.pinchCenter.x * this.pinchScale! -
          input.deltaX / this.game.camera.scale.x,
        this.pinchOrigin.y +
          this.pinchCenter.y * this.userScale -
          this.pinchCenter.y * this.pinchScale! -
          input.deltaY / this.game.camera.scale.y,
      );
    });
    this.game.TouchManager.register(null, "pinchend", (_input) => {
      this.userScale = null;
      this.userCenter = null;
    });
    this.game.TouchManager.register(null, "pan", (input) => {
      if (
        this.game.level.pers1?.cursors.active ||
        this.game.level.pers2?.cursors.active ||
        !this.level.root
      )
        return;
      if (this.userCenter == null || this.panOrigin == null) {
        this.panOrigin = {
          x: -this.level.root.x,
          y: -this.level.root.y,
        };
      }
      this.userCenter = new box2d.b2Vec2(
        this.panOrigin.x - input.deltaX / this.game.camera.scale.x,
        this.panOrigin.y - input.deltaY / this.game.camera.scale.y,
      );
    });
    this.game.TouchManager.register(null, "panend", (_input) => {
      this.userCenter = null;
    });
  }

  onWheelEvent(ev: WheelEvent) {
    console.log("zoom", ev.deltaY);
    if (!this.level.root) return;
    if (ev.deltaY > 0) {
      this.wheelScale = Math.min(
        this.maxScale,
        Math.max(this.minScale, this.level.root.scale.x * 0.8),
      );
    } else {
      this.wheelScale = Math.min(
        this.maxScale,
        Math.max(this.minScale, this.level.root.scale.x * 1.2),
      );
    }
    ev.stopPropagation();
    ev.preventDefault();
    this.resetWheelZoom();
  }

  update() {
    if (!this.camFreeze) {
      this.updateCamera();
      return this.animate();
    }
  }

  updateCamera() {
    if (this.level.pers1 == null || this.level.pers2 == null) return;
    let pers1Pos = new box2d.b2Vec2(
      this.level.pers1.sprite.x,
      this.level.pers1.sprite.y,
    );
    let pers2Pos = new box2d.b2Vec2(
      this.level.pers2.sprite.x,
      this.level.pers2.sprite.y,
    );
    let charDistance = pers2Pos.Clone().SelfSub(pers1Pos);
    let realSize = {
      width:
        this.game.realWidth -
        this.viewportPadding.left -
        this.viewportPadding.right,
      height:
        this.game.realHeight -
        this.viewportPadding.top -
        this.viewportPadding.bottom,
    };
    let distX =
      Math.abs(charDistance.x) +
      this.worldPadding.left +
      this.worldPadding.right;
    let distY =
      Math.abs(charDistance.y) +
      this.worldPadding.top +
      this.worldPadding.bottom;
    distX = Math.min(distX, this.game.level.size?.width ?? 0);
    distY = Math.min(distY, this.game.level.size?.height ?? 0);
    let xScale = 1;
    if (distX > realSize.width) {
      xScale = realSize.width / distX;
    }
    let yScale = 1;
    if (distY > realSize.height) {
      yScale = realSize.height / distY;
    }
    let focusScale = xScale < 1 || yScale < 1 ? Math.min(xScale, yScale) : 1;
    let minSize =
      this.game.gameConfig.id === "elements" ||
      this.game.bowser.mobile ||
      this.game.width <= 780 ||
      this.game.height <= 480
        ? {
            width: this.game.physics.box2d.mpx(20),
            height: this.game.physics.box2d.mpx(15),
          }
        : {
            width: this.game.physics.box2d.mpx(40),
            height: this.game.physics.box2d.mpx(30),
          };
    if (focusScale * minSize.width > this.game.realWidth) {
      focusScale = this.game.realWidth / minSize.width;
    }
    if (focusScale * minSize.height > this.game.realHeight) {
      focusScale = this.game.realHeight / minSize.height;
    }
    if (this.userScale != null) {
      focusScale = this.userScale;
    }
    if (this.wheelScale != null) {
      focusScale = this.wheelScale;
    }
    let focusPoint = pers1Pos
      .Clone()
      .SelfAdd(charDistance.Clone().SelfMul(0.5))
      .SelfMul(focusScale);
    if (this.userCenter != null) {
      focusPoint = new box2d.b2Vec2(this.userCenter.x, this.userCenter.y);
    }
    if (this.level.debug) {
      focusScale = 1;
      focusPoint = new box2d.b2Vec2(
        this.game.realWidth / 2,
        this.game.realHeight / 2,
      );
      this.game.camera.x = 0;
      this.game.camera.y = 0;
    }
    this.focusOn(focusPoint, focusScale);
    if (!this.level.debug) {
      return this.checkBounds();
    }
  }

  focusOn(point: box2d.b2Vec2, scale: number) {
    this.target.x = Math.round(-point.x + this.game.realWidth / 2);
    this.target.y = Math.round(-point.y + this.game.realHeight / 2);
    this.target.scale = scale;
  }

  animate() {
    if (
      !this.level.root ||
      (this.target.x === this.level.root.x &&
        this.target.y === this.level.root.y &&
        this.target.scale === this.level.root.scale.x)
    ) {
      return;
    }
    let speed = this.userCenter != null ? 1 / 3 : 1 / 15;
    this.target.ax = (this.target.x - this.level.root.x) * speed;
    this.target.ay = (this.target.y - this.level.root.y) * speed;
    this.target.ascale = (this.target.scale - this.level.root.scale.x) * speed;
    this.target.vx += this.target.ax;
    this.target.vx *= 0.5;
    this.target.vy += this.target.ay;
    this.target.vy *= 0.5;
    this.target.vscale += this.target.ascale;
    this.target.vscale *= 0.5;
    this.level.root.x += this.target.vx;
    this.level.root.y += this.target.vy;
    this.level.root.scale.x += this.target.vscale;
    this.level.root.scale.y += this.target.vscale;
  }

  checkBounds() {
    let edges = {
      left: false,
      top: false,
      right: false,
      bottom: false,
    };
    let levelRect = new Rectangle(
      0,
      0,
      this.game.level.size?.width ?? 0,
      this.game.level.size?.height ?? 0,
    );
    if (0 <= this.target.x + levelRect.x * this.target.scale) {
      edges.left = true;
      this.target.x = levelRect.x * this.target.scale;
    }
    if (
      this.game.realWidth >=
      this.target.x + levelRect.right * this.target.scale
    ) {
      edges.right = true;
      this.target.x = this.game.realWidth - levelRect.right * this.target.scale;
    }
    if (0 <= this.target.y + levelRect.y * this.target.scale) {
      edges.top = true;
      this.target.y = levelRect.top * this.target.scale;
    }
    if (
      this.game.realHeight >=
      this.target.y + levelRect.bottom * this.target.scale
    ) {
      edges.bottom = true;
      this.target.y =
        this.game.realHeight - levelRect.bottom * this.target.scale;
    }
    if (
      levelRect.width * this.target.scale < this.game.realWidth &&
      (edges.right || edges.left)
    ) {
      this.target.x =
        this.game.realWidth / 2 - (levelRect.width * this.target.scale) / 2;
    }
    if (
      levelRect.height * this.target.scale < this.game.realHeight &&
      (edges.top || edges.bottom)
    ) {
      this.target.y =
        this.game.realHeight / 2 - (levelRect.height * this.target.scale) / 2;
    }
    this.target.x -= this.game.realWidth / 2;
    this.target.y -= this.game.realHeight / 2;
  }

  destroy() {
    this.camGraphics.destroy();
    window.removeEventListener("wheel", this.onWheelEvent);
    this.game.TouchManager.unregister(null, "pinch");
    this.game.TouchManager.unregister(null, "pinchend");
    this.game.TouchManager.unregister(null, "pan");
    this.game.TouchManager.unregister(null, "panend");
  }
}

export default CameraManager;
