import { like } from "drizzle-orm"
import { float } from "drizzle-orm/mysql-core"
import { SetElysia } from "src/config"
import db, { follows } from "src/database"

type TUploadFollow = {
  headers: Headers
  set: SetElysia
  body: {
    follow: string | null
    unFollow: string | null
  }
}
export const uploadFollow = async (props: TUploadFollow) => {
  const { headers, set, body } = props
  const user_id = headers.get("userId") || ""
  const { follow: Follow, unFollow: UnFollow } = body
  try {
    const [follow] = await db.select().from(follows).where(like(follows.id, user_id))
    if (Follow) {
      if (!follow) {
        await db
          .insert(follows)
          .values({ id: user_id, following_id: JSON.stringify([Follow]), follows: 0, following: 1 })
      } else if (follow.following !== null && follow.following_id !== null) {
        console.log("Follow")

        const following_id: Array<string> = JSON.parse(follow.following_id)
        await db
          .update(follows)
          .set({
            following: follow.following + 1,
            following_id: JSON.stringify([...following_id, Follow]),
          })
          .where(like(follows.id, user_id))
      }
      const [another_user] = await db.select().from(follows).where(like(follows.id, Follow))
      if (!another_user)
        await db.insert(follows).values({ id: Follow, follows: 1, following_id: JSON.stringify([]), following: 0 })
      if (another_user && another_user.follows) {
        await db.update(follows).set({ follows: another_user.follows + 1 })
      }
    }

    if (UnFollow) {
      if (follow.following !== null && follow.following_id !== null) {
        const following_id: Array<string> = JSON.parse(follow.following_id)
        console.log(follow.following_id)
        console.log(following_id.filter((item) => item !== Follow))

        await db
          .update(follows)
          .set({
            following: follow.following - 1,
            following_id: JSON.stringify(following_id.filter((item) => item !== UnFollow)),
          })
          .where(like(follows.id, user_id))
        const [another_user] = await db.select().from(follows).where(like(follows.id, UnFollow))
        if (another_user && another_user.follows) {
          await db.update(follows).set({ follows: another_user.follows - 1 })
        }
      }
    }
    set.status = "Created"
    return {
      message: "Created",
      data: [],
    }
  } catch (error) {
    set.status = "Internal Server Error"
    return {
      message: "Internal Server Error",
      data: [],
    }
  }
}
