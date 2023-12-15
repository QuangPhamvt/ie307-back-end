import { boolean, int, mysqlTable, varchar, text, datetime } from "drizzle-orm/mysql-core"
import { users } from "./users"
import { relations, sql } from "drizzle-orm"

export const notifications = mysqlTable("notifications", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .default(sql`(uuid())`),
  user_id: varchar("author_id", { length: 36 }),
  notifications: int("notifications").default(0).notNull(),
})

export const notificationsRelation = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.user_id],
    references: [users.id],
  }),
}))
export const notification_posts = mysqlTable("notification_posts", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .default(sql`(uuid())`),
  sender_id: varchar("sender_id", { length: 36 }),
  post_id: varchar("post_id", { length: 36 }),
  context: text("context"),
  create_at: datetime("create_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
})
