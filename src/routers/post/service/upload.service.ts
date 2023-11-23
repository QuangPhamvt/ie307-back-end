import { uploadObject } from "aws/s3"
import { desc, like } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { posts, users } from "src/database"
import { toSlug } from "src/utilities"
import { v4 as uuidv4 } from "uuid"

type uploadDto = {
  headers: Headers
  body: {
    title: string
    image: string
  }
  set: SetElysia
}
export const upload = async <T extends uploadDto>(props: T) => {
  const { headers, body, set } = props
  const userId = headers.get("userId") || ""
  const { title, image } = body
  if (!title || !image) {
    set && (set.status = 400)
    return {
      message: "Bad request",
      data: [],
    }
  }
  try {
    const [user] = await db.select().from(users).where(like(users.id, userId))
    const postId: string = uuidv4()
    const url = `ie307/users/${user.id}/posts/${postId}.webp`
    const newPost = {
      id: postId,
      authorId: user.id,
      image: url,
      title,
      slug: toSlug(title),
      published: 1,
    }
    await db.insert(posts).values(newPost)
    const blob = await fetch(image).then((res) => res.blob())
    await uploadObject(url, blob, "image/webp")
    set && (set.status = 201)
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
