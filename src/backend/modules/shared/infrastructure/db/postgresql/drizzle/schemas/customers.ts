import { relations } from "drizzle-orm"
import {
  foreignKey,
  index,
  pgTable,
  text,
  timestamp,
  varchar
} from "drizzle-orm/pg-core"
import { payments } from "./payments"
import { subscriptions } from "./subscriptions"
import { users } from "./users"

export const CUSTOMERS_CONSTRAINTS = {
  USER_ID_FOREIGN_KEY: "customers_user_id_users_id_fk"
} as const

export const customers = pgTable(
  "customers",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: varchar("user_id", { length: 36 }).notNull(),
    stripeCustomerId: text("stripe_customer_id").notNull().unique(),
    email: text("email").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: CUSTOMERS_CONSTRAINTS.USER_ID_FOREIGN_KEY
    }).onDelete("cascade"),
    index("idx_customers_user_id").on(table.userId)
  ]
)

export const customersRelations = relations(customers, ({ one, many }) => ({
  user: one(users, {
    fields: [customers.userId],
    references: [users.id]
  }),
  payments: many(payments),
  subscriptions: many(subscriptions)
}))
