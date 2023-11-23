import { s3ObjectUrl } from "aws/s3"
import { desc } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { posts } from "src/database"

type postListDto = {
  headers: Headers
  body: {
    limit: number
    page: number
  }
  set: SetElysia
}
export const postList = async <T extends postListDto>(props: T) => {
  const { headers, body, set } = props
  const { limit = 5, page = 1 } = body
  try {
    const postList = await db
      .select({
        id: posts.id,
        image: posts.image,
      })
      .from(posts)
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy(desc(posts.createAt))
    return {
      message: "Oke",
      data: postList.map((item) => {
        return {
          ...item,
          image: s3ObjectUrl(item.image || ""),
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
