import { Elysia } from "elysia"
import routers from "./routers"
import { document } from "./config"
import { Server } from "socket.io"

const app = new Elysia()
  .use(document)
  .get("/", () => "Hello Elysia")
  .use(routers)

app.listen({
  port: process.env.PORT_SERVER || 3000,
  hostname: "127.0.0.1",
})
console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}/api/v1/document`)
