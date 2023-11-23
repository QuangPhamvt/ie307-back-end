import Elysia, { t } from "elysia"
import authorizationMiddleware from "src/middleware/authorization"
import followService from "./service"
import { followModel } from "./follow.model"

const followRouter = new Elysia()
  .use(followModel)
  .use(authorizationMiddleware)
  .get(
    "",
    ({ request: { headers }, set }) => {
      return followService.getFollowing({ headers, set })
    },
    {
      response: "getFollowingResponse",
      detail: {
        tags: ["Follow"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
  .post(
    "/following",
    ({ request: { headers }, set, body }) => {
      return followService.followUser({ headers, set, body })
    },
    {
      body: "followingBody",
      response: "followingResponse",
      detail: {
        tags: ["Follow"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
  .post(
    "/un-following",
    ({ request: { headers }, set, body }) => {
      return followService.unFollowUser({ headers, set, body })
    },
    {
      body: "unFollowingBody",
      response: "unFollowingResponse",
      detail: {
        tags: ["Follow"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
export default followRouter
