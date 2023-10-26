import { relations, sql } from "drizzle-orm"
import { char, datetime, int, mysqlTable, varchar } from "drizzle-orm/mysql-core"
import { loves, posts } from "./posts"

// USERS
export const users = mysqlTable("users", {
  id: varchar("id", { length: 32 })
    .primaryKey()
    .default(sql`(uuid())`),
  username: varchar("username", { length: 128 }).unique().notNull(),
  password: varchar("password", { length: 128 }).notNull(),
  avatar: varchar("avatar", { length: 240 }),
  registerAt: datetime("register_at").default(sql`CURRENT_TIMESTAMP`),
})
export const usersRelation = relations(users, ({ many }) => ({
  posts: many(posts),
  loves: many(loves),
}))

//FOLLOW
export const follow = mysqlTable("follow", {
  id: varchar("id", { length: 32 })
    .primaryKey()
    .default(sql`(uuid())`),
  follower_id: varchar("follower", { length: 32 }),
  following_id: varchar("following", { length: 32 }),
})
export const followeRelation = relations(follow, ({ one }) => ({
  follower: one(users, {
    fields: [follow.follower_id],
    references: [users.id],
  }),
  following: one(users, {
    fields: [follow.following_id],
    references: [users.id],
  }),
}))
