import Elysia from "elysia"
import storiesModel from "./stories.model"
import storyService from "./services"
import authorizationMiddleware from "src/middleware/authorization"

const storiesRouter = new Elysia()
  .use(storiesModel)
  .use(authorizationMiddleware)
  .get(
    "/",
    () => {
      return {
        get: "Stories",
      }
    },
    {
      detail: {
        tags: ["Stories"],
      },
    },
  )
  .post(
    "/upload",
    ({ request: { headers }, set, body }) => {
      return storyService.uploadStory({ headers, set, body })
    },
    {
      body: "uploadStoryBody",
      response: "uploadStoryResponse",
      detail: {
        tags: ["Stories"],
        security: [{ BearerAuth: [] }],
      },
    },
  )
export default storiesRouter
