import Elysia from "elysia"
import authRouter from "./auth"

const routers = new Elysia().group("/user", (app) => app.use(authRouter))
export default routers
