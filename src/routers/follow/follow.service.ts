import { and, like } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { follow, users } from "src/database"

export const followService = {
  getFollowing: async (headers: Headers, set: SetElysia) => {
    const following = await db
      .select({
        following_id: users.id,
        following_username: users.username,
      })
      .from(follow)
      .innerJoin(users, and(like(follow.follower_id, headers.get("userId") || ""), like(follow.following_id, users.id)))
    return {
      message: "Ok",
      data: following,
    }
  },
  follow: async <TBody extends { following_id: string }>(body: TBody, headers: Headers, set: SetElysia) => {
    try {
      const userId = headers.get("userId")
      if (userId === body.following_id) {
        set.status === 400
        return {
          message: "Bad request",
        }
      }
      const newFollow = {
        follower_id: userId,
        following_id: body.following_id,
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
  unFollow: async <TBody extends { following_id: string }>(body: TBody, headers: Headers, set: SetElysia) => {
    try {
      await db
        .delete(follow)
        .where(and(like(follow.follower_id, headers.get("userId") || ""), like(follow.following_id, body.following_id)))
      set.status = 205
      return {
        message: "Delete success",
      }
    } catch (error) {
      console.log(error)
      set.status = 400
      return {
        message: "Bad request",
      }
    }
  },
}
