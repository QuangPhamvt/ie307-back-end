import { like } from "drizzle-orm"
import Elysia, { t } from "elysia"
import db, { messages, users } from "src/database"
import { notifications } from "src/database/schema/notifications"
import chalk from "chalk"
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
    body: t.Partial(
      t.Object({
        notification: t.Boolean(),
        chat: t.Object({
          receiver_id: t.String(),
          message: t.String(),
        }),
      }),
    ),
    params: t.Object({
      id: t.String(),
    }),
    response: t.Partial(
      t.Object({
        chat: t.Object({
          message: t.String(),
        }),
        notification: t.Partial(
          t.Object({
            username: t.String(),
            notificationId: t.String(),
            userId: t.Union([t.String(), t.Null()]),
            isMessage: t.Union([t.Boolean(), t.Null()]),
          }),
        ),
        message: t.String(),
      }),
    ),
    async open(ws) {
      console.log(chalk.bgGray("New connect in websocket: "), ws.data.params.id)
      const id = ws.data.params.id
      ws.subscribe(ws.data.params.id)
      ws.send({ message: "New connection on websocket: " + id })
      const { user, notification } = await notificationData(id)
      ws.send({
        notification: {
          username: user.username,
          ...notification,
        },
      })
    },
    async message(ws, message) {
      if (message.chat) {
        const { receiver_id, message: Message } = message.chat
        const data = {
          sender_id: ws.data.params.id,
          receiver_id: receiver_id,
          message: Message,
        }
        await db.insert(messages).values(data)
        await db.update(notifications).set({ isMessage: true }).where(like(notifications.user_id, receiver_id))
        ws.publish(receiver_id, {
          chat: {
            message: Message,
          },
          notification: {
            isMessage: true,
          },
        })
      }
    },
    close(ws) {
      console.log(chalk.yellow("Connection is close"))
      ws.send({ message: "Connection is close" })
    },
  })
  .listen(4001)
console.log(`🦊 Websocket is running at http://${websocket.server?.hostname}:4001/api/v1/document`)
