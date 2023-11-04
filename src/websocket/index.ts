import Elysia, { t } from "elysia"

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
  .ws("/ws", {
    body: t.Object({
      message: t.String(),
    }),
    open(ws) {
      ws.subscribe("A")
    },
    message(ws, message) {
      ws.publish("A", message)
    },
  })
  .listen(8000)
