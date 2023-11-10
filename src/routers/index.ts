import Elysia from "elysia"
import authRouter from "./auth"
import postRouter from "./post"
import followRouter from "./follow"
import chatRouter from "./chat"

const routers = new Elysia()
  .group("/user", (app) => app.use(authRouter))
  .group("/post", (app) => app.use(postRouter))
  .group("/follow", (app) => app.use(followRouter))
  .group("/chat", (app) => app.use(chatRouter))
export default routers
