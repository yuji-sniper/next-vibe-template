import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar
} from "drizzle-orm/pg-core"

export const emails = pgTable(
  "emails",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    messageId: text("message_id"),
    fromAddress: text("from_address").notNull(),
    fromName: text("from_name"),
    toAddresses: jsonb("to_addresses")
      .notNull()
      .$type<{ address: string; name: string }[]>(),
    ccAddresses: jsonb("cc_addresses").$type<
      { address: string; name: string }[] | null
    >(),
    subject: text("subject"),
    bodyText: text("body_text"),
    bodyHtml: text("body_html"),
    s3Bucket: text("s3_bucket").notNull(),
    s3Key: text("s3_key").notNull(),
    receivedAt: timestamp("received_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  (table) => [
    index("idx_emails_from_address").on(table.fromAddress),
    index("idx_emails_received_at").on(table.receivedAt),
    index("idx_emails_message_id").on(table.messageId)
  ]
)
