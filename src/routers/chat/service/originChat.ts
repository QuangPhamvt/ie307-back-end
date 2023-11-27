import { s3ObjectUrl } from "aws/s3"
import { and, desc, like, or } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { messages, users, usersRelation } from "src/database"

type TOriginChat = {
  headers: Headers
  body: {
    user_id: string
  }
  set: SetElysia
}
export const originChat = async <T extends TOriginChat>(props: T) => {
  const {
    headers,
    body: { user_id },
    set,
  } = props
  const authId = headers.get("userId") || ""
  try {
    const message = await db
      .select({
        sender_id: messages.sender_id,
        receiver_id: messages.receiver_id,
        message: messages.message,
        create_at: messages.createAt,
      })
      .from(messages)
      .where(
        or(
          and(like(messages.sender_id, authId), like(messages.receiver_id, user_id)),
          and(like(messages.sender_id, user_id), like(messages.receiver_id, authId)),
        ),
      )
      .orderBy(desc(messages.createAt))
    const [user] = await db
      .select({
        user_id: users.id,
        username: users.username,
        avatar: users.avatar,
      })
      .from(users)
      .where(like(users.id, user_id))
    const avatar = user.avatar ? s3ObjectUrl(user.avatar) : null
    return {
      message: "Internal Server Error",
      data: [
        {
          user: {
            ...user,
            avatar,
          },
          messages: message,
        },
      ],
    }
  } catch (error) {
    console.log(error)
    set.status = "Internal Server Error"
    return {
      message: "Internal Server Error",
      data: [],
    }
  }
}
