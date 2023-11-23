import { s3ObjectUrl } from "aws/s3"
import { like } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { users } from "src/database"

type profileDto = {
  headers: Headers
  set: SetElysia
}
export const profile = async <T extends profileDto>(props: T) => {
  const { headers, set } = props
  const userId = headers.get("userId") || ""
  try {
    const [user] = await db.select().from(users).where(like(users.id, userId))
    const url = user.avatar && s3ObjectUrl(user.avatar)
    return {
      message: "Oke",
      data: [
        {
          id: user.id,
          username: user.username,
          avatar: url,
        },
      ],
    }
  } catch (error) {
    set.status = "Internal Server Error"
    return {
      message: "Oke",
      data: [],
    }
  }
}
