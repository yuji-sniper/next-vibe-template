import { sql } from "drizzle-orm"
import {
  boolean,
  mysqlTable,
  text,
  timestamp,
  varchar
} from "drizzle-orm/mysql-core"

export const stripeWebhookEvents = mysqlTable("stripe_webhook_events", {
  id: varchar("id", { length: 36 }).primaryKey(),
  stripeEventId: varchar("stripe_event_id", { length: 255 }).notNull().unique(),
  eventType: text("event_type").notNull(),
  processed: boolean("processed").default(false).notNull(),
  createdAt: timestamp("created_at", { fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull()
})
