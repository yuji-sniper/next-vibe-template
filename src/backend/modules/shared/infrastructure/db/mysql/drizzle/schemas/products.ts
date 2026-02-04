import { relations, sql } from "drizzle-orm"
import {
  boolean,
  int,
  json,
  mysqlTable,
  text,
  timestamp,
  varchar
} from "drizzle-orm/mysql-core"
import { prices } from "./prices"

export const products = mysqlTable("products", {
  id: varchar("id", { length: 36 }).primaryKey(),
  stripeProductId: varchar("stripe_product_id", { length: 255 }).unique(),
  name: text("name").notNull(),
  description: text("description"),
  active: boolean("active").notNull().default(true),
  metadata: json("metadata").$type<Record<string, string> | null>(),
  displayOrder: int("display_order").default(0),
  features: json("features").$type<string[] | null>(),
  createdAt: timestamp("created_at", { fsp: 3 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .$onUpdate(() => new Date())
})

export const productsRelations = relations(products, ({ many }) => ({
  prices: many(prices)
}))
