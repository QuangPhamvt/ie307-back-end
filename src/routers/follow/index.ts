import Elysia, { t } from "elysia"
import authorizationMiddleware from "src/middleware/authorization"
import { followService } from "./follow.service"

const followRouter = new Elysia()
  .use(authorizationMiddleware)
  .get(
    "",
    ({ request: { headers }, set }) => {
      return followService.getFollowing(headers, set)
    },
    {
      detail: {
        tags: ["Follow"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
  .post(
    "",
    ({ body, request: { headers }, set }) => {
      if (body.follow) return followService.follow(body.follow, headers, set)
      if (body.unFollow) return followService.unFollow(body.unFollow, headers, set)
    },
    {
      body: t.Partial(
        t.Object({
          follow: t.Object({
            following_id: t.String(),
          }),
          unFollow: t.Object({
            following_id: t.String(),
          }),
        }),
      ),
      detail: {
        tags: ["Follow"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
export default followRouter
