import { eq, like, or } from "drizzle-orm"
import Elysia from "elysia"
import { StatusMap } from "elysia/dist/utils"
import { SetElysia } from "src/config"
import db, { users } from "src/database"
import { getObject, s3ObjectUrl, uploadObject } from "aws/s3"

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
  upload: async <TBody extends { username?: string; password?: string; avatar?: string }>(
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
      const blob = await fetch(avatar).then((res) => res.blob())
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
