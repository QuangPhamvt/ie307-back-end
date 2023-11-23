import { like } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { notifications, users } from "src/database"
import { accessToken, existUser, insertUser, refreshToken } from "src/utilities"

type signUpDto = {
  headers: Headers
  body: {
    email: string
    username: string
    password: string
  }
  set: SetElysia
  JWT_ACCESS_TOKEN: any
  JWT_REFRESH_TOKEN: any
}
export const signUp = async <T extends signUpDto>(props: T) => {
  const { headers, body, set, JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN } = props
  const { email, username, password } = body
  try {
    const passwordHash = await Bun.password.hash(password)
    const isExistUser = await existUser(email, username)
    if (isExistUser) {
      set.status = 400
      return {
        message: "Username exist!",
        data: [],
      }
    }
    await insertUser({ email, username, password: passwordHash })
    const [user] = await db.select().from(users).where(like(users.username, username))
    await db.insert(notifications).values({ user_id: user.id })
    const at = await accessToken(JWT_ACCESS_TOKEN, { id: user.id, username: user.username })
    const rt = await refreshToken(JWT_REFRESH_TOKEN, { id: user.id, username: user.username })
    set.status = 200
    return {
      message: "Created new account",
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
