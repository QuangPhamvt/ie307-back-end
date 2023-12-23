import { Elysia } from "elysia"
import routers from "./routers"
import { document } from "./config"

const app = new Elysia()
  .use(document)
  .get("/", ({ request: headers }) => {
    return {
      url: headers.url,
      headers: headers.redirect,
    }
  })
  .use(routers)

app.listen({
  port: process.env.PORT_SERVER || 3000,
  hostname: "0.0.0.0",
})
console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}/api/v1/document`)
