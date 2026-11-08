import { DurableObject } from "cloudflare:workers";
import type { Env } from ".";

export class RoomDurableObject extends DurableObject {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }

  fetch(_request: Request): Response {
    const { 0: client, 1: server } = new WebSocketPair();

    this.ctx.acceptWebSocket(server);
    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    for (const client of this.ctx.getWebSockets()) {
      if (client !== ws) {
        client.send(message);
      }
    }
  }

  webSocketClose(
    _ws: WebSocket,
    _code: number,
    _reason: string,
    _wasClean: boolean,
  ) {
    for (const client of this.ctx.getWebSockets()) {
      client.send(JSON.stringify({ type: "peer_disconnected" }));
    }
  }
}
