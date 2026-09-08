/// <amd-module name="TouchManager" />

import { Game, Point, Signal } from "@azerion/phaser";
import Hammer from "hammerjs";

type Handler<Sprite, Callback> = {
  sprite: Sprite;
  callback: Callback;
};

type Events = {
  tap?: Handler<PIXI.DisplayObject | null, (ev: HammerInput) => void>[];
  pan?: Handler<PIXI.DisplayObject | null, (ev: HammerInput) => void>[];
  swipe?: Handler<PIXI.DisplayObject | null, (ev: HammerInput) => void>[];
  panstart?: Handler<PIXI.DisplayObject | null, (ev: HammerInput) => void>[];

  panmove?: Handler<null, (ev: HammerInput) => void>[];
  panend?: Handler<null, (ev: HammerInput) => void>[];
  pinch?: Handler<null, (ev: HammerInput) => void>[];
  pinchend?: Handler<null, (ev: HammerInput) => void>[];

  touchstart?: Handler<PIXI.DisplayObject, (ev: TouchEvent) => void>[];
  touchend?: Handler<
    PIXI.DisplayObject,
    (ev: TouchEvent, hitSprite: boolean) => void
  >[];

  mousedown?: Handler<PIXI.DisplayObject, (ev: MouseEvent) => void>[];
  mouseup?: Handler<
    PIXI.DisplayObject,
    (ev: MouseEvent, hitSprite: boolean) => void
  >[];
};

export = TouchManager;
class TouchManager extends Signal {
  private game!: Game;
  private $el!: HTMLElement;
  private events!: Events;

  constructor() {
    super();
    this.update = this.update.bind(this);
    this.hammerIt = this.hammerIt.bind(this);
    this.unregister = this.unregister.bind(this);
    this.register = this.register.bind(this);
    this.resize = this.resize.bind(this);
    this.start = this.start.bind(this);
  }
  start(game: Game) {
    this.game = game;
    this.$el = document.getElementById("hammer")!;
    this.$el.style.position = "absolute";
    this.$el.style.top = "0";
    this.$el.style.left = "0";
    this.$el.style.width = window.innerWidth + "px";
    this.$el.style.height = window.innerHeight + "px";
    this.hammerIt();
    this.events = {};
    return this.events;
  }
  resize() {
    this.$el.style.width = window.innerWidth + "px";
    this.$el.style.height = window.innerHeight + "px";
  }
  register<K extends keyof Events>(
    sprite: (Events[K] & {})[number]["sprite"],
    eventName: K,
    callback: (Events[K] & {})[number]["callback"],
  ) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    (this.events[eventName] as Handler<any, any>[]).unshift({
      sprite,
      callback,
    });
  }
  unregister<K extends keyof Events>(
    sprite: (Events[K] & {})[number]["sprite"],
    eventName: K,
  ) {
    if (!this.events[eventName]) {
      console.warn("Unregistering non-existent event:", eventName);
      return;
    }
    const handler = this.events[eventName].find((el) => el.sprite === sprite);
    if (!handler) {
      console.warn("Unregistering non-existent handler:", eventName);
      return;
    }
    this.events[eventName].splice(
      this.events[eventName].indexOf(handler as any),
      1,
    );
  }
  hammerIt() {
    const hammer = new Hammer(this.$el, {});
    hammer.get("pinch").set({ enable: true });
    hammer.get("swipe").set({ enable: true });
    hammer.get("pinch").recognizeWith(hammer.get("pan"));
    if (
      this.game.bowser.mobile ||
      this.game.bowser.tablet ||
      this.game.device.iPad
    ) {
      hammer.on("tap", (event) => {
        const handlers = this.events.tap;
        if (!handlers) return;
        for (let i = 0; i < handlers.length; i++) {
          const handler = handlers[i];
          if (!handler) continue;
          if (
            !handler.sprite ||
            (handler.sprite.visible &&
              this.game.input.hitTest(
                handler.sprite,
                event.center as any,
                new Point(),
              ))
          ) {
            handler.callback(event);
            break;
          }
        }
      });
    }
    hammer.on("pan", (ev) => {
      const handlers = this.events.pan;
      if (!handlers) return;
      for (let i = 0; i < handlers.length; i++) {
        const handler = handlers[i];
        if (!handler) continue;
        if (
          !handler.sprite ||
          (handler.sprite.visible &&
            this.game.input.hitTest(
              handler.sprite,
              ev.center as any,
              new Point(),
            ))
        )
          handler.callback(ev);
      }
    });
    hammer.on("panstart", (ev) => {
      const handlers = this.events.panstart;
      if (!handlers) return;
      for (let i = 0; i < handlers.length; i++) {
        const handler = handlers[i];
        if (!handler) continue;
        if (
          !handler.sprite ||
          (handler.sprite.visible &&
            this.game.input.hitTest(
              handler.sprite,
              ev.center as any,
              new Point(),
            ))
        )
          handler.callback(ev);
      }
    });
    hammer.on("panmove", (ev) => {
      const handlers = this.events.panmove;
      if (!handlers) return;
      for (let i = 0; i < handlers.length; i++) {
        const handler = handlers[i];
        handler?.callback(ev);
      }
    });
    hammer.on("panend", (ev) => {
      const handlers = this.events.panend;
      if (!handlers) return;
      for (let i = 0; i < handlers.length; i++) {
        const handler = handlers[i];
        handler?.callback(ev);
      }
    });
    hammer.on("swipe", (ev) => {
      const handlers = this.events.swipe;
      if (!handlers) return;
      for (let i = 0; i < handlers.length; i++) {
        const handler = handlers[i];
        if (!handler) continue;
        if (!handler.sprite || handler.sprite.visible) handler.callback(ev);
      }
    });
    hammer.on("pinch", (ev) => {
      const handlers = this.events.pinch;
      if (!handlers) return;
      for (let i = 0; i < handlers.length; i++) {
        const handler = handlers[i];
        handler?.callback(ev);
      }
    });
    hammer.on("pinchend", (ev) => {
      const handlers = this.events.pinchend;
      if (!handlers) return;
      for (let i = 0; i < handlers.length; i++) {
        const handler = handlers[i];
        handler?.callback(ev);
      }
    });
    if (
      this.game.bowser.mobile ||
      this.game.bowser.tablet ||
      this.game.device.iPad
    ) {
      this.$el.addEventListener("touchstart", (ev) => {
        ev.preventDefault();
        const handlers = this.events.touchstart;
        if (!handlers) return;
        const touches = ev.changedTouches;
        for (let i = 0; i < touches.length; i++) {
          const touch = touches[i]!;
          const pos = { x: touch.clientX, y: touch.clientY };
          for (let j = 0; j < handlers.length; j++) {
            const handler = handlers[j];
            if (!handler?.sprite) continue;
            if (
              handler.sprite.visible &&
              this.game.input.hitTest(handler.sprite, pos as any, new Point())
            ) {
              handler.callback(ev);
              handler.sprite.touchId = touch.identifier;
              break;
            }
          }
        }
      });
      this.$el.addEventListener("touchend", (ev) => {
        const handlers = this.events.touchend;
        if (!handlers) return;
        const touches = ev.changedTouches;
        for (let i = 0; i < touches.length; i++) {
          const touch = touches[i]!;
          const pos = { x: touch.clientX, y: touch.clientY };
          for (let j = 0; j < handlers.length; j++) {
            const handler = handlers[j];
            if (!handler) continue;
            if (handler.sprite.touchId === touch.identifier) {
              handler.sprite.touchId = null;
              const hitSprite = this.game.input.hitTest(
                handler.sprite,
                pos as any,
                new Point(),
              );
              handler.callback(ev, hitSprite);
            }
          }
        }
      });
      this.$el.addEventListener("touchcancel", (ev) => {
        const handlers = this.events.touchend;
        if (!handlers) return;
        const touches = ev.changedTouches;
        for (let i = 0; i < touches.length; i++) {
          const touch = touches[i]!;
          const pos = { x: touch.clientX, y: touch.clientY };
          for (let j = 0; j < handlers.length; j++) {
            const handler = handlers[j];
            if (!handler) continue;
            if (handler.sprite.touchId === touch.identifier) {
              handler.sprite.touchId = null;
              const hitSprite = this.game.input.hitTest(
                handler.sprite,
                pos as any,
                new Point(),
              );
              handler.callback(ev, hitSprite);
            }
          }
        }
      });
    } else {
      this.$el.addEventListener("mousedown", (ev) => {
        const handlers = this.events.mousedown;
        if (!handlers) return;
        const pos = { x: ev.clientX, y: ev.clientY };
        for (let i = 0; i < handlers.length; i++) {
          const handler = handlers[i];
          if (!handler?.sprite) continue;
          handler.sprite.mousedowned = false;
        }
        for (let i = 0; i < handlers.length; i++) {
          const handler = handlers[i];
          if (!handler?.sprite || !handler.sprite.visible) continue;
          if (
            this.game.input.hitTest(handler.sprite, pos as any, new Point())
          ) {
            handler.callback(ev);
            handler.sprite.mousedowned = true;
            break;
          }
        }
      });
      this.$el.addEventListener("mouseup", (ev) => {
        const handlers = this.events.mouseup;
        if (!handlers) return;
        const pos = { x: ev.clientX, y: ev.clientY };
        for (let i = 0; i < handlers.length; i++) {
          const handler = handlers[i];
          if (!handler?.sprite) continue;
          if (handler.sprite.visible && handler.sprite.mousedowned) {
            handler.sprite.mousedowned = false;
            const hitSprite = this.game.input.hitTest(
              handler.sprite,
              pos as any,
              new Point(),
            );
            handler.callback(ev, hitSprite);
          }
        }
      });
    }
  }
  update() {}
}

declare global {
  namespace PIXI {
    interface DisplayObject {
      /**
       * Used by the {@link TouchManager}
       */
      mousedowned?: boolean;
      /**
       * Used by the {@link TouchManager}
       */
      touchId?: number | null;
    }
  }
}
