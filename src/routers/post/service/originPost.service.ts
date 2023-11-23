import { s3ObjectUrl } from "aws/s3"
import { like } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { posts, users } from "src/database"

type originPostDto = {
  headers: Headers
  body: {
    post_id: string
  }
  set: SetElysia
}
export const originPost = async <T extends originPostDto>(props: T) => {
  const { headers, body, set } = props
  const { post_id } = body
  try {
    const [data] = await db
      .select({
        post_id: posts.id,
        title: posts.title,
        image: posts.image,
        author: {
          author_id: users.id,
          username: users.username,
          avatar: users.avatar,
        },
      })

      .from(posts)
      .where(like(posts.id, post_id))
      .innerJoin(users, like(posts.authorId, users.id))

    const {
      author: { avatar },
    } = data
    return {
      message: "Oke",
      data: [
        {
          originPost: {
            ...data,
            image: data.image && s3ObjectUrl(data.image),
            author: {
              ...data.author,
              avatar,
            },
          },
        },
      ],
    }
  } catch (error) {
    set.status = "Internal Server Error"
    return {
      message: "Internal Server Error",
      data: [],
    }
  }
}
