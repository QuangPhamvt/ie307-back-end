import Elysia from "elysia"
import commentModel from "./comment.model"
import commentService from "./service"
import authorizationMiddleware from "src/middleware/authorization"

const commentRouter = new Elysia()
  .use(commentModel)
  .use(authorizationMiddleware)
  .get("/", () => {
    return "comment router"
  })
  .post(
    "/",
    ({ request: { headers }, body, set }) => {
      return commentService.postComment({ headers, body, set })
    },
    {
      body: "postCommentBody",
      response: "postCommentResponse",
      detail: {
        tags: ["Comment"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
  .post(
    "/origin",
    ({ request: { headers }, body, set }) => {
      return commentService.getOriginComment({ body, set, headers })
    },
    {
      body: "getCommentOriginBody",
      response: "getCommentOriginResponse",
      detail: {
        tags: ["Comment"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
export default commentRouter
