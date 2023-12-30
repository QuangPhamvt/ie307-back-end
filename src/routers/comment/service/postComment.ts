import { like } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { comments, posts } from "src/database"

type TPostComment = {
  headers: Headers
  body: {
    post_id: string
    comment: string
  }
  set: SetElysia
}
export const postComment = async (props: TPostComment) => {
  const { headers, body, set } = props
  const user_id = headers.get("userId") || ""
  const { post_id, comment } = body
  try {
    if (!post_id || !comment) {
      set.status = "Bad Request"
      return {
        message: "Bad Request",
        data: [],
      }
    }
    await db.insert(comments).values({ post_id, context: comment, author_id: user_id })
    const post = (await db.select().from(posts).where(like(posts.id, post_id)))[0].comments || 0
    await db.update(posts).set({ comments: +post + 1 })
    return {
      message: "Created",
      data: [],
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
