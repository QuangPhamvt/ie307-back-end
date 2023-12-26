import Elysia, { t } from "elysia"

const uploadStoryBodyDto = t.Object({
  image: t.String({ contentEncoding: "base64" }),
})
const uploadStoryResponseDto = t.Object({
  message: t.String(),
  data: t.Array(t.Any()),
})
const storiesModel = new Elysia().model({
  uploadStoryBody: uploadStoryBodyDto,
  uploadStoryResponse: uploadStoryResponseDto,
})
export default storiesModel
