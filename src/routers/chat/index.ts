import Elysia from "elysia"
import authorizationMiddleware from "src/middleware/authorization"
import chatService from "./service"
import chatModel from "./chat.model"

const chatRouter = new Elysia()
  .use(chatModel)
  .use(authorizationMiddleware)
  .get(
    "",
    ({ request: { headers }, set }) => {
      return chatService.getSummarized({ headers, set })
    },
    {
      response: "getSummarizedResponse",
      detail: {
        tags: ["Chat"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
  .post(
    "/origin-chat",
    ({ request: { headers }, set, body }) => {
      return chatService.originChat({ headers, set, body })
    },
    {
      body: "postOriginChatBody",
      response: "postOriginChatResponse",
      detail: {
        tags: ["Chat"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
export default chatRouter
