import { SetElysia } from "src/config"
import db, { follow } from "src/database"

export const followService = {
  follow: async <TBody extends { following_id: string }>(body: TBody, headers: Headers, set: SetElysia) => {
    try {
      const userId = headers.get("userId")
      const newFollow = {
        follower_id: body.following_id,
        following_id: userId,
      }
      await db.insert(follow).values(newFollow)
      set.status = 201
      return {
        message: "Created",
      }
    } catch (error) {
      console.log(error)
    }
  },
  unFollow: () => {},
}
