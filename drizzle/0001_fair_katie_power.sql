ALTER TABLE `users` ADD `avatar` varchar(240);--> statement-breakpoint
ALTER TABLE `users` ADD `register_at` datetime DEFAULT CURRENT_TIMESTAMP;