CREATE TABLE "emails" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"message_id" text,
	"from_address" text NOT NULL,
	"from_name" text,
	"to_addresses" jsonb NOT NULL,
	"cc_addresses" jsonb,
	"subject" text,
	"body_text" text,
	"body_html" text,
	"s3_bucket" text NOT NULL,
	"s3_key" text NOT NULL,
	"received_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_emails_from_address" ON "emails" USING btree ("from_address");--> statement-breakpoint
CREATE INDEX "idx_emails_received_at" ON "emails" USING btree ("received_at");--> statement-breakpoint
CREATE INDEX "idx_emails_message_id" ON "emails" USING btree ("message_id");