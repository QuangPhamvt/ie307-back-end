import { and, like } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { follow } from "src/database"

type unFollowDto = {
  headers: Headers
  body: {
    following_id: string
  }
  set: SetElysia
}
export const unFollowUser = async <T extends unFollowDto>(props: T) => {
  const { headers, body, set } = props
  const userId = headers.get("userId") || ""
  const { following_id } = body
  try {
    await db.delete(follow).where(and(like(follow.follower_id, userId), like(follow.following_id, following_id)))
    set.status = 205
    return {
      message: "Delete success",
    }
  } catch (error) {
    set.status = "Internal Server Error"
    return {
      message: "Internal Server Error",
    }
  }
}
