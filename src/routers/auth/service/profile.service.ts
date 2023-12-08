import { s3ObjectUrl } from "aws/s3"
import { like } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { profiles, users } from "src/database"

type profileDto = {
  headers: Headers
  set: SetElysia
}
export const profile = async <T extends profileDto>(props: T) => {
  const { headers, set } = props
  const userId = headers.get("userId") || ""
  try {
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        username: profiles.username,
        avatar: users.avatar,
        name: profiles.name,
        pronouns: profiles.pronouns,
        bio: profiles.bio,
        gender: profiles.gender,
      })
      .from(users)
      .innerJoin(profiles, like(profiles.user_id, users.id))
      .where(like(users.id, userId))
    const url = user.avatar && s3ObjectUrl(user.avatar)
    return {
      message: "Oke",
      data: [
        {
          id: user.id,
          email: user.email,
          username: user.username,
          avatar: url,
          name: user.name,
          pronouns: user.pronouns,
          bio: user.bio,
          gender: user.gender,
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
