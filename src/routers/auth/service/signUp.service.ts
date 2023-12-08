import { s3ObjectUrl } from "aws/s3"
import { like } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { profiles, users } from "src/database"
import { accessToken, existUser, insertUser, refreshToken } from "src/utilities"
import generateUsername from "src/utilities/genUsername"
import { v4 as uuidv4 } from "uuid"

type signUpDto = {
  headers: Headers
  body: {
    email: string
    password: string
    code_digit: string
  }
  set: SetElysia
  JWT_ACCESS_TOKEN: any
  JWT_REFRESH_TOKEN: any
}
export const signUp = async <T extends signUpDto>(props: T) => {
  const {
    headers,
    body: { email, password, code_digit },
    set,
    JWT_ACCESS_TOKEN,
    JWT_REFRESH_TOKEN,
  } = props
  try {
    const id = uuidv4()
    const [user] = await db.select().from(users).where(like(users.email, email))
    if (!user) {
      set.status = "Bad Request"
      return {
        message: "Email is not have in system, please verify!",
        data: [],
      }
    }
    if (user.code_digit !== code_digit) {
      set.status = "Bad Request"
      return {
        message: "Code digit is wrong, please check again",
        data: [],
      }
    }

    let username = email.split("@")
    const Username = await generateUsername(username[0])
    const hashPassword = await Bun.password.hash(password)
    await db.update(users).set({ is_active: true, password: hashPassword }).where(like(users.email, email))
    await db.insert(profiles).values({ id, user_id: user.id, username: Username, gender: "Can not say" })

    const avatar = user.avatar ? s3ObjectUrl(user.avatar) : null
    const at = await accessToken(JWT_ACCESS_TOKEN, { id: user.id, email, username: Username, avatar })
    const rt = await refreshToken(JWT_REFRESH_TOKEN, { id: user.id, email, username: Username, avatar })
    return {
      message: "Created",
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
      message: set.status,
      data: [],
    }
  }
}
