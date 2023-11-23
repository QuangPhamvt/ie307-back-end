import { and, like } from "drizzle-orm"
import Elysia, { t } from "elysia"
import db, { listMessages, messages, users } from "src/database"
import { notifications } from "src/database/schema/notifications"
const notificationData = async (id: string) => {
  const [user] = await db.select().from(users).where(like(users.id, id))
  const [notification] = await db
    .select({ notificationId: notifications.id, userId: notifications.user_id, isMessage: notifications.isMessage })
    .from(notifications)
    .where(like(notifications.user_id, id))
  return { user, notification }
}
export const websocket = new Elysia({
  websocket: {
    /**
     * Sets the the number of seconds to wait before timing out a connection
     * due to no messages or pings.
     *
     * Default is 2 minutes, or `120` in seconds.
     */
    idleTimeout: 120,
  },
})
  .ws("/websocket/:id", {
    open(ws) {
      const { id } = ws.data.params
      ws.subscribe(`notification/${id}`)
      ws.subscribe(`message/${id}`)
      ws.publish(`notification/${id}`, "Connect to Notification")
      ws.publish(`message/${id}`, "Connect to Message")
    },
    async message(ws, message) {
      const { id } = ws.data.params
      // CHAT
      if (message.chat) {
        const { receiver_id, message: Message } = message.chat
        // ADD to list message
        const [list_message] = await db
          .select()
          .from(listMessages)
          .where(and(like(listMessages.author_id, id), like(listMessages.user_id, receiver_id)))
        if (list_message) {
          await db.update(listMessages).set({ message: Message, sender_id: id }).where(like(listMessages.author_id, id))
          await db
            .update(listMessages)
            .set({ message: Message, sender_id: id })
            .where(like(listMessages.author_id, receiver_id))
        } else {
          await db.insert(listMessages).values({ author_id: id, user_id: receiver_id, message: Message, sender_id: id })
          await db.insert(listMessages).values({ author_id: receiver_id, user_id: id, message: Message, sender_id: id })
        }
        // ADD message
        await db.insert(messages).values({ sender_id: id, receiver_id, message: Message })
        ws.publish(`message/${receiver_id}`, { sender_id: id, message: Message })
      }
      if (message.notification) {
      }
    },
    close(ws) {
      const { id } = ws.data.params
      ws.unsubscribe(`notification/${id}`)
      ws.unsubscribe(`message/${id}`)
    },
    body: t.Object({
      chat: t.Union([
        t.Object({
          receiver_id: t.String(),
          message: t.String(),
        }),
        t.Null(),
      ]),
      notification: t.Union([t.Object({}), t.Null()]),
    }),
  })
  .listen(4001)
console.log(`🦊 Websocket is running at http://${websocket.server?.hostname}:4001/api/v1/document`)
