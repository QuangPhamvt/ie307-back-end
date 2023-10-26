ALTER TABLE `comments` MODIFY COLUMN `id` varchar(32);--> statement-breakpoint
ALTER TABLE `loves` MODIFY COLUMN `author_id` varchar(32) NOT NULL;--> statement-breakpoint
ALTER TABLE `loves` MODIFY COLUMN `post_id` varchar(32) NOT NULL;--> statement-breakpoint
ALTER TABLE `posts` MODIFY COLUMN `id` varchar(32) NOT NULL DEFAULT (uuid());--> statement-breakpoint
ALTER TABLE `posts` MODIFY COLUMN `author_id` varchar(32);--> statement-breakpoint
ALTER TABLE `follow` MODIFY COLUMN `follower` varchar(32);--> statement-breakpoint
ALTER TABLE `follow` MODIFY COLUMN `following` varchar(32);--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `id` varchar(32) NOT NULL DEFAULT (uuid());