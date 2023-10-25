import { relations, sql } from "drizzle-orm"
import { datetime, int, mysqlTable, text, tinyint } from "drizzle-orm/mysql-core"
import { posts } from "./posts"

// COMMENTS
export const comments = mysqlTable("comments", {
  id: int("id")
    .primaryKey()
    .default(sql`(uuid())`),
  postId: int("id").references(() => posts.id),
  parentId: int("id"),
  published: tinyint("published").default(1),
  createAt: datetime("create_at").default(sql`CURRENT_TIMESTAMP`),
  updateAt: datetime("update_at"),
  context: text("context"),
})
export const postCommentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
}))
