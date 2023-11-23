import { s3ObjectUrl, uploadObject } from "aws/s3"
import { asc, desc, like } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { users } from "src/database"
import { posts } from "src/database"

type TBodyPostList = {
  page?: number
  limit?: number
}
type TBodySearch = {
  search?: string
}
type TBodyUpload = {
  title?: string
  image?: string
}
type TBodyOriginPost = {
  postId?: string
}
/* Enhanced from: https://codepen.io/trongthanh/pen/rmYBdX */
function toSlug(str: string) {
  // Convert to lower case
  str = str.toLowerCase()

  // delete sign
  str = str
    .normalize("NFD") // convert string to unicode
    .replace(/[\u0300-\u036f]/g, "") // delete sign

  // replace đĐ to d
  str = str.replace(/[đĐ]/g, "d")

  //  delete special characters
  str = str.replace(/([^0-9a-z-\s])/g, "")

  // replace key space to "-"
  str = str.replace(/(\s+)/g, "-")
  str = str.replace(/-+/g, "-")
  str = str.replace(/^-+|-+$/g, "")

  // return
  return str
}

const postService: {
  [x: string]: <TBody extends TBodyPostList & TBodyUpload & TBodySearch & TBodyOriginPost>(
    body: TBody,
    headers?: Headers,
    set?: SetElysia,
  ) => unknown
} = {
  upload: async (body, headers, set) => {
    const { title, image } = body

    if (!title || !image) {
      set && (set.status = 400)
      return {
        messaga: "Bad request",
      }
    }

    const [user] = await db
      .select()
      .from(users)
      .where(like(users.id, headers?.get("userId") || ""))
    const newPost = {
      authorId: user.id,
      title,
      slug: toSlug(title),
    }
    await db.insert(posts).values(newPost)
    const [post] = await db
      .select()
      .from(posts)
      .where(like(posts.authorId, user.id))
      .limit(1)
      .orderBy(desc(posts.createAt))

    const url = `ie307/users/${user.id}/posts/${post.id}.webp`

    const blob = await fetch(image).then((res) => res.blob())
    await db.update(posts).set({ image: url }).where(like(posts.id, post.id))
    await uploadObject(url, blob, "image/webp")

    set && (set.status = 201)
    return {
      message: "Created",
    }
  },
}

export default postService
