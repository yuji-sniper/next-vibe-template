import { sql } from "drizzle-orm"
import {
  index,
  json,
  mysqlTable,
  text,
  timestamp,
  varchar
} from "drizzle-orm/mysql-core"

export const emails = mysqlTable(
  "emails",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    messageId: varchar("message_id", { length: 255 }),
    fromAddress: varchar("from_address", { length: 255 }).notNull(),
    fromName: text("from_name"),
    toAddresses: json("to_addresses")
      .notNull()
      .$type<{ address: string; name: string }[]>(),
    ccAddresses: json("cc_addresses").$type<
      { address: string; name: string }[] | null
    >(),
    subject: text("subject"),
    bodyText: text("body_text"),
    bodyHtml: text("body_html"),
    s3Bucket: text("s3_bucket").notNull(),
    s3Key: text("s3_key").notNull(),
    receivedAt: timestamp("received_at", { fsp: 3 }),
    createdAt: timestamp("created_at", { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`)
  },
  (table) => [
    index("idx_emails_from_address").on(table.fromAddress),
    index("idx_emails_received_at").on(table.receivedAt),
    index("idx_emails_message_id").on(table.messageId)
  ]
)
