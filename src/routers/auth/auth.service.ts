import { eq, like, or } from "drizzle-orm"
import Elysia from "elysia"
import { StatusMap } from "elysia/dist/utils"
import { SetElysia } from "src/config"
import db, { users } from "src/database"
import { getObject, s3ObjectUrl, uploadObject } from "aws/s3"
import { notifications } from "src/database/schema/notifications"

type NewUser = typeof users.$inferInsert
const insertUser = async (newUser: NewUser) => {
  return await db.insert(users).values(newUser)
}
const existUser = async (email: string, username: string) => {
  const [isExist] = await db
    .select()
    .from(users)
    .where(or(like(users.email, email), like(users.username, username)))
  return !!isExist
}
const accessToken = async (JWT_ACCESS_TOKEN: any, payload: Object) => {
  return await JWT_ACCESS_TOKEN.sign(payload)
}
const refreshToken = async (JWT_REFRESH_TOKEN: any, payload: Object) => {
  return await JWT_REFRESH_TOKEN.sign(payload)
}

const authService = {
  signIn: async <TBody extends { email: string; password: string }>(
    body: TBody,
    set: SetElysia,
    JWT_ACCESS_TOKEN: any,
    JWT_REFRESH_TOKEN: any,
  ) => {
    const { email, password } = body
    const isExistUser = await existUser(email, "")
    if (!isExistUser) {
      set.status = 400
      return {
        message: "Email or password wrong!",
      }
    }
    const [user] = await db.select().from(users).where(like(users.email, email))
    const isMatch = await Bun.password.verify(password, user.password)
    if (!isMatch) {
      set.status = 400
      return {
        message: "Username or password wrong!",
      }
    }
    set.status = 200
    const at = await accessToken(JWT_ACCESS_TOKEN, { id: user.id, username: user.username })
    const rt = await refreshToken(JWT_REFRESH_TOKEN, { id: user.id, username: user.username })
    return {
      message: "Ok",
      accessToken: at,
      refreshToken: rt,
    }
  },
  signUp: async <TBody extends { email: string; username: string; password: string }>(
    body: TBody,
    set: SetElysia,
    JWT_ACCESS_TOKEN: any,
    JWT_REFRESH_TOKEN: any,
  ) => {
    const { email, username, password } = body
    const passwordHash = await Bun.password.hash(password)
    const isExistUser = await existUser(email, username)
    if (isExistUser) {
      set.status = 400
      return {
        message: "Username exist!",
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
      accessToken: at,
      refreshToken: rt,
    }
  },
  refresh: async <TBody extends { refresh: string }>(
    body: TBody,
    set: SetElysia,
    request: Request,
    JWT_ACCESS_TOKEN: any,
    JWT_REFRESH_TOKEN: any,
  ) => {
    const user = await JWT_REFRESH_TOKEN.verify(body.refresh)
    if (!user || !user.id || !user.username) {
      set.status = 401
      return {
        message: "Unauthorized",
      }
    }
    const [isMatch] = await db.select().from(users).where(like(users.id, user.id))
    if (!isMatch) {
      set.status = 401
      return {
        message: "Unauthorized",
      }
    }

    const at = await accessToken(JWT_ACCESS_TOKEN, { id: user.id, username: user.username })
    const rt = await refreshToken(JWT_REFRESH_TOKEN, { id: user.id, username: user.username })
    return {
      message: "Created",
      accessToken: at,
      refreshToken: rt,
    }
  },
  profile: async (headers: Headers, set: SetElysia) => {
    const userId = headers.get("userId") || ""
    try {
      const [user] = await db.select().from(users).where(like(users.id, userId))
      const url = user.avatar && s3ObjectUrl(user.avatar)
      return {
        id: user.id,
        username: user.username,
        avatar: url,
      }
    } catch (error) {
      console.log("🚀 ~ file: auth.service.ts:116 ~ profile: ~ error:", error)
    }
  },
  upload: async <TBody extends { username?: string; password?: string; avatar?: Blob }>(
    headers: Headers,
    body: TBody,
    set: SetElysia,
  ) => {
    const { username, password, avatar } = body
    let newUser = {}
    // Username
    if (username) {
      const isExist = await existUser("", username)
      if (isExist) {
        set.status = 400
        return {
          message: "Username exist!",
        }
      }
      newUser = { ...newUser, username }
    }
    if (password) newUser = { ...newUser, password: await Bun.password.hash(password) }
    if (avatar) {
      const blob = new Blob([avatar], { type: "image" })
      await uploadObject(`ie307/users/${headers.get("userId")}/avatar.webp`, blob, "image/webp")
      newUser = { ...newUser, avatar: `ie307/users/${headers.get("userId")}/avatar.webp` }
    }

    if (username || password || avatar) {
      await db
        .update(users)
        .set(newUser)
        .where(like(users.id, headers.get("userId") || ""))
    }
    set.status = 201
    return {
      message: "Created",
    }
  },
}
export default authService
