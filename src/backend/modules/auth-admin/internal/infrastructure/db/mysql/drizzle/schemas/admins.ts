import { relations, sql } from "drizzle-orm"
import {
  boolean,
  index,
  mysqlTable,
  text,
  timestamp,
  varchar
} from "drizzle-orm/mysql-core"
import { v7 } from "uuid"

export const admins = mysqlTable("admins", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => v7()),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at", { fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull()
})

export const admin_sessions = mysqlTable(
  "admin_sessions",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => v7()),
    expiresAt: timestamp("expires_at", { fsp: 3 }).notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at", { fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => admins.id, { onDelete: "cascade" })
  },
  (table) => [index("admin_sessions_userId_idx").on(table.userId)]
)

export const admin_accounts = mysqlTable(
  "admin_accounts",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => v7()),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => admins.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { fsp: 3 }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { fsp: 3 }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull()
  },
  (table) => [index("admin_accounts_userId_idx").on(table.userId)]
)

export const admin_verifications = mysqlTable(
  "admin_verifications",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => v7()),
    identifier: varchar("identifier", { length: 255 }).notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { fsp: 3 }).notNull(),
    createdAt: timestamp("created_at", { fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull()
  },
  (table) => [index("admin_verifications_identifier_idx").on(table.identifier)]
)

export const adminsRelations = relations(admins, ({ many }) => ({
  admin_sessions: many(admin_sessions),
  admin_accounts: many(admin_accounts)
}))

export const admin_sessionsRelations = relations(admin_sessions, ({ one }) => ({
  admins: one(admins, {
    fields: [admin_sessions.userId],
    references: [admins.id]
  })
}))

export const admin_accountsRelations = relations(admin_accounts, ({ one }) => ({
  admins: one(admins, {
    fields: [admin_accounts.userId],
    references: [admins.id]
  })
}))
