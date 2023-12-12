import { relations, sql } from "drizzle-orm"
import { datetime, int, mysqlTable, text, tinyint, varchar } from "drizzle-orm/mysql-core"
import { users } from "./users"
import { comments } from "./comments"

//POST
export const posts = mysqlTable("posts", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .default(sql`(uuid())`),
  author_id: varchar("author_id", { length: 36 }).notNull(),
  images: text("images").notNull(),
  title: varchar("title", { length: 75 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull(),
  create_at: datetime("create_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  loves: int("loves").default(0),
  comments: int("comments").default(0),
})
export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.author_id],
    references: [users.id],
  }),
  comments: many(comments),
}))
