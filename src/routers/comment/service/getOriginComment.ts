import { s3ObjectUrl } from "aws/s3"
import { desc, like } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { comments, profiles, users } from "src/database"

type TGetOriginComment = {
  headers: Headers
  body: {
    post_id: string
  }
  set: SetElysia
}
export const getOriginComment = async (props: TGetOriginComment) => {
  const { body, headers, set } = props
  const user_id = headers.get("user_id") || ""
  const { post_id } = body
  try {
    const comment = await db
      .select({
        comment: {
          id: comments.id,
          context: comments.context,
          create_at: comments.create_at,
        },
        author: {
          id: users.id,
          username: profiles.username,
          avatar: users.avatar,
        },
      })
      .from(comments)
      .where(like(comments.post_id, post_id))
      .innerJoin(users, like(comments.author_id, users.id))
      .innerJoin(profiles, like(users.id, profiles.user_id))
      .orderBy(desc(comments.create_at))
    return {
      message: "Oke",
      data: comment.map((item) => {
        if (item.author.avatar)
          return {
            ...item,
            author: {
              ...item.author,
              avatar: s3ObjectUrl(item.author.avatar),
            },
          }
        return item
      }),
    }
  } catch (error) {
    console.log(error)
    set.status = "Internal Server Error"
    return {
      message: "Internal Server Error",
      data: [],
    }
  }
}
