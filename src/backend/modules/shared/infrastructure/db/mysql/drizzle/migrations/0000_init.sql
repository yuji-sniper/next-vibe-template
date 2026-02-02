CREATE TABLE `admin_accounts` (
	`id` varchar(36) NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` timestamp(3),
	`refresh_token_expires_at` timestamp(3),
	`scope` text,
	`password` text,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL,
	CONSTRAINT `admin_accounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `admin_sessions` (
	`id` varchar(36) NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`token` varchar(255) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` varchar(36) NOT NULL,
	CONSTRAINT `admin_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_sessions_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `admin_verifications` (
	`id` varchar(36) NOT NULL,
	`identifier` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `admin_verifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `admins` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL DEFAULT false,
	`image` text,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `admins_id` PRIMARY KEY(`id`),
	CONSTRAINT `admins_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`stripe_customer_id` varchar(255) NOT NULL,
	`email` text NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `customers_id` PRIMARY KEY(`id`),
	CONSTRAINT `customers_stripe_customer_id_unique` UNIQUE(`stripe_customer_id`)
);
--> statement-breakpoint
CREATE TABLE `emails` (
	`id` varchar(36) NOT NULL,
	`message_id` varchar(255),
	`from_address` varchar(255) NOT NULL,
	`from_name` text,
	`to_addresses` json NOT NULL,
	`cc_addresses` json,
	`subject` text,
	`body_text` text,
	`body_html` text,
	`s3_bucket` text NOT NULL,
	`s3_key` text NOT NULL,
	`received_at` timestamp(3),
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `emails_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` varchar(36) NOT NULL,
	`customer_id` varchar(36) NOT NULL,
	`subscription_id` varchar(36),
	`stripe_invoice_id` varchar(255) NOT NULL,
	`amount` int NOT NULL,
	`currency` varchar(3) NOT NULL,
	`status` text NOT NULL,
	`paid_at` timestamp(3),
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`),
	CONSTRAINT `invoices_stripe_invoice_id_unique` UNIQUE(`stripe_invoice_id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` varchar(36) NOT NULL,
	`customer_id` varchar(36) NOT NULL,
	`stripe_payment_intent_id` varchar(255) NOT NULL,
	`amount` int NOT NULL,
	`currency` text NOT NULL,
	`status` text NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `payments_id` PRIMARY KEY(`id`),
	CONSTRAINT `payments_stripe_payment_intent_id_unique` UNIQUE(`stripe_payment_intent_id`)
);
--> statement-breakpoint
CREATE TABLE `prices` (
	`id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`stripe_price_id` varchar(255),
	`currency` text NOT NULL,
	`unit_amount` int NOT NULL,
	`recurring_interval` text,
	`recurring_interval_count` int DEFAULT 1,
	`type` text NOT NULL,
	`active` boolean NOT NULL DEFAULT true,
	`metadata` json,
	`display_name` text,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `prices_id` PRIMARY KEY(`id`),
	CONSTRAINT `prices_stripe_price_id_unique` UNIQUE(`stripe_price_id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` varchar(36) NOT NULL,
	`stripe_product_id` varchar(255),
	`name` text NOT NULL,
	`description` text,
	`active` boolean NOT NULL DEFAULT true,
	`metadata` json,
	`display_order` int DEFAULT 0,
	`features` json,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_stripe_product_id_unique` UNIQUE(`stripe_product_id`)
);
--> statement-breakpoint
CREATE TABLE `stripe_webhook_events` (
	`id` varchar(36) NOT NULL,
	`stripe_event_id` varchar(255) NOT NULL,
	`event_type` text NOT NULL,
	`processed` boolean NOT NULL DEFAULT false,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `stripe_webhook_events_id` PRIMARY KEY(`id`),
	CONSTRAINT `stripe_webhook_events_stripe_event_id_unique` UNIQUE(`stripe_event_id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` varchar(36) NOT NULL,
	`customer_id` varchar(36) NOT NULL,
	`stripe_subscription_id` varchar(255) NOT NULL,
	`stripe_price_id` text NOT NULL,
	`status` text NOT NULL,
	`current_period_start` timestamp(3),
	`current_period_end` timestamp(3),
	`cancel_at_period_end` boolean NOT NULL DEFAULT false,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscriptions_stripe_subscription_id_unique` UNIQUE(`stripe_subscription_id`)
);
--> statement-breakpoint
CREATE TABLE `accounts` (
	`id` varchar(36) NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` timestamp(3),
	`refresh_token_expires_at` timestamp(3),
	`scope` text,
	`password` text,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL,
	CONSTRAINT `accounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` varchar(36) NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`token` varchar(255) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` varchar(36) NOT NULL,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `sessions_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL DEFAULT false,
	`image` text,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verifications` (
	`id` varchar(36) NOT NULL,
	`identifier` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `verifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `admin_accounts` ADD CONSTRAINT `admin_accounts_user_id_admins_id_fk` FOREIGN KEY (`user_id`) REFERENCES `admins`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `admin_sessions` ADD CONSTRAINT `admin_sessions_user_id_admins_id_fk` FOREIGN KEY (`user_id`) REFERENCES `admins`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customers` ADD CONSTRAINT `customers_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invoices` ADD CONSTRAINT `invoices_customer_id_customers_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invoices` ADD CONSTRAINT `invoices_subscription_id_subscriptions_id_fk` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_customer_id_customers_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prices` ADD CONSTRAINT `prices_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_customer_id_customers_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `admin_accounts_userId_idx` ON `admin_accounts` (`user_id`);--> statement-breakpoint
CREATE INDEX `admin_sessions_userId_idx` ON `admin_sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `admin_verifications_identifier_idx` ON `admin_verifications` (`identifier`);--> statement-breakpoint
CREATE INDEX `idx_customers_user_id` ON `customers` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_emails_from_address` ON `emails` (`from_address`);--> statement-breakpoint
CREATE INDEX `idx_emails_received_at` ON `emails` (`received_at`);--> statement-breakpoint
CREATE INDEX `idx_emails_message_id` ON `emails` (`message_id`);--> statement-breakpoint
CREATE INDEX `idx_invoices_customer_id` ON `invoices` (`customer_id`);--> statement-breakpoint
CREATE INDEX `idx_invoices_subscription_id` ON `invoices` (`subscription_id`);--> statement-breakpoint
CREATE INDEX `idx_payments_customer_id` ON `payments` (`customer_id`);--> statement-breakpoint
CREATE INDEX `idx_prices_product_id` ON `prices` (`product_id`);--> statement-breakpoint
CREATE INDEX `idx_prices_stripe_price_id` ON `prices` (`stripe_price_id`);--> statement-breakpoint
CREATE INDEX `idx_prices_active` ON `prices` (`active`);--> statement-breakpoint
CREATE INDEX `idx_products_stripe_product_id` ON `products` (`stripe_product_id`);--> statement-breakpoint
CREATE INDEX `idx_products_active` ON `products` (`active`);--> statement-breakpoint
CREATE INDEX `idx_subscriptions_customer_id` ON `subscriptions` (`customer_id`);--> statement-breakpoint
CREATE INDEX `accounts_userId_idx` ON `accounts` (`user_id`);--> statement-breakpoint
CREATE INDEX `sessions_userId_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `verifications_identifier_idx` ON `verifications` (`identifier`);