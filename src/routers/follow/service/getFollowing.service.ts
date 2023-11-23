import { and, like } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { follow, users } from "src/database"

type getFollowingDto = {
  headers: Headers
  set: SetElysia
}
export const getFollowing = async <T extends getFollowingDto>(props: T) => {
  const { headers, set } = props
  const userId = headers.get("userId") || ""
  try {
    const following = await db
      .select({
        following_id: users.id,
        username: users.username,
      })
      .from(follow)
      .innerJoin(users, like(follow.following_id, users.id))
      .where(like(follow.follower_id, userId))
    return {
      message: "Ok",
      data: following,
    }
  } catch (error) {
    set.status = "Internal Server Error"
    return {
      message: "Internal Server Error",
      data: [],
    }
  }
}
