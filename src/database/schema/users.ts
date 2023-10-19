import { relations, sql } from "drizzle-orm"
import { char, datetime, int, mysqlTable, varchar } from "drizzle-orm/mysql-core"
import { posts } from "./posts"

export const users = mysqlTable("users", {
  id: int("id")
    .primaryKey()
    .default(sql`(uuid())`),
  email: varchar("email", { length: 128 }).unique().notNull(),
  password: varchar("password", { length: 128 }).notNull(),
  avatar: varchar("avatar", { length: 240 }),
  registerAt: datetime("register_at").default(sql`CURRENT_TIMESTAMP`),
})
export const usersRelation = relations(users, ({ many }) => ({
  posts: many(posts),
}))
