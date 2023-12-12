import { relations } from "drizzle-orm"
import { mysqlTable, text, varchar } from "drizzle-orm/mysql-core"
import { posts } from "./posts"

//LOVE
export const loves = mysqlTable(`loves`, {
  post_id: varchar("post_id", { length: 36 }).primaryKey(),
  lovers: text("lovers").notNull(),
})
export const lovesRelations = relations(loves, ({ one }) => ({
  post: one(posts, {
    fields: [loves.post_id],
    references: [posts.id],
  }),
}))
