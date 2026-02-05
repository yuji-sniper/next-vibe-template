import { sql } from "drizzle-orm"
import {
  boolean,
  datetime,
  json,
  mediumtext,
  mysqlTable,
  smallint,
  text,
  timestamp,
  tinyint,
  varchar
} from "drizzle-orm/mysql-core"
import type { DeliveryStatus, NotificationStatus } from "../config"

/**
 * notifications テーブルスキーマ
 */
export const notifications = mysqlTable("notifications", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  bodyText: mediumtext("body_text").notNull(),
  bodyHtml: mediumtext("body_html"),
  sendAt: datetime("send_at", { fsp: 3 }).notNull(),
  audienceType: tinyint("audience_type").notNull(),
  audiencePayload: json("audience_payload").$type<Record<
    string,
    unknown
  > | null>(),
  status: smallint("status").notNull().default(100).$type<NotificationStatus>(),
  schedulerName: varchar("scheduler_name", { length: 255 }),
  createdAt: datetime("created_at", { fsp: 3 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`),
  updatedAt: datetime("updated_at", { fsp: 3 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`)
})

/**
 * notification_deliveries テーブルスキーマ
 */
export const notificationDeliveries = mysqlTable("notification_deliveries", {
  id: varchar("id", { length: 36 }).primaryKey(),
  notificationId: varchar("notification_id", { length: 36 }).notNull(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  status: smallint("status").notNull().default(100).$type<DeliveryStatus>(),
  attemptCount: tinyint("attempt_count").notNull().default(0),
  lastError: text("last_error"),
  sesMessageId: varchar("ses_message_id", { length: 255 }),
  sentAt: datetime("sent_at", { fsp: 3 }),
  batchId: varchar("batch_id", { length: 36 }),
  createdAt: datetime("created_at", { fsp: 3 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`),
  updatedAt: datetime("updated_at", { fsp: 3 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`)
})

/**
 * users テーブルスキーマ
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at", { fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull()
})
