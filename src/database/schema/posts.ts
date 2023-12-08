import { relations, sql } from "drizzle-orm"
import { datetime, int, mysqlTable, tinyint, varchar } from "drizzle-orm/mysql-core"
import { users } from "./users"
// import { comments } from "./comments"
// import { loves } from "./loves"

// //POST
// export const posts = mysqlTable(
//   "posts",
//   {
//     id: varchar("id", { length: 32 })
//       .primaryKey()
//       .default(sql`(uuid())`),
//     authorId: varchar("author_id", { length: 32 }).references(() => users.id),
//     image: varchar("image", { length: 128 }).notNull(),
//     title: varchar("title", { length: 75 }).notNull(),
//     slug: varchar("slug", { length: 100 }).notNull(),
//     published: tinyint("published").default(1).notNull(),
//     createAt: datetime("create_at")
//       .notNull()
//       .default(sql`CURRENT_TIMESTAMP`),
//     loves: int("loves").default(0),
//     shares: int("shares").default(0),
//   },
//   (table) => {
//     return {}
//   },
// )
// export const postsRelations = relations(posts, ({ one, many }) => ({
//   author: one(users, {
//     fields: [posts.authorId],
//     references: [users.id],
//   }),
//   comments: many(comments),
//   loves: many(loves),
// }))
