import { like } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { profiles } from "src/database"

type TUploadProfile = {
  headers: Headers
  set: SetElysia
  body: {
    name: string | null
    username: string | null
    gender: "male" | "female" | "Can not say" | null
    bio: string | null
  }
}
export const uploadProfile = async (props: TUploadProfile) => {
  const { headers, set, body } = props
  const user_id = headers.get("userId") || ""
  const { username, gender, bio, name } = body
  try {
    if (username) {
      const [user] = await db.select().from(profiles).where(like(profiles.username, username))
      if (user) {
        set.status = "Bad Request"
        return {
          message: "Have Exist Username",
          data: [],
        }
      }
      await db.update(profiles).set({ username }).where(like(profiles.user_id, user_id))
    }
    if (gender) await db.update(profiles).set({ gender }).where(like(profiles.user_id, user_id))
    if (bio) await db.update(profiles).set({ bio }).where(like(profiles.user_id, user_id))
    if (name) await db.update(profiles).set({ name }).where(like(profiles.user_id, user_id))
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
