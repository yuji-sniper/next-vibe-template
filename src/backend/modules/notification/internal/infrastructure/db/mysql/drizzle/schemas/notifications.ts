import { relations, sql } from "drizzle-orm"
import {
  datetime,
  index,
  json,
  mediumtext,
  mysqlTable,
  smallint,
  tinyint,
  varchar
} from "drizzle-orm/mysql-core"
import type {
  AudienceType,
  NotificationStatus
} from "@/backend/modules/notification/internal/domain/notification/notification"
import { notificationDeliveries } from "./notification-deliveries"

/**
 * NotificationStatus - 通知ステータス番号体系
 * 1xx = 初期/予約
 *   100 = scheduled（予約済み）
 * 2xx = 処理中
 *   200 = processing（処理中）※将来用
 * 3xx = 成功
 *   300 = completed（完了）
 * 4xx = キャンセル/失敗
 *   400 = cancelled（キャンセル）
 */

/**
 * AudienceType - 対象タイプ
 * 1 = all（全ユーザー）
 * 2 = segment（セグメント指定）
 * 3 = single（個別指定）
 */

export const notifications = mysqlTable(
  "notifications",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    subject: varchar("subject", { length: 255 }).notNull(),
    bodyText: mediumtext("body_text").notNull(),
    bodyHtml: mediumtext("body_html"),
    sendAt: datetime("send_at", { fsp: 3 }).notNull(),
    audienceType: tinyint("audience_type").notNull().$type<AudienceType>(),
    audiencePayload: json("audience_payload").$type<Record<
      string,
      unknown
    > | null>(),
    status: smallint("status")
      .notNull()
      .default(100)
      .$type<NotificationStatus>(),
    schedulerName: varchar("scheduler_name", { length: 255 }),
    createdAt: datetime("created_at", { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`),
    updatedAt: datetime("updated_at", { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .$onUpdate(() => new Date())
  },
  (table) => [
    index("idx_notifications_send_at").on(table.sendAt),
    index("idx_notifications_status_send_at").on(table.status, table.sendAt)
  ]
)

export const notificationsRelations = relations(notifications, ({ many }) => ({
  deliveries: many(notificationDeliveries)
}))
