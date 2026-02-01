import { relations } from "drizzle-orm"
import {
  boolean,
  index,
  int,
  json,
  mysqlTable,
  text,
  timestamp,
  varchar
} from "drizzle-orm/mysql-core"
import { prices } from "./prices"

export const products = mysqlTable(
  "products",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    stripeProductId: text("stripe_product_id").unique(),
    name: text("name").notNull(),
    description: text("description"),
    active: boolean("active").notNull().default(true),
    metadata: json("metadata").$type<Record<string, string> | null>(),
    displayOrder: int("display_order").default(0),
    features: json("features").$type<string[] | null>(),
    createdAt: timestamp("created_at", { fsp: 3 }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { fsp: 3 })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date())
  },
  (table) => [
    index("idx_products_stripe_product_id").on(table.stripeProductId),
    index("idx_products_active").on(table.active)
  ]
)

export const productsRelations = relations(products, ({ many }) => ({
  prices: many(prices)
}))
