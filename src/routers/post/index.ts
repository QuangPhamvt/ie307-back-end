import Elysia, { t } from "elysia"
import { JWT_ACCESS_TOKEN } from "src/config/jwt"
import authorizationMiddleware from "src/middleware/authorization"
import postModel from "./post.model"
import postService from "./service"

const postRouter = new Elysia()
  .use(postModel)
  .use(JWT_ACCESS_TOKEN)
  .post(
    "/post-list",
    ({ request: { headers }, set, body }) => {
      return postService.postList({ headers, set, body })
    },
    {
      body: "postListBody",
      response: "postListResponse",
      detail: {
        tags: ["Post"],
      },
    },
  )
  .post(
    "/search",
    ({ request: { headers }, set, body }) => {
      return postService.search({ headers, set, body })
    },
    {
      body: "searchBody",
      response: "searchResponseDto",
      detail: {
        tags: ["Post"],
      },
    },
  )
  .post(
    "/origin",
    ({ request: { headers }, set, body }) => {
      return postService.originPost({ headers, body, set })
    },
    {
      body: "originPostBody",
      response: "originPostResponse",
      detail: {
        tags: ["Post"],
      },
    },
  )
  .use(authorizationMiddleware)
  .post(
    "/upload",
    ({ body, request: { headers }, set }) => {
      return postService.upload({ headers, body, set })
    },
    {
      body: "uploadPostBody",
      response: "uploadPostResponse",
      detail: {
        tags: ["Post"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
export default postRouter
