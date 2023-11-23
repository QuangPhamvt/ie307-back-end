import { relations, sql } from "drizzle-orm"
import { date, datetime, mysqlTable, varchar } from "drizzle-orm/mysql-core"
import { users } from "./users"

export const listMessages = mysqlTable("List_messages", {
  id: varchar("id", { length: 32 })
    .primaryKey()
    .default(sql`(uuid())`),
  author_id: varchar("author_id", { length: 32 }),
  user_id: varchar("user_id", { length: 32 }).notNull(),
  message: varchar("message", { length: 255 }).notNull(),
  sender_id: varchar("sender_id", { length: 32 }),
  createAt: datetime("create_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
})

export const listMessagesRelation = relations(listMessages, ({ one }) => ({
  users: one(users, {
    fields: [listMessages.author_id],
    references: [users.id],
  }),
}))
