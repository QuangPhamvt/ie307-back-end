CREATE TABLE `post_comments` (
	`id` int,
	`published` tinyint DEFAULT 1,
	`create_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`update_at` datetime,
	`context` text,
	CONSTRAINT `post_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `posts` ADD `image` varchar(128);--> statement-breakpoint
ALTER TABLE `posts` ADD `title` varchar(75) NOT NULL;--> statement-breakpoint
ALTER TABLE `posts` ADD `slug` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `posts` ADD `published` tinyint DEFAULT 1;--> statement-breakpoint
ALTER TABLE `posts` ADD `create_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `posts` ADD `update_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `posts` ADD `content` text NOT NULL;--> statement-breakpoint
ALTER TABLE `post_comments` ADD CONSTRAINT `post_comments_id_posts_id_fk` FOREIGN KEY (`id`) REFERENCES `posts`(`id`) ON DELETE no action ON UPDATE no action;