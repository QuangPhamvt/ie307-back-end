import { s3ObjectUrl } from "aws/s3"
import { like } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { listMessages, users } from "src/database"

type getSummarizedDto = {
  headers: Headers
  set: SetElysia
}
export const getSummarized = async <T extends getSummarizedDto>(props: T) => {
  const { headers, set } = props
  const userId = headers.get("userId") || ""

  try {
    const list_message = await db
      .select({
        user: {
          user_id: users.id,
          avatar: users.avatar,
          username: users.username,
        },
        message: {
          user_id: listMessages.sender_id,
          message: listMessages.message,
          createAt: listMessages.createAt,
        },
      })
      .from(listMessages)
      .innerJoin(users, like(listMessages.user_id, users.id))
      .where(like(listMessages.author_id, userId))
    console.log(list_message)

    const data = list_message.map((item) => {
      const avatar = item.user.avatar ? s3ObjectUrl(item.user.avatar) : null
      return {
        ...item,
        user: {
          ...item.user,
          avatar,
        },
      }
    })
    return {
      message: "Oke",
      data,
    }
  } catch (error) {
    set.status = "Internal Server Error"
    return {
      message: "Internal Server Error",
      data: [],
    }
  }
}
