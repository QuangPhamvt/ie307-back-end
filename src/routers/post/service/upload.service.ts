import { uploadObject } from "aws/s3"
import { desc, like } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { posts, users } from "src/database"
import { loves } from "src/database/schema/loves"
import { toSlug } from "src/utilities"
import { v4 as uuidv4 } from "uuid"

type uploadDto = {
  headers: Headers
  body: {
    title: string
    images: string[]
  }
  set: SetElysia
}
export const upload = async <T extends uploadDto>(props: T) => {
  const { headers, body, set } = props
  const userId = headers.get("userId") || ""
  const { title, images } = body
  if (!title || !images.length) {
    set && (set.status = 400)
    return {
      message: "Bad request",
      data: [],
    }
  }
  try {
    const [user] = await db.select().from(users).where(like(users.id, userId))
    const post_id: string = uuidv4()
    let urlImages: Array<string> = []
    await Promise.all(
      images.map(async (item, index) => {
        const url = `ie307/users/${user.id}/posts/${post_id}/image_${index + 1}.webp`
        const blob = await fetch(item).then((res) => res.blob())
        await uploadObject(url, blob, "image/webp")
        if (!urlImages.length) urlImages = [url]
        else urlImages = [...urlImages, url]
      }),
    )
    const newPost = {
      id: post_id,
      author_id: user.id,
      images: JSON.stringify(urlImages),
      title,
      slug: toSlug(title),
    }
    await db.insert(posts).values(newPost)
    await db.insert(loves).values({ post_id, lovers: JSON.stringify([]) })
    set.status = 201
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
