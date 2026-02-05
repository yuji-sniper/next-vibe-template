import { relations, sql } from "drizzle-orm"
import {
  datetime,
  foreignKey,
  index,
  mysqlTable,
  smallint,
  text,
  tinyint,
  uniqueIndex,
  varchar
} from "drizzle-orm/mysql-core"
import type { DeliveryStatus } from "@/backend/modules/notification/internal/domain/delivery/delivery"
import { notifications } from "./notifications"

/**
 * DeliveryStatus - 配信ステータス番号体系
 * 1xx = 初期/保留
 *   100 = pending（保留）
 * 2xx = 処理中
 *   200 = sending（送信中）
 *   210 = retrying（リトライ中）※将来用
 * 3xx = 成功
 *   300 = sent（送信済み）
 * 4xx = 失敗
 *   400 = failed（失敗）
 *   410 = bounced（バウンス）※将来用
 *   420 = complained（苦情）※将来用
 * 5xx = 抑制/スキップ
 *   500 = suppressed（抑制）
 *   510 = unsubscribed（配信停止）※将来用
 */

export const NOTIFICATION_DELIVERIES_CONSTRAINTS = {
  NOTIFICATION_ID_FOREIGN_KEY:
    "notification_deliveries_notification_id_notifications_id_fk",
  NOTIFICATION_ID_USER_ID_UNIQUE:
    "notification_deliveries_notification_id_user_id_unique"
} as const

export const notificationDeliveries = mysqlTable(
  "notification_deliveries",
  {
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
      .$onUpdate(() => new Date())
  },
  (table) => [
    foreignKey({
      columns: [table.notificationId],
      foreignColumns: [notifications.id],
      name: NOTIFICATION_DELIVERIES_CONSTRAINTS.NOTIFICATION_ID_FOREIGN_KEY
    }).onDelete("cascade"),
    uniqueIndex(
      NOTIFICATION_DELIVERIES_CONSTRAINTS.NOTIFICATION_ID_USER_ID_UNIQUE
    ).on(table.notificationId, table.userId),
    index("idx_notification_batch").on(table.notificationId, table.batchId),
    index("idx_notification_status").on(table.notificationId, table.status),
    index("idx_status_updated").on(table.status, table.updatedAt)
  ]
)

export const notificationDeliveriesRelations = relations(
  notificationDeliveries,
  ({ one }) => ({
    notification: one(notifications, {
      fields: [notificationDeliveries.notificationId],
      references: [notifications.id]
    })
  })
)
