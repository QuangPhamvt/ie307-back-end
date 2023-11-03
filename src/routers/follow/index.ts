import Elysia, { t } from "elysia"
import authorizationMiddleware from "src/middleware/authorization"
import { followService } from "./follow.service"

const followRouter = new Elysia()
  .get("", () => {
    return "follow"
  })
  .use(authorizationMiddleware)
  .post(
    "",
    ({ body, request: { headers }, set }) => {
      if (body.follow) return followService.follow(body.follow, headers, set)
    },
    {
      body: t.Object({
        follow: t.Object({
          following_id: t.String(),
        }),
      }),
      detail: {
        tags: ["Follow"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
export default followRouter
