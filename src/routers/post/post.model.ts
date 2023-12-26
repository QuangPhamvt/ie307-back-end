import Elysia, { t } from "elysia"

const postListBodyDto = t.Object({
  limit: t.String(),
  offset: t.String(),
})
const postListResponseDto = t.Object({
  message: t.String(),
  data: t.Array(
    t.Object({
      id: t.String({ format: "uuid" }),
      images: t.Array(t.String({})),
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
        author_id: t.String({ format: "uuid" }),
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
      id: t.String(),
      title: t.String(),
      images: t.Any(),
      loves: t.Union([t.Number(), t.Null()]),
      comments: t.Union([t.Number(), t.Null()]),
      create_at: t.Date(),
      author_id: t.String(),
      avatar: t.Union([t.String(), t.Null()]),
      email: t.Union([t.String(), t.Null()]),
      comment: t.Union([
        t.Object({
          author_id: t.String(),
          avatar: t.Union([t.String(), t.Null()]),
          email: t.Union([t.String(), t.Null()]),
          context: t.Union([t.String(), t.Null()]),
          loves: t.Union([t.Number(), t.Null()]),
          create_at: t.Union([t.Date(), t.Null()]),
        }),
        t.Null(),
      ]),
      stories: t.Array(
        t.Object({
          id: t.String({ format: "uuid" }),
          image: t.Union([t.String(), t.Null()]),
          create_at: t.Date(),
        }),
      ),
    }),
  ),
})
const postListMainBodyDto = t.Object({
  user_id: t.Array(t.String()),
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

  postListMainBody: postListMainBodyDto,
})
export default postModel
