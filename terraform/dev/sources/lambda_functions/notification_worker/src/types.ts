import type { DeliveryStatus, NotificationStatus } from "./config"

/**
 * SQSから受け取るWorkerメッセージ形式
 */
export interface WorkerMessage {
  notificationId: string
  batchId: string
  userIds: string[]
  cursorUserId: string
}

/**
 * 通知情報
 */
export interface NotificationRecord {
  id: string
  title: string
  subject: string
  bodyText: string
  bodyHtml: string | null
  sendAt: Date
  audienceType: number
  audiencePayload: Record<string, unknown> | null
  status: NotificationStatus
  schedulerName: string | null
  createdAt: Date
  updatedAt: Date
}

/**
 * ユーザー情報
 */
export interface UserRecord {
  id: string
  email: string
}

/**
 * 配信レコード
 */
export interface DeliveryRecord {
  id: string
  notificationId: string
  userId: string
  email: string
  status: DeliveryStatus
  attemptCount: number
  lastError: string | null
  sesMessageId: string | null
  sentAt: Date | null
  batchId: string | null
  createdAt: Date
  updatedAt: Date
}

/**
 * 送信対象の配信情報
 */
export interface PendingDelivery {
  id: string
  userId: string
  email: string
}

/**
 * SES送信結果（単一メール）
 */
export type SendResult =
  | { type: "success"; messageId: string }
  | { type: "transient"; error: string }
  | { type: "permanent"; error: string }
  | { type: "suppressed"; reason: string }

/**
 * バルク送信用の入力
 */
export interface BulkEmailEntry {
  deliveryId: string
  email: string
}

/**
 * バルク送信の結果（各宛先ごと）
 */
export interface BulkSendResultEntry {
  deliveryId: string
  result: SendResult
}

/**
 * 配信処理結果（バルク更新用）
 */
export type DeliveryResult =
  | { type: "sent"; deliveryId: string; sesMessageId: string }
  | { type: "failed"; deliveryId: string; error: string }
  | { type: "suppressed"; deliveryId: string; reason: string }
  | { type: "transient"; deliveryId: string }
