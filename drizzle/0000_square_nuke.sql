CREATE TABLE `users` (
	`id` int NOT NULL DEFAULT (uuid()),
	`email` varchar(128) NOT NULL,
	`password` varchar(128) NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
