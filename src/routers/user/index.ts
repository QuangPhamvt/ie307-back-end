import Elysia from "elysia"
import userModel from "./user.model"
import userService from "./service"
import authorizationMiddleware from "src/middleware/authorization"

const userRouter = new Elysia()
  .use(userModel)
  .use(authorizationMiddleware)
  .get("/", () => {})
  .post(
    "/search",
    ({ request: { headers }, body, set }) => {
      return userService.postOriginUser({ headers, body, set })
    },
    {
      body: "postOriginUserBody",
      response: "postOriginUserResponse",
      detail: {
        tags: ["User"],
        security: [{ BearerAuth: [] }],
      },
    },
  )

export default userRouter
