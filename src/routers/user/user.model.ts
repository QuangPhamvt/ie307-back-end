import Elysia, { t } from "elysia"

const postOriginUserBodyDto = t.Object({
  user_id: t.String(),
})
const postOriginUserResponseDto = t.Object({
  message: t.String(),
  data: t.Array(
    t.Object({
      user: t.Object({
        user_id: t.String(),
        username: t.String(),
        avatar: t.Union([t.String(), t.Null()]),
      }),
      isFollowing: t.Boolean(),
      postList: t.Array(
        t.Object({
          post_id: t.String(),
          image: t.String(),
        }),
      ),
    }),
  ),
})

const userModel = new Elysia().model({
  postOriginUserBody: postOriginUserBodyDto,
  postOriginUserResponse: postOriginUserResponseDto,
})

export default userModel
