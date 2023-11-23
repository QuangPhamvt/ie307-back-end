import { relations, sql } from "drizzle-orm"
import { mysqlTable, varchar } from "drizzle-orm/mysql-core"
import { users } from "./users"

export const listMessages = mysqlTable("List_messages", {
  id: varchar("id", { length: 32 })
    .primaryKey()
    .default(sql`(uuid())`),
  author_id: varchar("author_id", { length: 32 }),
  user_id: varchar("user_id", { length: 32 }),
  message: varchar("message", { length: 255 }),
  sender_id: varchar("sender_id", { length: 32 }),
})

export const listMessagesRelation = relations(listMessages, ({ one }) => ({
  users: one(users, {
    fields: [listMessages.author_id],
    references: [users.id],
  }),
}))
