import Elysia, { t } from "elysia"

const postCommentBodyDto = t.Object({
  post_id: t.String({ format: "uuid" }),
  comment: t.String(),
})
const postCommentResponseDto = t.Object({
  message: t.String(),
  data: t.Array(t.Object({})),
})
const getCommentOriginBodyDto = t.Object({
  post_id: t.String({ format: "uuid" }),
})
const getCommentOriginResponseDto = t.Object({
  message: t.String(),
  data: t.Array(
    t.Object({
      comment: t.Object({
        id: t.String({ format: "uuid" }),
        context: t.Union([t.String(), t.Null()]),
        create_at: t.Union([t.Date(), t.Null()]),
      }),
      author: t.Object({
        id: t.String({ format: "uuid" }),
        username: t.Union([t.String(), t.Null()]),
        avatar: t.Union([t.String(), t.Null()]),
      }),
    }),
  ),
})
const commentModel = new Elysia().model({
  postCommentBody: postCommentBodyDto,
  postCommentResponse: postCommentResponseDto,

  getCommentOriginBody: getCommentOriginBodyDto,
  getCommentOriginResponse: getCommentOriginResponseDto,
})
export default commentModel
