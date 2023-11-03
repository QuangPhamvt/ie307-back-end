import Elysia from "elysia"
import authRouter from "./auth"
import postRouter from "./post"
import followRouter from "./follow"
import { websocket } from "src/websocket"

const routers = new Elysia()
  .group("/user", (app) => app.use(authRouter))
  .group("/post", (app) => app.use(postRouter))
  .group("/follow", (app) => app.use(followRouter))
  .group("/websocket", (app) => app.use(websocket))
export default routers
