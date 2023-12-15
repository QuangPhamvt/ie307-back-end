import { s3ObjectUrl } from "aws/s3"
import { like } from "drizzle-orm"
import Elysia, { t } from "elysia"
import db, { notification_posts, users, notifications, posts } from "src/database"

const app = new Elysia({ websocket: { idleTimeout: 120 } })
  .ws("/comment/:id", {
    params: t.Object({
      id: t.String(),
    }),
    body: t.Object({
      post_id: t.String(),
      comment_parent: t.Union([t.String(), t.Null()]),
      context: t.String(),
    }),
    open: (ws) => {
      console.log("New connect to comment websocket: ", ws.data.params.id)
    },
    async message(ws, message) {
      const { post_id, context } = message
      const [isHaveNotification] = await db
        .select()
        .from(notification_posts)
        .where(like(notification_posts.post_id, post_id))
      if (isHaveNotification) {
        await db.update(notification_posts).set({ context }).where(like(notification_posts.post_id, post_id))
      } else {
        await db.insert(notification_posts).values({ sender_id: ws.data.params.id, post_id, context })
      }
      const [post] = await db.select().from(posts).where(like(posts.id, post_id))
      const [notification] = await db.select().from(notifications).where(like(notifications.user_id, post.author_id))

      if (!notification) {
        await db.insert(notifications).values({ user_id: post.author_id, notifications: 1 })
      } else {
        await db.update(notifications).set({ notifications: notification.notifications + 1 })
      }
      const [sender_id] = await db.select().from(users).where(like(users.id, ws.data.params.id))

      ws.publish(post.author_id, {
        notifications: notification ? notification.notifications + 1 : 1,
        sender: {
          sender_id: sender_id.id,
          avatar: sender_id.avatar ? s3ObjectUrl(sender_id.avatar) : null,
          email: sender_id.email,
        },
        post: {
          post_id: post.id,
          title: post.title,
        },
        notification: {
          context,
          create_at: Date.toString(),
        },
      })
    },
    close: (ws) => {
      ws.send({ message: "Connection is close" })
    },
  })
  .ws("/notification/:id", {
    params: t.Object({
      id: t.String(),
    }),
    open(ws) {
      console.log("New connect to notification websocket: ", ws.data.params.id)
      ws.subscribe(ws.data.params.id)
    },
    close: (ws) => {
      ws.send({ message: "Connection is close" })
    },
  })

app.listen({ port: 4001, hostname: "0.0.0.0" })
