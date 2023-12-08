import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, unique, varchar, text, datetime, tinyint } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"


export const profiles = mysqlTable("profiles", {
	id: varchar("id", { length: 36 }).default(sql`uuid()`).notNull(),
	userId: varchar("user_id", { length: 36 }),
	name: varchar("name", { length: 50 }),
	username: varchar("username", { length: 50 }),
	pronouns: varchar("pronouns", { length: 255 }),
	bio: text("bio"),
	gender: varchar("gender", { length: 12 }),
},
(table) => {
	return {
		profilesIdPk: primaryKey({ columns: [table.id], name: "profiles_id_pk"}),
		profilesUsernameUnique: unique("profiles_username_unique").on(table.username),
	}
});

export const users = mysqlTable("users", {
	id: varchar("id", { length: 36 }).default(sql`uuid()`).notNull(),
	email: varchar("email", { length: 128 }),
	password: varchar("password", { length: 128 }).notNull(),
	avatar: varchar("avatar", { length: 240 }),
	registerAt: datetime("register_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
	isActive: tinyint("is_active"),
	codeDigit: varchar("code_digit", { length: 6 }),
},
(table) => {
	return {
		usersIdPk: primaryKey({ columns: [table.id], name: "users_id_pk"}),
		usersEmailUnique: unique("users_email_unique").on(table.email),
	}
});