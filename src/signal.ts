export type MessageType = "ping" | "candidate" | "offer" | "answer";
export type MessageData<Type extends MessageType> = Type extends "ping"
  ? null
  : Type extends "candidate"
    ? RTCIceCandidate
    : Type extends "offer"
      ? RTCSessionDescriptionInit
      : Type extends "answer"
        ? RTCSessionDescriptionInit
        : never;
type Message<Type extends MessageType> = {
  type: Type;
  data: MessageData<Type>;
};

export class SignalServerConnection {
  private readonly ws: WebSocket;
  private readonly messageHandlers: {
    [Type in MessageType]?: Array<(Message: MessageData<Type>) => void>;
  };

  readonly onOpen: Promise<void>;

  constructor(room: string) {
    let onOpen: () => void;
    this.onOpen = new Promise((s) => (onOpen = s));

    this.messageHandlers = {};

    this.ws = new WebSocket("/multiplayer/" + room);
    this.ws.onopen = onOpen!;
    this.ws.onmessage = (ev) => {
      try {
        const message = JSON.parse(ev.data) as Message<"candidate"> | null;
        if (!message?.type) return;
        this.messageHandlers[message.type]?.forEach((handler) =>
          handler(message.data),
        );
      } catch (err) {}
    };
  }

  async sendMessage<Type extends MessageType>(
    type: Type,
    data: MessageData<Type>,
  ) {
    await this.onOpen;
    this.ws.send(JSON.stringify({ type, data } satisfies Message<Type>));
  }

  onMessage<Type extends MessageType>(
    type: Type,
    handler: (data: MessageData<Type>) => void,
  ) {
    this.messageHandlers[type] ??= [];
    this.messageHandlers[type].push(handler);
  }

  close() {
    this.ws.close();
  }
}
