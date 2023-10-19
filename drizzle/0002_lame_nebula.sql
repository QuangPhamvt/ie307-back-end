CREATE TABLE `posts` (
	`id` int NOT NULL DEFAULT (uuid()),
	`author_id` int,
	CONSTRAINT `posts_id` PRIMARY KEY(`id`)
);
