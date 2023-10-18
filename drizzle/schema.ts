import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, unique, int, varchar } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"


export const users = mysqlTable("users", {
	id: int("id").default(sql`uuid()`).notNull(),
	email: varchar("email", { length: 128 }).notNull(),
	password: varchar("password", { length: 128 }).notNull(),
},
(table) => {
	return {
		usersId: primaryKey(table.id),
		usersEmailUnique: unique("users_email_unique").on(table.email),
	}
});