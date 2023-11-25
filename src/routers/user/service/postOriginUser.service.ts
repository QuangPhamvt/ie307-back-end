import { s3ObjectUrl } from "aws/s3"
import { and, like } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { follow, posts, users } from "src/database"

type TPostOriginUser = {
  headers: Headers
  body: {
    user_id: string
  }
  set: SetElysia
}
export const postOriginUser = async <T extends TPostOriginUser>(props: T) => {
  const { headers, set, body } = props
  const authId = headers.get("userId") || ""
  const { user_id } = body
  try {
    const [user] = await db
      .select({
        user_id: users.id,
        username: users.username,
        avatar: users.avatar,
      })
      .from(users)
      .where(like(users.id, user_id))
    if (!user) {
      set.status = "Bad Request"
      return {
        message: "Bad Request",
        data: [],
      }
    }

    const Follow = await db
      .select()
      .from(follow)
      .where(and(like(follow.follower_id, authId), like(follow.following_id, user_id)))

    const postList = await db
      .select({
        post_id: posts.id,
        image: posts.image,
      })
      .from(posts)
      .where(like(posts.authorId, user_id))

    const avatar = user.avatar ? s3ObjectUrl(user.avatar) : null
    const newPostList = postList.map((item) => {
      const image = s3ObjectUrl(item.image)
      return {
        ...item,
        image,
      }
    })

    const data = [
      {
        user: {
          user_id,
          username: user.username,
          avatar,
        },
        isFollowing: !!Follow.length,
        postList: [...newPostList],
      },
    ]
    return {
      message: "Oke",
      data,
    }
  } catch (error) {
    set.status = "Internal Server Error"
    return {
      message: "Internal Server Error",
      data: [],
    }
  }
}
