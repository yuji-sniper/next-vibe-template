import { relations } from "drizzle-orm"
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar
} from "drizzle-orm/pg-core"
import { prices } from "./prices"

export const products = pgTable(
  "products",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    stripeProductId: text("stripe_product_id").unique(),
    name: text("name").notNull(),
    description: text("description"),
    active: boolean("active").notNull().default(true),
    metadata: jsonb("metadata").$type<Record<string, string> | null>(),
    displayOrder: integer("display_order").default(0),
    features: jsonb("features").$type<string[] | null>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  (table) => [
    index("idx_products_stripe_product_id").on(table.stripeProductId),
    index("idx_products_active").on(table.active)
  ]
)

export const productsRelations = relations(products, ({ many }) => ({
  prices: many(prices)
}))
