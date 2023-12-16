import Elysia from "elysia"
import authRouter from "./auth"
import postRouter from "./post"
// import followRouter from "./follow"
// import chatRouter from "./chat"
import userRouter from "./user"

const routers = new Elysia()
  .group("/user", (app) => app.use(authRouter))
  .group("/post", (app) => app.use(postRouter))
  .group("/user", (app) => app.use(userRouter))
// .group("/chat", (app) => app.use(chatRouter))
// .group("/follow", (app) => app.use(followRouter))
export default routers
