/// <amd-module name="States/Level/MechManager" />

import { Game } from "@azerion/phaser";
import BackgroundCover from "./Devices/BackgroundCover";
import Ball from "./Devices/Ball";
import Beamer from "./Devices/Beamer";
import Box from "./Devices/Box";
import BoxHeavy from "./Devices/BoxHeavy";
import BoxMirror from "./Devices/BoxMirror";
import Device, { DeviceOptions } from "./Devices/Device";
import Hanging from "./Devices/Hanging";
import InfiniteMirror from "./Devices/InfiniteMirror";
import Lever from "./Devices/Lever";
import LightPusher from "./Devices/LightPusher";
import MovingPlatform from "./Devices/MovingPlatform";
import Portal from "./Devices/Portal";
import Pulley from "./Devices/Pulley";
import Pusher from "./Devices/Pusher";
import Roman from "./Devices/Roman";
import RotMirror from "./Devices/RotMirror";
import Slider from "./Devices/Slider";
import TimedPusher from "./Devices/TimedPusher";
import Wind from "./Devices/Wind";
import Window from "./Devices/Window";

class MechManager {
  deviceGroups: Record<number, Device<DeviceOptions>[]> = {};

  constructor(readonly game: Game) {
    this.deviceChanged = this.deviceChanged.bind(this);
    this.resetStates = this.resetStates.bind(this);
    this.connectToWall = this.connectToWall.bind(this);
    this.registerDevice = this.registerDevice.bind(this);
  }

  registerDevice(device: Device<DeviceOptions>) {
    const groupId = device.options.properties?.group ?? 0;
    this.deviceGroups[groupId] ||= [];
    this.deviceGroups[groupId].push(device);
    device.signal?.add(this.deviceChanged);
  }

  connectPortals() {
    const portalMap: Record<number, Portal[]> = {};
    for (const group of Object.values(this.deviceGroups)) {
      for (const device of group) {
        if (device instanceof Portal) {
          const portalId = device.options.properties.portalId;
          portalMap[portalId] ||= [];
          portalMap[portalId].push(device);
        }
      }
    }
    for (const portals of Object.values(portalMap)) {
      if (portals.length != 2) continue;
      const portal1 = portals[0]!;
      const portal2 = portals[1]!;
      portal1.other = portal2;
      portal2.other = portal1;
      portal1.options.properties.inverted ||= false;
      portal2.options.properties.inverted ||= false;
      this.connectToWall(portal1);
      this.connectToWall(portal2);
    }
  }

  connectToWall(portal: Portal) {
    const x = this.game.physics.box2d.pxm(portal.options.x);
    const y = this.game.physics.box2d.pxm(portal.options.y);
    const pos = new box2d.b2Vec2(x, y);
    const bottom = pos
      .Clone()
      .SelfAdd(
        new box2d.b2Vec2(0.5, 0).SelfRotateRadians(portal.options.rotation),
      );
    const top = pos
      .Clone()
      .SelfAdd(
        new box2d.b2Vec2(-0.5, 0).SelfRotateRadians(portal.options.rotation),
      );
    let block: box2d.b2Vec2 | null = null;
    if (
      -1 ===
      this.game.level.ground.getTileAt(
        Math.floor(bottom.x),
        Math.floor(bottom.y),
      ).properties.type
    ) {
      block = bottom;
    }
    if (
      -1 ===
      this.game.level.ground.getTileAt(Math.floor(top.x), Math.floor(top.y))
        .properties.type
    ) {
      block = top;
    }
    if (null != block) {
      block.SelfAdd(
        new box2d.b2Vec2(0, -0.5).SelfRotateRadians(portal.options.rotation),
      );
      const options = {
        center: new box2d.b2Vec2(-block.x, -block.y),
        rotation: portal.options.rotation,
        width: 0.5,
        height: 1.5,
      };
      portal.createFakeBlock(options);
    }
  }

  resetStates() {
    for (const devices of Object.values(this.deviceGroups)) {
      for (const device of devices) {
        device.updateState(true);
      }
    }
  }

  deviceChanged(device: Device<DeviceOptions>) {
    console.log("--");
    let state = device.state;
    const devices = this.deviceGroups[device.options.properties?.group ?? 0];
    for (const dev1 of devices ?? []) {
      if (null != dev1.signal) {
        state = state || dev1.state;
      }
    }
    for (const dev1 of devices ?? []) {
      if (null == dev1.signal) dev1.state = state;
      dev1._updateState();
    }
  }

  static className(key: keyof typeof MechManager.classNames) {
    return MechManager.classNames[key];
  }

  static classNames = {
    pusher: Pusher,
    lever: Lever,
    box: Box,
    platform: MovingPlatform,
    beamer: Beamer,
    rotmirror: RotMirror,
    lightpusher: LightPusher,
    portal: Portal,
    ball: Ball,
    pulley: Pulley,
    hanging: Hanging,
    boxmirror: BoxMirror,
    boxheavy: BoxHeavy,
    infinitemirror: InfiniteMirror,
    slider: Slider,
    timedpusher: TimedPusher,
    wind: Wind,
    cover: BackgroundCover,
    window: Window,
    roman: Roman,
  };
}

export = MechManager;
