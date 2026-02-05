import type { AudienceType, NotificationStatus } from "./config"

/**
 * EventBridge Schedulerからのイベントペイロード
 */
export interface FanoutEvent {
  notificationId: string
}

/**
 * Worker Queue に投入するメッセージ形式
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
  audienceType: AudienceType
  audiencePayload: Record<string, unknown> | null
  status: NotificationStatus
  schedulerName: string | null
  createdAt: Date
  updatedAt: Date
}

/**
 * ユーザー情報（抽出用）
 */
export interface UserRecord {
  id: string
  email: string
}
