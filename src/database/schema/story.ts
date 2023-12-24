import { relations, sql } from "drizzle-orm"
import { mysqlTable, varchar, datetime } from "drizzle-orm/mysql-core"
import { users } from "./users"

export const stories = mysqlTable("stories", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .default(sql`(uuid())`),
  image: varchar("image", { length: 255 }),
  create_at: datetime("create_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  author_id: varchar("author_id", { length: 36 }),
})
export const storiesRelations = relations(stories, ({ one }) => ({
  author: one(users, {
    fields: [stories.author_id],
    references: [users.id],
  }),
}))
