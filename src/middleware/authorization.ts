import chalk from "chalk"
import { like } from "drizzle-orm"
import Elysia from "elysia"
import { JWT_ACCESS_TOKEN } from "src/config/jwt"
import db, { users } from "src/database"

const authorizationMiddleware = new Elysia()
authorizationMiddleware
  .use(JWT_ACCESS_TOKEN)
  .derive(({ request: { headers } }) => {
    return {
      authorization: headers.get("authorization"),
    }
  })
  .onBeforeHandle(async ({ authorization, JWT_ACCESS_TOKEN, request: { headers }, set }) => {
    const JWT = authorization?.split(" ")[1]
    const user = await JWT_ACCESS_TOKEN.verify(JWT)
    if (!user) {
      set.status = 403
      return {
        message: "Forbidden",
      }
    }
    const [isMatch] = await db.select().from(users).where(like(users.id, user.id))
    if (!isMatch) {
      set.status = 401
      return {
        message: "Unauthorized",
      }
    }
    if (!!user) {
      headers.set("userId", user.id)
    }
  })
export default authorizationMiddleware
