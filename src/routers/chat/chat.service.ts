import { and, desc, like, or, sql } from "drizzle-orm"
import { SetElysia } from "src/config"
import db, { messages, users } from "src/database"

type TPostDetail = {
  receiver_id?: string
}
interface TChatService {
  [x: string]: <TBody extends TPostDetail>({
    body: TBody,
    headers,
    set,
  }: {
    body?: TBody
    headers?: Headers
    set?: SetElysia
  }) => unknown
}
export const chatService: TChatService = {
  getSummarized: async ({ headers, set }) => {
    const userId = headers?.get("userId") || ""
    const receiver = (
      await db
        .selectDistinct({
          senderId: messages.sender_id,
          receiverId: messages.receiver_id,
        })
        .from(users)
        .innerJoin(messages, or(like(users.id, messages.sender_id), like(users.id, messages.receiver_id)))
        .where(like(users.id, userId))
    ).filter((item) => item.receiverId !== item.senderId)
    const data = await Promise.all(
      receiver.map(async (item) => {
        const [payload] = await db
          .selectDistinct({
            receiverId: users.id,
            receiver: users.username,
            message: {
              message: messages.message,
              createAt: messages.createAt,
            },
          })
          .from(messages)
          .where(
            or(
              and(like(messages.sender_id, item.senderId), like(messages.receiver_id, item.receiverId || "")),
              and(like(messages.receiver_id, item.senderId), like(messages.sender_id, item.receiverId || "")),
            ),
          )
          .innerJoin(users, like(users.id, item.receiverId || ""))
          .orderBy(desc(messages.createAt))
        return payload
      }),
    )
    return data
  },
  postDetail: async ({ body, headers, set }) => {
    const userId = headers?.get("userId") || ""
    const receiver_id = body?.receiver_id || ""
    const data = await db
      .select()
      .from(messages)
      .where(
        or(
          and(like(messages.sender_id, userId), like(messages.receiver_id, receiver_id)),
          and(like(messages.receiver_id, userId), like(messages.sender_id, receiver_id)),
        ),
      )
      .orderBy(desc(messages.createAt))
    return data
  },
}
