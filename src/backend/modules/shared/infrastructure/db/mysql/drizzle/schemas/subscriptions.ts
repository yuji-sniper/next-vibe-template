import { relations, sql } from "drizzle-orm"
import {
  boolean,
  foreignKey,
  mysqlTable,
  text,
  timestamp,
  varchar
} from "drizzle-orm/mysql-core"
import { customers } from "./customers"

export const SUBSCRIPTIONS_CONSTRAINTS = {
  CUSTOMER_ID_FOREIGN_KEY: "subscriptions_customer_id_customers_id_fk"
} as const

export const subscriptions = mysqlTable(
  "subscriptions",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    customerId: varchar("customer_id", { length: 36 }).notNull(),
    stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 })
      .notNull()
      .unique(),
    stripePriceId: text("stripe_price_id").notNull(),
    status: text("status").notNull(),
    currentPeriodStart: timestamp("current_period_start", { fsp: 3 }),
    currentPeriodEnd: timestamp("current_period_end", { fsp: 3 }),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
    createdAt: timestamp("created_at", { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`),
    updatedAt: timestamp("updated_at", { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .$onUpdate(() => new Date())
  },
  (table) => [
    foreignKey({
      columns: [table.customerId],
      foreignColumns: [customers.id],
      name: SUBSCRIPTIONS_CONSTRAINTS.CUSTOMER_ID_FOREIGN_KEY
    }).onDelete("cascade")
  ]
)

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  customer: one(customers, {
    fields: [subscriptions.customerId],
    references: [customers.id]
  })
}))
