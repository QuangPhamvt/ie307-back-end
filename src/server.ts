import { Elysia } from "elysia"
import routers from "./routers"
import { document } from "./config"

const app = new Elysia()
  .use(document)
  .get("/", () => "Hello Elysia")
  .use(routers)
  .listen({
    port: 3000,
    hostname: "127.0.0.1",
  })

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}/v1/document`)
