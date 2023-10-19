import { relations, sql } from "drizzle-orm"
import { datetime, int, mysqlTable, tinyint, varchar, text } from "drizzle-orm/mysql-core"
import { users } from "./users"
import { comments } from "./comments"

export const posts = mysqlTable("posts", {
  id: int("id")
    .primaryKey()
    .default(sql`(uuid())`),
  authorId: int("author_id").references(() => users.id),
  image: varchar("image", { length: 128 }),
  title: varchar("title", { length: 75 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull(),
  published: tinyint("published").default(1),
  createAt: datetime("create_at").default(sql`CURRENT_TIMESTAMP`),
  update: datetime("update_at").default(sql`CURRENT_TIMESTAMP`),
  content: text("content").notNull(),
})

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  comments: many(comments),
}))
