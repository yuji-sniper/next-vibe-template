import { relations, sql } from "drizzle-orm"
import {
  foreignKey,
  int,
  mysqlTable,
  text,
  timestamp,
  varchar
} from "drizzle-orm/mysql-core"
import { customers } from "./customers"
import { subscriptions } from "./subscriptions"

export const INVOICES_CONSTRAINTS = {
  CUSTOMER_ID_FOREIGN_KEY: "invoices_customer_id_customers_id_fk",
  SUBSCRIPTION_ID_FOREIGN_KEY: "invoices_subscription_id_subscriptions_id_fk"
} as const

export const invoices = mysqlTable(
  "invoices",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    customerId: varchar("customer_id", { length: 36 }).notNull(),
    subscriptionId: varchar("subscription_id", { length: 36 }),
    stripeInvoiceId: varchar("stripe_invoice_id", { length: 255 })
      .notNull()
      .unique(),
    amount: int("amount").notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    status: text("status").notNull(),
    paidAt: timestamp("paid_at", { fsp: 3 }),
    createdAt: timestamp("created_at", { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`)
  },
  (table) => [
    foreignKey({
      columns: [table.customerId],
      foreignColumns: [customers.id],
      name: INVOICES_CONSTRAINTS.CUSTOMER_ID_FOREIGN_KEY
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.subscriptionId],
      foreignColumns: [subscriptions.id],
      name: INVOICES_CONSTRAINTS.SUBSCRIPTION_ID_FOREIGN_KEY
    }).onDelete("set null")
  ]
)

export const invoicesRelations = relations(invoices, ({ one }) => ({
  customer: one(customers, {
    fields: [invoices.customerId],
    references: [customers.id]
  }),
  subscription: one(subscriptions, {
    fields: [invoices.subscriptionId],
    references: [subscriptions.id]
  })
}))
