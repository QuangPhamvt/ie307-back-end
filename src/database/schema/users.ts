import { relations, sql } from "drizzle-orm"
import { char, datetime, int, mysqlTable, text, varchar } from "drizzle-orm/mysql-core"
import { posts } from "./posts"
import { notifications } from "./notifications"
import { loves } from "./loves"
import { messages } from "./message"

// USERS
export const users = mysqlTable("users", {
  id: varchar("id", { length: 32 })
    .primaryKey()
    .default(sql`(uuid())`),
  email: varchar("email", { length: 128 }).unique().notNull(),
  username: varchar("username", { length: 128 }).unique().notNull(),
  password: varchar("password", { length: 128 }).notNull(),
  avatar: varchar("avatar", { length: 240 }),
  registerAt: datetime("register_at").default(sql`CURRENT_TIMESTAMP`),
})
export const usersRelation = relations(users, ({ many, one }) => ({
  posts: many(posts),
  loves: many(loves),
  sender: many(messages, { relationName: "sender" }),
  receiver: many(messages, { relationName: "receiver" }),
  notification: one(notifications, {
    fields: [users.id],
    references: [notifications.user_id],
  }),
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
