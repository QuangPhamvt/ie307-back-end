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

export const follow = mysqlTable("follow", {
	id: int("id").default(sql`uuid()`).notNull(),
	follower: int("follower"),
	following: int("following"),
},
(table) => {
	return {
		followId: primaryKey(table.id),
	}
});

export const loves = mysqlTable("loves", {
	authorId: int("author_id").notNull().references(() => users.id),
	postId: int("post_id").notNull().references(() => posts.id),
},
(table) => {
	return {
		lovesAuthorIdPostId: primaryKey(table.authorId, table.postId),
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
	shares: int("shares"),
	loves: int("loves"),
},
(table) => {
	return {
		postsId: primaryKey(table.id),
	}
});

export const users = mysqlTable("users", {
	id: int("id").default(sql`uuid()`).notNull(),
	password: varchar("password", { length: 128 }).notNull(),
	avatar: varchar("avatar", { length: 240 }),
	registerAt: datetime("register_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
	username: varchar("username", { length: 128 }).notNull(),
},
(table) => {
	return {
		usersId: primaryKey(table.id),
		usersUsernameUnique: unique("users_username_unique").on(table.username),
	}
});