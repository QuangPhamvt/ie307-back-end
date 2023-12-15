import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, varchar, text, datetime, int, unique, tinyint } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"


export const comments = mysqlTable("comments", {
	id: varchar("id", { length: 36 }).default(sql`uuid()`).notNull(),
	postId: varchar("post_id", { length: 36 }),
	context: text("context"),
	createAt: datetime("create_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
	updateAt: datetime("update_at", { mode: 'string'}),
	parentId: varchar("parent_id", { length: 36 }),
	authorId: varchar("author_id", { length: 36 }),
	loves: int("loves").default(0),
},
(table) => {
	return {
		commentsIdPk: primaryKey({ columns: [table.id], name: "comments_id_pk"}),
	}
});

export const loves = mysqlTable("loves", {
	postId: varchar("post_id", { length: 36 }).notNull(),
	lovers: text("lovers").notNull(),
},
(table) => {
	return {
		lovesPostIdPk: primaryKey({ columns: [table.postId], name: "loves_post_id_pk"}),
	}
});

export const notificationPosts = mysqlTable("notification_posts", {
	id: varchar("id", { length: 36 }).default(sql`uuid()`).notNull(),
	senderId: varchar("sender_id", { length: 36 }),
	postId: varchar("post_id", { length: 36 }),
	context: text("context"),
	createAt: datetime("create_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => {
	return {
		notificationPostsIdPk: primaryKey({ columns: [table.id], name: "notification_posts_id_pk"}),
	}
});

export const notifications = mysqlTable("notifications", {
	id: varchar("id", { length: 36 }).default(sql`uuid()`).notNull(),
	authorId: varchar("author_id", { length: 36 }),
	notifications: int("notifications").default(0),
},
(table) => {
	return {
		notificationsIdPk: primaryKey({ columns: [table.id], name: "notifications_id_pk"}),
	}
});

export const posts = mysqlTable("posts", {
	id: varchar("id", { length: 36 }).default(sql`uuid()`).notNull(),
	authorId: varchar("author_id", { length: 36 }).notNull(),
	images: text("images").notNull(),
	title: varchar("title", { length: 75 }).notNull(),
	slug: varchar("slug", { length: 100 }).notNull(),
	createAt: datetime("create_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
	loves: int("loves").default(0),
	comments: int("comments").default(0),
},
(table) => {
	return {
		postsIdPk: primaryKey({ columns: [table.id], name: "posts_id_pk"}),
	}
});

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