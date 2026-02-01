import { relations } from "drizzle-orm"
import {
  boolean,
  foreignKey,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar
} from "drizzle-orm/pg-core"
import { products } from "./products"

export const PRICES_CONSTRAINTS = {
  PRODUCT_ID_FOREIGN_KEY: "prices_product_id_products_id_fk"
} as const

export const prices = pgTable(
  "prices",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    productId: varchar("product_id", { length: 36 }).notNull(),
    stripePriceId: text("stripe_price_id").unique(),
    currency: text("currency").notNull().default("jpy"),
    unitAmount: integer("unit_amount").notNull(),
    recurringInterval: text("recurring_interval"),
    recurringIntervalCount: integer("recurring_interval_count").default(1),
    type: text("type").notNull(),
    active: boolean("active").notNull().default(true),
    metadata: jsonb("metadata").$type<Record<string, string> | null>(),
    displayName: text("display_name"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  (table) => [
    foreignKey({
      columns: [table.productId],
      foreignColumns: [products.id],
      name: PRICES_CONSTRAINTS.PRODUCT_ID_FOREIGN_KEY
    }).onDelete("cascade"),
    index("idx_prices_product_id").on(table.productId),
    index("idx_prices_stripe_price_id").on(table.stripePriceId),
    index("idx_prices_active").on(table.active)
  ]
)

export const pricesRelations = relations(prices, ({ one }) => ({
  product: one(products, {
    fields: [prices.productId],
    references: [products.id]
  })
}))
