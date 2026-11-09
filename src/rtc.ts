import { SignalServerConnection } from "./signal";
import type { Characters } from "./States/Level/character";

export type EventType = MessageType | "close" | "open";
export type MessageType =
  | "change-temple"
  | "start-temple"
  | "start-level"
  | "finish-level"
  | "pick-character"
  | "left"
  | "right"
  | "jump"
  | "set-pos"
  | "retry";
export type MessageData<Type extends MessageType> = Type extends "change-temple"
  ? string // temple
  : Type extends "start-temple"
    ? null
    : Type extends "finish-level"
      ? boolean // success or fail
      : Type extends "start-level"
        ? number // id
        : Type extends "pick-character"
          ? Characters
          : Type extends "right"
            ? boolean // down - true, up - false
            : Type extends "left"
              ? boolean // down - true, up - false
              : Type extends "jump"
                ? boolean // down - true, up - false
                : Type extends "set-pos"
                  ? [x: number, y: number]
                  : Type extends "retry"
                    ? null
                    : never;
type Message<Type extends MessageType> = {
  type: Type;
  data: MessageData<Type>;
};

const configuration: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export class Rtc {
  private readonly signalServer: SignalServerConnection;
  private readonly connection: RTCPeerConnection;
  private readonly messageHandlers: {
    [Type in EventType]?: Array<
      Type extends MessageType
        ? (message: MessageData<Type>) => void
        : () => void
    >;
  };
  private channel: RTCDataChannel | null = null;
  private _isHost: boolean = false;

  constructor(
    readonly room: string,
    config: RTCConfiguration = configuration,
  ) {
    this.signalServer = new SignalServerConnection(room);
    this.connection = new RTCPeerConnection(config);

    this.messageHandlers = {};

    this.signalServer.sendMessage("ping", null);
    this.signalServer.onMessage("ping", () => {
      this._isHost = true;
      this.channel = this.connection.createDataChannel("chat");
      this.channel.onopen = () => this.onChannelOpen();

      this.offer();
    });
    this.waitForOffers();
  }

  private async offer() {
    this.connection.onicecandidate = (ev) => {
      if (!ev.candidate) return;
      this.signalServer.sendMessage("candidate", ev.candidate);
    };

    const offer = await this.connection.createOffer();
    await this.connection.setLocalDescription(offer);

    await this.waitForIceGathering();

    this.signalServer.onMessage("answer", (answer) => {
      this.connection.setRemoteDescription(answer);
    });
    this.signalServer.sendMessage("offer", this.connection.localDescription!);
  }

  private async waitForOffers() {
    this.signalServer.onMessage("offer", async (offer) => {
      this.connection.ondatachannel = (event) => {
        this.channel = event.channel;
        this.channel.onopen = () => this.onChannelOpen();
      };
      await this.connection.setRemoteDescription(offer);

      const answer = await this.connection.createAnswer();
      await this.connection.setLocalDescription(answer);
      await this.waitForIceGathering();

      this.signalServer.sendMessage(
        "answer",
        this.connection.localDescription!,
      );

      this.signalServer.onMessage("candidate", (candidate) => {
        this.connection.addIceCandidate(candidate);
      });
    });
  }

  private async waitForIceGathering(): Promise<void> {
    if (this.connection.iceGatheringState === "complete") return;

    return new Promise((resolve) => {
      const checkState = () => {
        if (this.connection.iceGatheringState === "complete") {
          this.connection.removeEventListener(
            "icegatheringstatechange",
            checkState,
          );
          resolve();
        }
      };
      this.connection.addEventListener("icegatheringstatechange", checkState);
    });
  }

  private async onChannelOpen() {
    this.signalServer.close();

    this.channel!.onmessage = (ev) => {
      try {
        const message = JSON.parse(ev.data) as Message<"change-temple"> | null;
        if (!message?.type) return;
        this.messageHandlers[message.type]?.forEach((handler) =>
          handler(message.data),
        );
      } catch (err) {}
    };
    this.channel!.onclose = () =>
      this.messageHandlers["close"]?.forEach((handler) => handler());
    this.messageHandlers["open"]?.forEach((handler) => handler());
  }

  async send<Type extends MessageType>(type: Type, data: MessageData<Type>) {
    if (!this.isOpen()) return;
    this.channel!.send(JSON.stringify({ type, data } satisfies Message<Type>));
  }

  on<Type extends EventType>(
    type: Type,
    handler: Type extends MessageType
      ? (message: MessageData<Type>) => void
      : () => void,
  ) {
    this.messageHandlers[type] ??= [];
    this.messageHandlers[type].push(handler);
  }

  isOpen() {
    return this.channel?.readyState === "open";
  }

  isHost() {
    return this._isHost;
  }
}
