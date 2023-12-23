import Elysia, { t } from "elysia"

const getUserDetailBodyDto = t.Object({
  user_id: t.String(),
})
const getUserDetailResponseDto = t.Object({
  message: t.String(),
  data: t.Array(
    t.Object({
      user: t.Object({
        user_id: t.String(),
        avatar: t.Union([t.String(), t.Null()]),
        email: t.Union([t.String(), t.Null()]),
        username: t.Union([t.String(), t.Null()]),
        bio: t.Union([t.String(), t.Null()]),
        follows: t.Union([t.Number(), t.Null()]),
        following: t.Union([t.Number(), t.Null()]),
      }),
      posts: t.Array(
        t.Object({
          post_id: t.String(),
          images: t.Array(t.String()),
          create_at: t.Date(),
        }),
      ),
    }),
  ),
})
const getMeResponseDto = t.Object({
  message: t.String(),
  data: t.Array(
    t.Object({
      user: t.Object({
        user_id: t.String(),
        avatar: t.Union([t.String(), t.Null()]),
        email: t.Union([t.String(), t.Null()]),
        username: t.Union([t.String(), t.Null()]),
        bio: t.Union([t.String(), t.Null()]),
        post_loves: t.Array(t.String()),
        follows: t.Union([
          t.Object({
            follows: t.Union([t.Number(), t.Null()]),
            following: t.Union([t.Number(), t.Null()]),
            following_id: t.Union([t.String(), t.Null()]),
          }),
          t.Null(),
        ]),
      }),
      posts: t.Array(
        t.Object({
          post_id: t.String(),
          images: t.Array(t.String()),
          create_at: t.Date(),
        }),
      ),
    }),
  ),
})
const uploadFollowBodyDto = t.Object({
  unFollow: t.Nullable(t.String()),
  follow: t.Nullable(t.String()),
})
const uploadFollowResponseDto = t.Object({
  message: t.String(),
  data: t.Array(t.Any()),
})
const uploadProfileBodyDto = t.Object({
  name: t.Nullable(t.String()),
  username: t.Nullable(t.String()),
  bio: t.Nullable(t.String()),
  gender: t.Union([t.Literal("male"), t.Literal("female"), t.Literal("Can not say"), t.Null()]),
})
const uploadProfileResponseDto = t.Object({
  message: t.String(),
  data: t.Array(t.Any()),
})
const postLoveBodyDto = t.Object({
  post_id: t.String(),
})
const postLoveResponseDto = t.Object({
  message: t.String(),
  data: t.Array(t.Object({})),
})

const userModel = new Elysia().model({
  getUserDetailBody: getUserDetailBodyDto,
  getUserDetailResponse: getUserDetailResponseDto,
  getMeResponse: getMeResponseDto,
  uploadFollowBody: uploadFollowBodyDto,
  uploadFollowResponse: uploadFollowResponseDto,
  uploadProfileBody: uploadProfileBodyDto,
  uploadProfileResponse: uploadProfileResponseDto,
  postLoveBody: postLoveBodyDto,
  postLoveResponse: postLoveResponseDto,
})

export default userModel
