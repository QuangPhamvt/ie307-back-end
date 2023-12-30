import Elysia from "elysia"
import authRouter from "./auth"
import postRouter from "./post"
import userRouter from "./user"
import storiesRouter from "./stories"
import commentRouter from "./comment"
// import followRouter from "./follow"
// import chatRouter from "./chat"

const routers = new Elysia()
  .group("/user", (app) => app.use(authRouter))
  .group("/post", (app) => app.use(postRouter))
  .group("/user", (app) => app.use(userRouter))
  .group("/stories", (app) => app.use(storiesRouter))
  .group("/comment", (app) => app.use(commentRouter))
// .group("/chat", (app) => app.use(chatRouter))
// .group("/follow", (app) => app.use(followRouter))
export default routers
