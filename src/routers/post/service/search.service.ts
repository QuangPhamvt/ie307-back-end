import { s3ObjectUrl } from "aws/s3"
import { desc, like } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { posts, users } from "src/database"
import { toSlug } from "src/utilities"

type searchDto = {
  headers: Headers
  body: {
    search: string
  }
  set: SetElysia
}
export const search = async <T extends searchDto>(props: T) => {
  const { headers, body, set } = props
  const { search } = body
  if (!search) {
    set && (set.status = 400)
    return {
      message: "Bad request",
      data: [],
    }
  }
  try {
    const postList = await db
      .select({
        post_id: posts.id,
        author: {
          author_id: users.id,
          username: users.email,
          avatar: users.avatar,
        },
        image: posts.images,
        createAt: posts.create_at,
        slug: posts.slug,
      })
      .from(posts)
      .innerJoin(users, like(posts.author_id, users.id))
      .where(like(posts.slug, `%${toSlug(search)}%`))
      .orderBy(desc(posts.create_at))
    return {
      message: "Oke",
      data: postList.map((item) => {
        const { author } = item
        const avatar = author.avatar ? s3ObjectUrl(author.avatar) : null
        return {
          ...item,
          author: {
            ...item.author,
            avatar,
          },
          image: s3ObjectUrl(item.image),
        }
      }),
    }
  } catch (error) {
    set.status = "Internal Server Error"
    return {
      message: "Internal Server Error",
      data: [],
    }
  }
}
