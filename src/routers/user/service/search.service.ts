import { s3ObjectUrl } from "aws/s3"
import { like } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { profiles, users } from "src/database"

type TSearchUsername = {
  headers: Headers
  set: SetElysia
  body: {
    username: string
  }
}
export const searchUsername = async (props: TSearchUsername) => {
  const { headers, set, body } = props
  const { username } = body
  try {
    const listUser = await db
      .select({
        id: users.id,
        avatar: users.avatar,
        username: profiles.username,
        bio: profiles.bio,
      })
      .from(users)
      .innerJoin(profiles, like(users.id, profiles.user_id))
      .where(like(profiles.username, `%${username}%`))
    const ListUser = listUser.map((user) => ({
      ...user,
      avatar: user.avatar ? s3ObjectUrl(user.avatar) : null,
    }))
    return {
      message: "Oke",
      data: ListUser,
    }
  } catch (error) {
    set.status = "Internal Server Error"
    return {
      message: "Internal Server Error",
      data: [],
    }
  }
}
