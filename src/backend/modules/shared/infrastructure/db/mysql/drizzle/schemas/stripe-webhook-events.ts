import {
  boolean,
  mysqlTable,
  text,
  timestamp,
  varchar
} from "drizzle-orm/mysql-core"

export const stripeWebhookEvents = mysqlTable("stripe_webhook_events", {
  id: varchar("id", { length: 36 }).primaryKey(),
  stripeEventId: text("stripe_event_id").notNull().unique(),
  eventType: text("event_type").notNull(),
  processed: boolean("processed").default(false).notNull(),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull()
})
