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
const postOriginChatBodyDto = t.Object({
  user_id: t.String(),
})
const postOriginChatResponseDto = t.Object({
  message: t.String(),
  data: t.Array(
    t.Object({
      user: t.Object({
        user_id: t.String(),
        username: t.String(),
        avatar: t.Union([t.String(), t.Null()]),
      }),
      messages: t.Array(
        t.Object({
          sender_id: t.String(),
          receiver_id: t.String(),
          message: t.String(),
          create_at: t.Date(),
        }),
      ),
    }),
  ),
})
const chatModel = new Elysia().model({
  getSummarizedResponse: getSummarizedResponseDto,

  postOriginChatBody: postOriginChatBodyDto,
  postOriginChatResponse: postOriginChatResponseDto,
})

export default chatModel
