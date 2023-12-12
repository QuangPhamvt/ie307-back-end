import { relations, sql } from "drizzle-orm"
import { datetime, int, mysqlTable, text, tinyint, varchar } from "drizzle-orm/mysql-core"
import { posts } from "./posts"

// COMMENTS
export const comments = mysqlTable("comments", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .default(sql`(uuid())`),
  post_id: varchar("post_id", { length: 36 }),
  parent_id: varchar("id", { length: 36 }),
  context: text("context"),
  create_at: datetime("create_at").default(sql`CURRENT_TIMESTAMP`),
  update_at: datetime("update_at"),
})
export const postCommentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.post_id],
    references: [posts.id],
  }),
  parent: one(comments, {
    fields: [comments.parent_id],
    references: [comments.id],
  }),
}))
