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

export const PAYMENTS_CONSTRAINTS = {
  CUSTOMER_ID_FOREIGN_KEY: "payments_customer_id_customers_id_fk"
} as const

export const payments = mysqlTable(
  "payments",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    customerId: varchar("customer_id", { length: 36 }).notNull(),
    stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 })
      .notNull()
      .unique(),
    amount: int("amount").notNull(),
    currency: text("currency").notNull(),
    status: text("status").notNull(),
    createdAt: timestamp("created_at", { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`)
  },
  (table) => [
    foreignKey({
      columns: [table.customerId],
      foreignColumns: [customers.id],
      name: PAYMENTS_CONSTRAINTS.CUSTOMER_ID_FOREIGN_KEY
    }).onDelete("cascade")
  ]
)

export const paymentsRelations = relations(payments, ({ one }) => ({
  customer: one(customers, {
    fields: [payments.customerId],
    references: [customers.id]
  })
}))
