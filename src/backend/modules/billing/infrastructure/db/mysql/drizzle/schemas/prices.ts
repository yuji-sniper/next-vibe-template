import { relations, sql } from "drizzle-orm"
import {
  boolean,
  foreignKey,
  int,
  json,
  mysqlTable,
  text,
  timestamp,
  varchar
} from "drizzle-orm/mysql-core"
import { products } from "./products"

export const PRICES_CONSTRAINTS = {
  PRODUCT_ID_FOREIGN_KEY: "prices_product_id_products_id_fk"
} as const

export const prices = mysqlTable(
  "prices",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    productId: varchar("product_id", { length: 36 }).notNull(),
    stripePriceId: varchar("stripe_price_id", { length: 255 }).unique(),
    currency: text("currency").notNull(),
    unitAmount: int("unit_amount").notNull(),
    recurringInterval: text("recurring_interval"),
    recurringIntervalCount: int("recurring_interval_count").default(1),
    type: text("type").notNull(),
    active: boolean("active").notNull().default(true),
    metadata: json("metadata").$type<Record<string, string> | null>(),
    displayName: text("display_name"),
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
      columns: [table.productId],
      foreignColumns: [products.id],
      name: PRICES_CONSTRAINTS.PRODUCT_ID_FOREIGN_KEY
    }).onDelete("cascade")
  ]
)

export const pricesRelations = relations(prices, ({ one }) => ({
  product: one(products, {
    fields: [prices.productId],
    references: [products.id]
  })
}))
