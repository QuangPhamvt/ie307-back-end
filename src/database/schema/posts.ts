import { relations, sql } from "drizzle-orm"
import { datetime, int, mysqlTable, tinyint, varchar, primaryKey, unique } from "drizzle-orm/mysql-core"
import { users } from "./users"
import { comments } from "./comments"

//POST
export const posts = mysqlTable(
  "posts",
  {
    id: varchar("id", { length: 32 })
      .primaryKey()
      .default(sql`(uuid())`),
    authorId: varchar("author_id", { length: 32 }).references(() => users.id),
    image: varchar("image", { length: 128 }),
    title: varchar("title", { length: 75 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull(),
    published: tinyint("published").default(1),
    createAt: datetime("create_at").default(sql`CURRENT_TIMESTAMP`),
    loves: int("loves").default(0),
    shares: int("shares").default(0),
  },
  (table) => {
    return {}
  },
)
export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  comments: many(comments),
  loves: many(loves),
}))

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
