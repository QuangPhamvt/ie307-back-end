import Elysia, { t } from "elysia"
import authorizationMiddleware from "src/middleware/authorization"

export const websocket = new Elysia({
  websocket: {
    /**
     * Sets the the number of seconds to wait before timing out a connection
     * due to no messages or pings.
     *
     * Default is 2 minutes, or `120` in seconds.
     */
    idleTimeout: 120,
  },
})
  .onBeforeHandle(({ request: { headers } }) => {
    headers.set("sender_id", "quang")
    headers.set("receiver_id", "chi")
  })
  .ws("/ws", {
    body: t.Object({
      receiver_id: t.String(),
      message: t.String(),
    }),
    open(ws) {
      ws.subscribe(ws.data.request.headers.get("sender_id") || "")
      ws.subscribe(ws.data.request.headers.get("receiver_id") || "")
    },
    message(ws, message) {
      ws.publish(message.receiver_id, message.message)
    },
  })
  .listen(8000)
