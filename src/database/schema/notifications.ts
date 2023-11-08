import { boolean, mysqlTable, varchar } from "drizzle-orm/mysql-core"
import { users } from "./users"
import { relations, sql } from "drizzle-orm"

export const notifications = mysqlTable("notifications", {
  id: varchar("id", { length: 32 })
    .primaryKey()
    .default(sql`(uuid())`),
  user_id: varchar("user_id", { length: 32 }).references(() => users.id),
  isMessage: boolean(`is_message`).default(false),
})

export const notificationsRelation = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.user_id],
    references: [users.id],
  }),
}))
