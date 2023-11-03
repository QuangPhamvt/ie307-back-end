import Elysia from "elysia"

export const websocket = new Elysia().get("", () => {
  return "websocket"
})
