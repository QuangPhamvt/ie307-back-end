import Elysia, { t } from "elysia"
import { imageMock } from "src/utilities"

const postListBodyDto = t.Object({
  limit: t.String(),
  offset: t.String(),
})
const postListResponseDto = t.Object({
  message: t.String(),
  data: t.Array(
    t.Object({
      id: t.String(),
      images: t.Array(t.String()),
    }),
  ),
})

const searchBodyDto = t.Object({
  search: t.String(),
})
const searchResponseDto = t.Object({
  message: t.String(),
  data: t.Array(
    t.Object({
      author: t.Object({
        author_id: t.String(),
        avatar: t.Union([t.String(), t.Null()]),
        username: t.String(),
      }),
      post_id: t.String(),
      image: t.String(),
      slug: t.String(),
      published: t.Number(),
      createAt: t.Date(),
    }),
  ),
})

const originPostBodyDto = t.Object({
  post_id: t.String(),
})
const originPostResponseDto = t.Object({
  message: t.String(),
  data: t.Array(
    t.Object({
      originPost: t.Object({
        post_id: t.String(),
        title: t.String(),
        image: t.String(),
        author: t.Object({
          author_id: t.String(),
          username: t.String(),
          avatar: t.Union([t.String(), t.Null()]),
        }),
      }),
    }),
  ),
})

const uploadPostBodyDto = t.Object({
  title: t.String({ default: "Hello minnasan" }),
  images: t.Array(t.String({ contentEncoding: "base64" })),
})
const uploadPostResponseDto = t.Object({
  message: t.String(),
  data: t.Array(t.Object({})),
})

const postModel = new Elysia().model({
  postListBody: postListBodyDto,
  postListResponse: postListResponseDto,

  searchBody: searchBodyDto,
  searchResponseDto: searchResponseDto,

  originPostBody: originPostBodyDto,
  originPostResponse: originPostResponseDto,

  uploadPostBody: uploadPostBodyDto,
  uploadPostResponse: uploadPostResponseDto,
})
export default postModel
