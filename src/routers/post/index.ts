import Elysia, { t } from "elysia"
import { JWT_ACCESS_TOKEN } from "src/config/jwt"
import authorizationMiddleware from "src/middleware/authorization"
import postService from "./post.service"

const postRouter = new Elysia()
  .use(JWT_ACCESS_TOKEN)
  .get("", ({ body }) => {}, {
    body: t.Partial(
      t.Object({
        ["postList"]: t.Object({
          ["limit"]: t.Number(),
          ["page"]: t.Number(),
        }),
      }),
    ),
    detail: {
      tags: ["Post"],
    },
  })
  .post(
    "",
    ({ body }) => {
      if (!!body.postList) {
        return postService.postList(body.postList)
      }
      if (!!body.search) {
        return postService.search(body.search)
      }
      if (!!body.originPost) {
        return postService.originPost(body.originPost)
      }
    },
    {
      body: t.Partial(
        t.Object({
          ["postList"]: t.Object({
            ["limit"]: t.Number(),
            ["page"]: t.Number(),
          }),
          originPost: t.Object({
            postId: t.String(),
          }),
          ["search"]: t.Object({
            ["search"]: t.String(),
          }),
        }),
      ),
      detail: {
        tags: ["Post"],
      },
    },
  )
  .use(authorizationMiddleware)
  .post(
    "/upload",
    ({ body, request: { headers }, set }) => {
      return postService.upload(body, headers, set)
    },
    {
      body: t.Object({
        title: t.String(),
        image: t.String({ contentEncoding: "base64" }),
      }),
      detail: {
        tags: ["Post"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
export default postRouter
