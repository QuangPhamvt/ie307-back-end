import { like } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { posts, profiles } from "src/database"
import { removeItem } from "src/utilities"

type TPostLove = {
  headers: Headers
  body: {
    post_id: string
  }
  set: SetElysia
}
export const postLove = async (props: TPostLove) => {
  const { headers, body, set } = props
  const user_id = headers.get("userId") || ""
  const { post_id } = body
  try {
    const [user] = await db.select().from(profiles).where(like(profiles.user_id, user_id))
    const post_loves: Array<string> = JSON.parse(user.post_loves || `[]`)
    const [post] = await db.select().from(posts).where(like(posts.id, post_id))
    if (!!post_loves.find((item) => item === post_id)) {
      const newPostLoves = removeItem(post_loves, post_id)
      await db
        .update(profiles)
        .set({ post_loves: JSON.stringify(newPostLoves) })
        .where(like(profiles.user_id, user_id))
      await db
        .update(posts)
        .set({ loves: (post.loves || 0) - 1 })
        .where(like(posts.id, post_id))
    } else {
      const newPostLoves = [...post_loves, post_id]
      await db
        .update(profiles)
        .set({ post_loves: JSON.stringify(newPostLoves) })
        .where(like(profiles.user_id, user_id))
      await db
        .update(posts)
        .set({ loves: (post.loves || 0) + 1 })
        .where(like(posts.id, post_id))
    }
    set.status = "Created"
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
