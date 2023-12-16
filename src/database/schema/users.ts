import { relations, sql } from "drizzle-orm"
import { boolean, char, datetime, int, mysqlTable, text, varchar } from "drizzle-orm/mysql-core"
import { comments } from "./comments"
// import { posts } from "./posts"
// import { notifications } from "./notifications"
// import { loves } from "./loves"
// import { messages } from "./message"

// USERS
export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .default(sql`(uuid())`),
  email: varchar("email", { length: 128 }).unique(),
  password: varchar("password", { length: 128 }).notNull(),
  avatar: varchar("avatar", { length: 240 }),
  is_active: boolean("is_active"),
  register_at: datetime("register_at").default(sql`CURRENT_TIMESTAMP`),
  code_digit: varchar("code_digit", { length: 6 }),
})
export const usersRelation = relations(users, ({ many, one }) => ({
  profiles: one(profiles, {
    fields: [users.id],
    references: [profiles.user_id],
  }),
  comments: many(comments),
}))

// Profiles
export const profiles = mysqlTable("profiles", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .default(sql`(uuid())`),
  user_id: varchar("user_id", { length: 36 }),
  name: varchar("name", { length: 50 }),
  username: varchar("username", { length: 50 }).unique(),
  pronouns: varchar("pronouns", { length: 255 }),
  bio: text("bio"),
  gender: varchar("gender", { length: 12, enum: ["male", "female", "Can not say"] }),
})
export const profilesRelation = relations(profiles, ({ one }) => ({
  users: one(users),
}))

// Follow

export const follows = mysqlTable("follows", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .default(sql`(uuid())`),
  following_id: text("following_id"),
  follows: int("follows").default(0),
  following: int("following").default(0),
})
export const followsRelation = relations(follows, ({ one }) => ({
  users: one(users, {
    fields: [follows.id],
    references: [users.id],
  }),
}))
