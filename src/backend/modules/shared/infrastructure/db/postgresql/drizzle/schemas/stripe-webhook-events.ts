import { boolean, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core"

export const stripeWebhookEvents = pgTable("stripe_webhook_events", {
  id: varchar("id", { length: 36 }).primaryKey(),
  stripeEventId: text("stripe_event_id").notNull().unique(),
  eventType: text("event_type").notNull(),
  processed: boolean("processed").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull()
})
