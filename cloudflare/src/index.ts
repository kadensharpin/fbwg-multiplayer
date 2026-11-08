import { RoomDurableObject } from "./Room";
export { RoomDurableObject };

export interface Env {
  ROOM_DURABLE_OBJECT: DurableObjectNamespace<RoomDurableObject>;
  ASSETS: Fetcher;
}

const MULTIPLAYER = "/multiplayer/";

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith(MULTIPLAYER)) {
      const upgradeHeader = request.headers.get("Upgrade");
      if (upgradeHeader !== "websocket") {
        return new Response("Expected Upgrade: websocket", { status: 426 });
      }
      const name = url.pathname.slice(MULTIPLAYER.length);
      const id = env.ROOM_DURABLE_OBJECT.idFromName(name);
      const room = env.ROOM_DURABLE_OBJECT.get(id);
      return room.fetch(request);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
