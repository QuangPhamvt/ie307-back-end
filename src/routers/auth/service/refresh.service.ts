import { like } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { users } from "src/database"
import { accessToken, refreshToken } from "src/utilities"

type refreshDto = {
  headers: Headers
  set: SetElysia
  body: {
    refresh: string
  }
  JWT_ACCESS_TOKEN: any
  JWT_REFRESH_TOKEN: any
}
export const refresh = async <T extends refreshDto>(props: T) => {
  const { headers, body, set, JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN } = props
  try {
    const user = await JWT_REFRESH_TOKEN.verify(body.refresh)
    if (!user || !user.id || !user.username) {
      set.status = 401
      return {
        message: "Unauthorized",
        data: [],
      }
    }
    const [isMatch] = await db.select().from(users).where(like(users.id, user.id))
    if (!isMatch) {
      set.status = 401
      return {
        message: "Unauthorized",
        data: [],
      }
    }

    const at = await accessToken(JWT_ACCESS_TOKEN, { id: user.id, username: user.username })
    const rt = await refreshToken(JWT_REFRESH_TOKEN, { id: user.id, username: user.username })
    return {
      message: "Oke",
      data: [
        {
          access_token: at,
          refresh_token: rt,
        },
      ],
    }
  } catch (error) {
    set.status = "Internal Server Error"
    return {
      message: "Internal Server Error",
      data: [],
    }
  }
}
