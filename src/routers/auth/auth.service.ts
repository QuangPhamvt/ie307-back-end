import { like } from "drizzle-orm"
import Elysia from "elysia"
import { StatusMap } from "elysia/dist/utils"
import { SetElysia } from "src/config"
import db, { users } from "src/database"

type NewUser = typeof users.$inferInsert
const insertUser = async (newUser: NewUser) => {
  return await db.insert(users).values(newUser)
}
const existUser = async (username: string) => {
  const [isExist] = await db.select().from(users).where(like(users.username, username))
  return !!isExist
}
const accessToken = async (JWT_ACCESS_TOKEN: any, payload: Object) => {
  return await JWT_ACCESS_TOKEN.sign(payload)
}
const refreshToken = async (JWT_REFRESH_TOKEN: any, payload: Object) => {
  return await JWT_REFRESH_TOKEN.sign(payload)
}

const authService = {
  signIn: async <TBody extends { username: string; password: string }>(
    body: TBody,
    set: SetElysia,
    JWT_ACCESS_TOKEN: any,
    JWT_REFRESH_TOKEN: any,
  ) => {
    const { username, password } = body
    const isExistUser = await existUser(username)
    if (!isExistUser) {
      set.status = 400
      return {
        message: "Username or password wrong!",
      }
    }
    const [user] = await db.select().from(users).where(like(users.username, username))
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
  signUp: async <TBody extends { username: string; password: string }>(
    body: TBody,
    set: SetElysia,
    JWT_ACCESS_TOKEN: any,
    JWT_REFRESH_TOKEN: any,
  ) => {
    const { username, password } = body
    const passwordHash = await Bun.password.hash(password)
    const isExistUser = await existUser(username)
    if (isExistUser) {
      set.status = 400
      return {
        message: "Username exist!",
      }
    }
    await insertUser({ username, password: passwordHash })
    const [user] = await db.select().from(users).where(like(users.username, username))
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
}
export default authService
