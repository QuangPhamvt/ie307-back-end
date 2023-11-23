import Elysia, { t } from "elysia"

const getFollowingResponseDto = t.Object({
  message: t.String(),
  data: t.Array(
    t.Object({
      following_id: t.String(),
      username: t.String(),
    }),
  ),
})

const followingBodyDto = t.Object({
  following_id: t.String(),
})
const followingResponseDto = t.Object({
  message: t.String(),
})

const unFollowingBodyDto = t.Object({
  following_id: t.String(),
})
const unFollowingResponseDto = t.Object({
  message: t.String(),
})

export const followModel = new Elysia().model({
  getFollowingResponse: getFollowingResponseDto,

  followingBody: followingBodyDto,
  followingResponse: followingResponseDto,

  unFollowingBody: unFollowingBodyDto,
  unFollowingResponse: unFollowingResponseDto,
})
