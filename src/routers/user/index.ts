import Elysia from "elysia"
import userModel from "./user.model"
import userService from "./service"
import authorizationMiddleware from "src/middleware/authorization"

const userRouter = new Elysia()
  .use(userModel)
  .use(authorizationMiddleware)
  .get(
    "",
    ({ request: { headers }, set }) => {
      return userService.getMe({ headers, set })
    },
    {
      response: "getMeResponse",
      detail: {
        tags: ["User"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
  .post(
    "/follow",
    ({ request: { headers }, set, body }) => {
      return userService.uploadFollow({ headers, set, body })
    },
    {
      body: "uploadFollowBody",
      response: "uploadFollowResponse",
      detail: {
        tags: ["User"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
  .post(
    "/search",
    ({ request: { headers }, body, set }) => {
      return userService.getUserDetail({ headers, body, set })
    },
    {
      body: "getUserDetailBody",
      response: "getUserDetailResponse",
      detail: {
        tags: ["User"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
  .post(
    "/upload",
    ({ request: { headers }, set, body }) => {
      return userService.uploadProfile({ headers, set, body })
    },
    {
      body: "uploadProfileBody",
      response: "uploadProfileResponse",
      detail: {
        tags: ["User"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
  .post(
    "/love",
    ({ request: { headers }, body, set }) => {
      return userService.postLove({ headers, body, set })
    },
    {
      body: "postLoveBody",
      response: "postLoveResponse",
      detail: {
        tags: ["User"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
  .post(
    "/search-username",
    ({ request: { headers }, body, set }) => {
      return userService.searchUsername({ headers, body, set })
    },
    {
      body: "searchUsernameBody",
      response: "searchUsernameResponse",
      detail: {
        tags: ["User"],
        security: [{ BearerAuth: [] }],
      },
    },
  )

export default userRouter
