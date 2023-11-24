import { s3ObjectUrl } from "aws/s3"
import { like } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { users } from "src/database"
import { accessToken, existUser, refreshToken } from "src/utilities"

type signInDto = {
  set: SetElysia
  headers: Headers
  body: {
    email: string
    password: string
  }
  JWT_ACCESS_TOKEN: any
  JWT_REFRESH_TOKEN: any
}
export const signIn = async <T extends signInDto>(props: T) => {
  const { headers, body, set, JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN } = props
  const { email, password } = body
  try {
    const isExistUser = await existUser(email, "")
    if (!isExistUser) {
      set.status = 400
      return {
        message: "Email or password wrong!",
        data: [],
      }
    }
    const [user] = await db.select().from(users).where(like(users.email, email))
    const isMatch = await Bun.password.verify(password, user.password)
    if (!isMatch) {
      set.status = 400
      return {
        message: "Username or password wrong!",
        data: [],
      }
    }
    set.status = 200
    const avatar = user.avatar ? s3ObjectUrl(user.avatar) : null
    const at = await accessToken(JWT_ACCESS_TOKEN, { id: user.id, username: user.username, avatar })
    const rt = await refreshToken(JWT_REFRESH_TOKEN, { id: user.id, username: user.username, avatar })
    return {
      message: "Ok",
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
