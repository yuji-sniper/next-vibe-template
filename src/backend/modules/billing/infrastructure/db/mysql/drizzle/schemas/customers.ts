import { relations, sql } from "drizzle-orm"
import { mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core"
import { payments } from "./payments"
import { subscriptions } from "./subscriptions"

export const customers = mysqlTable("customers", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 })
    .notNull()
    .unique(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at", { fsp: 3 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .$onUpdate(() => new Date())
})

export const customersRelations = relations(customers, ({ many }) => ({
  payments: many(payments),
  subscriptions: many(subscriptions)
}))
