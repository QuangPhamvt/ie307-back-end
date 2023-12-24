import Elysia from "elysia"
import storiesModel from "./stories.model"

const storiesRouter = new Elysia().use(storiesModel).get(
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
export default storiesRouter
