import { relations } from "drizzle-orm"
import {
  foreignKey,
  index,
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
    stripeInvoiceId: text("stripe_invoice_id").notNull().unique(),
    amount: int("amount").notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default("jpy"),
    status: text("status").notNull(),
    paidAt: timestamp("paid_at", { fsp: 3 }),
    createdAt: timestamp("created_at", { fsp: 3 }).notNull().defaultNow()
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
    }).onDelete("set null"),
    index("idx_invoices_customer_id").on(table.customerId),
    index("idx_invoices_subscription_id").on(table.subscriptionId)
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
