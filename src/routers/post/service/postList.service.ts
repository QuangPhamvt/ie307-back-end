import { s3ObjectUrl } from "aws/s3"
import { desc } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { posts } from "src/database"

type postListDto = {
  headers: Headers
  body: {
    offset: string
    limit: string
  }
  set: SetElysia
}
export const postList = async <T extends postListDto>(props: T) => {
  const { headers, body, set } = props
  const { limit = 5, offset = 1 } = body
  try {
    const postList = await db
      .select({
        id: posts.id,
        images: posts.images,
      })
      .from(posts)
      .limit(+limit)
      .offset(+offset)
      .orderBy(desc(posts.create_at))
    return {
      message: "Oke",
      data: postList.map((item) => {
        const Images = JSON.parse(item.images).map((subItem: string) => {
          return s3ObjectUrl(subItem || "")
        })
        return {
          ...item,
          images: Images,
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
