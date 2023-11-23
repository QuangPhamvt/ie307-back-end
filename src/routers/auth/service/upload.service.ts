import { uploadObject } from "aws/s3"
import { like } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { users } from "src/database"

type uploadDto = {
  headers: Headers
  body: {
    avatar: string
  }
  set: SetElysia
}
export const upload = async <T extends uploadDto>(props: T) => {
  const { headers, body, set } = props
  const { avatar } = body
  try {
    const blob = await fetch(avatar).then((res) => res.blob())
    await uploadObject(`ie307/users/${headers.get("userId")}/avatar.webp`, blob, "image/webp")
    const url = `ie307/users/${headers.get("userId")}/avatar.webp`
    await db
      .update(users)
      .set({ avatar: url })
      .where(like(users.id, headers.get("userId") || ""))
    set.status = "Created"
    return {
      message: "Created",
    }
  } catch (error) {
    set.status = "Internal Server Error"
    return {
      message: "Internal Server Error",
    }
  }
}
