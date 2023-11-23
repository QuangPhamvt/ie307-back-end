import { relations } from "drizzle-orm"
import { mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core"
import { users } from "./users"
import { posts } from "./posts"

//LOVE
export const loves = mysqlTable(
  `loves`,
  {
    authorId: varchar("author_id", { length: 32 })
      .notNull()
      .references(() => users.id),
    postId: varchar("post_id", { length: 32 })
      .notNull()
      .references(() => posts.id),
  },
  (t) => ({
    pk: primaryKey(t.authorId, t.postId),
  }),
)
export const lovesRelations = relations(loves, ({ one }) => ({
  author: one(users, {
    fields: [loves.authorId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [loves.postId],
    references: [posts.id],
  }),
}))
