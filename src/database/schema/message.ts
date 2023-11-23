import { relations, sql } from "drizzle-orm"
import { mysqlTable, text, varchar, datetime } from "drizzle-orm/mysql-core"
import { users } from "./users"

//MESSAGE
export const messages = mysqlTable("message", {
  id: varchar("id", { length: 32 })
    .primaryKey()
    .default(sql`(uuid())`),
  sender_id: varchar("sender", { length: 32 }).references(() => users.id),
  receiver_id: varchar("receiver", { length: 32 }).references(() => users.id),
  message: text("message").notNull(),
  createAt: datetime("create_at").default(sql`CURRENT_TIMESTAMP`),
})
export const messageRelation = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.sender_id],
    references: [users.id],
    relationName: `sender`,
  }),
  receiver: one(users, {
    fields: [messages.receiver_id],
    references: [users.id],
    relationName: `receiver`,
  }),
}))
