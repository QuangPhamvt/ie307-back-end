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
  const id = headers.get("userId") || ""
  try {
    const blob = await fetch(avatar).then((res) => res.blob())
    await uploadObject(`ie307/users/${id}/avatar.webp`, blob, "image/webp")
    const urlS3ToStorage = `ie307/users/${id}/avatar.webp`
    await db.update(users).set({ avatar: urlS3ToStorage }).where(like(users.id, id))
    set.status = "Created"
    return {
      message: "Created",
      data: [],
    }
  } catch (error) {
    set.status = "Internal Server Error"
    return {
      message: "Internal Server Error",
      data: [],
    }
  }
}
