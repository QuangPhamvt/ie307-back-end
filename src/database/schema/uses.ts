import { sql } from "drizzle-orm"
import { char, int, mysqlTable, varchar } from "drizzle-orm/mysql-core"

export const users = mysqlTable("users", {
  id: int("id")
    .primaryKey()
    .default(sql`(uuid())`),
  email: varchar("email", { length: 128 }).unique().notNull(),
  password: varchar("password", { length: 128 }).notNull(),
})
