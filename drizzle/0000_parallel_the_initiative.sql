CREATE TABLE `changes` (
	`id` text PRIMARY KEY NOT NULL,
	`monitor_id` text NOT NULL,
	`previous_snapshot_id` text,
	`new_snapshot_id` text NOT NULL,
	`detected_at` integer,
	`change_type` text NOT NULL,
	`summary` text,
	`diff_data` text,
	FOREIGN KEY (`monitor_id`) REFERENCES `monitors`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`previous_snapshot_id`) REFERENCES `snapshots`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`new_snapshot_id`) REFERENCES `snapshots`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text,
	`role` text DEFAULT 'user' NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `monitors` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`url` text NOT NULL,
	`name` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`schedule` text NOT NULL,
	`fetch_strategy` text DEFAULT 'http' NOT NULL,
	`selectors` text,
	`normalization_settings` text,
	`timeout` integer DEFAULT 30000,
	`retry_settings` text,
	`created_at` integer,
	`updated_at` integer,
	`last_checked_at` integer,
	`next_check_at` integer,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`monitor_id` text NOT NULL,
	`timestamp` integer,
	`http_status` integer,
	`content_hash` text,
	`extracted_content` text,
	`metadata` text,
	`crawl_strategy` text,
	`result_status` text NOT NULL,
	FOREIGN KEY (`monitor_id`) REFERENCES `monitors`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`monitor_id` text NOT NULL,
	`channel` text NOT NULL,
	`target` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer,
	`sent_at` integer,
	`error_log` text,
	FOREIGN KEY (`monitor_id`) REFERENCES `monitors`(`id`) ON UPDATE no action ON DELETE no action
);
