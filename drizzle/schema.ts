import { mysqlTable, mysqlSchema, AnyMySqlColumn, foreignKey, primaryKey, int, tinyint, datetime, text, varchar, unique } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"


export const comments = mysqlTable("comments", {
	id: int("id").notNull().references(() => posts.id),
	published: tinyint("published").default(1),
	createAt: datetime("create_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
	updateAt: datetime("update_at", { mode: 'string'}),
	context: text("context"),
},
(table) => {
	return {
		commentsId: primaryKey(table.id),
	}
});

export const posts = mysqlTable("posts", {
	id: int("id").default(sql`uuid()`).notNull(),
	authorId: int("author_id").references(() => users.id),
	image: varchar("image", { length: 128 }),
	title: varchar("title", { length: 75 }).notNull(),
	slug: varchar("slug", { length: 100 }).notNull(),
	published: tinyint("published").default(1),
	createAt: datetime("create_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
	updateAt: datetime("update_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
	content: text("content").notNull(),
},
(table) => {
	return {
		postsId: primaryKey(table.id),
	}
});

export const users = mysqlTable("users", {
	id: int("id").default(sql`uuid()`).notNull(),
	email: varchar("email", { length: 128 }).notNull(),
	password: varchar("password", { length: 128 }).notNull(),
	avatar: varchar("avatar", { length: 240 }),
	registerAt: datetime("register_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
},
(table) => {
	return {
		usersId: primaryKey(table.id),
		usersEmailUnique: unique("users_email_unique").on(table.email),
	}
});