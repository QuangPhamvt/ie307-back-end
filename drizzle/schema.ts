import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, varchar, datetime, tinyint, text, foreignKey, int, unique } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"


export const listMessages = mysqlTable("List_messages", {
	id: varchar("id", { length: 32 }).default(sql`uuid()`).notNull(),
	authorId: varchar("author_id", { length: 32 }),
	userId: varchar("user_id", { length: 32 }).notNull(),
	message: varchar("message", { length: 255 }).notNull(),
	senderId: varchar("sender_id", { length: 32 }).notNull(),
	createAt: datetime("create_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => {
	return {
		listMessagesIdPk: primaryKey({ columns: [table.id], name: "List_messages_id_pk"}),
	}
});

export const comments = mysqlTable("comments", {
	id: varchar("id", { length: 32 }).notNull(),
	published: tinyint("published").default(1),
	createAt: datetime("create_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
	updateAt: datetime("update_at", { mode: 'string'}),
	context: text("context"),
},
(table) => {
	return {
		commentsIdPk: primaryKey({ columns: [table.id], name: "comments_id_pk"}),
	}
});

export const follow = mysqlTable("follow", {
	id: varchar("id", { length: 32 }).default(sql`uuid()`).notNull(),
	follower: varchar("follower", { length: 32 }),
	following: varchar("following", { length: 32 }),
},
(table) => {
	return {
		followIdPk: primaryKey({ columns: [table.id], name: "follow_id_pk"}),
	}
});

export const loves = mysqlTable("loves", {
	authorId: varchar("author_id", { length: 32 }).notNull(),
	postId: varchar("post_id", { length: 32 }).notNull(),
},
(table) => {
	return {
		lovesAuthorIdPostIdPk: primaryKey({ columns: [table.authorId, table.postId], name: "loves_author_id_post_id_pk"}),
	}
});

export const message = mysqlTable("message", {
	id: varchar("id", { length: 32 }).default(sql`uuid()`).notNull(),
	sender: varchar("sender", { length: 32 }).notNull(),
	receiver: varchar("receiver", { length: 32 }).notNull(),
	message: text("message").notNull(),
	createAt: datetime("create_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => {
	return {
		messageIdPk: primaryKey({ columns: [table.id], name: "message_id_pk"}),
	}
});

export const notifications = mysqlTable("notifications", {
	id: varchar("id", { length: 32 }).default(sql`uuid()`).notNull(),
	userId: varchar("user_id", { length: 32 }).references(() => users.id),
	isMessage: tinyint("is_message").default(0),
},
(table) => {
	return {
		notificationsIdPk: primaryKey({ columns: [table.id], name: "notifications_id_pk"}),
	}
});

export const posts = mysqlTable("posts", {
	id: varchar("id", { length: 32 }).default(sql`uuid()`).notNull(),
	authorId: varchar("author_id", { length: 32 }).references(() => users.id),
	image: varchar("image", { length: 128 }).notNull(),
	title: varchar("title", { length: 75 }).notNull(),
	slug: varchar("slug", { length: 100 }).notNull(),
	published: tinyint("published").default(1).notNull(),
	createAt: datetime("create_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
	loves: int("loves").default(0),
	shares: int("shares").default(0),
},
(table) => {
	return {
		postsIdPk: primaryKey({ columns: [table.id], name: "posts_id_pk"}),
	}
});

export const users = mysqlTable("users", {
	id: varchar("id", { length: 32 }).default(sql`uuid()`).notNull(),
	email: varchar("email", { length: 128 }).notNull(),
	username: varchar("username", { length: 128 }).notNull(),
	password: varchar("password", { length: 128 }).notNull(),
	avatar: varchar("avatar", { length: 240 }),
	registerAt: datetime("register_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
},
(table) => {
	return {
		usersIdPk: primaryKey({ columns: [table.id], name: "users_id_pk"}),
		usersEmailUnique: unique("users_email_unique").on(table.email),
		usersUsernameUnique: unique("users_username_unique").on(table.username),
	}
});