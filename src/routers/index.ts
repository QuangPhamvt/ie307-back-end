import Elysia from "elysia"
import authRouter from "./auth"
import postRouter from "./post"

const routers = new Elysia().group("/user", (app) => app.use(authRouter)).group("/post", (app) => app.use(postRouter))
export default routers
