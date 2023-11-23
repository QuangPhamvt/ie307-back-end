import Elysia, { t } from "elysia"

const getSummarizedResponseDto = t.Object({
  message: t.String(),
  data: t.Array(
    t.Object({
      user: t.Object({
        user_id: t.String(),
        avatar: t.Union([t.String(), t.Null()]),
        username: t.String(),
      }),
      message: t.Object({
        user_id: t.String(),
        message: t.String(),
        createAt: t.Date(),
      }),
    }),
  ),
})
const chatModel = new Elysia().model({
  getSummarizedResponse: getSummarizedResponseDto,
})

export default chatModel
