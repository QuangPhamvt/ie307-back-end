import Elysia, { t } from "elysia"
import authorizationMiddleware from "src/middleware/authorization"
import { chatService } from "./chat.service"

const chatRouter = new Elysia()
  .use(authorizationMiddleware)
  .get(
    "",
    ({ request: { headers }, set }) => {
      return chatService.getSummarized({ headers, set })
    },
    {
      detail: {
        tags: ["Chat"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
  .post(
    "",
    ({ body, request: { headers }, set }) => {
      if (body.detail) return chatService.postDetail({ body: body.detail, headers, set })
    },
    {
      body: t.Object({
        detail: t.Object({
          receiver_id: t.String(),
        }),
      }),
      detail: {
        tags: ["Chat"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
export default chatRouter
