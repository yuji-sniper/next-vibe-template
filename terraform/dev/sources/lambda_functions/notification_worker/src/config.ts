/**
 * Worker Lambda 設定
 */

/** 送信元メールアドレス（環境変数から取得） */
export const FROM_EMAIL = process.env.FROM_EMAIL ?? ""

/** 送信元表示名 */
export const FROM_NAME = "Next Vibe Template"

/** SESリージョン（環境変数から取得） */
export const SES_REGION = "ap-northeast-1"

/** 最大リトライ回数 */
export const MAX_RETRY_ATTEMPTS = 3

/** DB接続設定（環境変数から取得） */
export const DB_CONFIG = {
  host: process.env.DB_HOST ?? "",
  port: Number(process.env.DB_PORT ?? "3306"),
  user: process.env.DB_USER ?? "",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME ?? ""
}

/** DeliveryStatus - 配信ステータス */
export const DeliveryStatus = {
  /** 100: 保留 */
  PENDING: 100,
  /** 200: 送信中 */
  SENDING: 200,
  /** 300: 送信済み */
  SENT: 300,
  /** 400: 失敗 */
  FAILED: 400,
  /** 500: 抑制 */
  SUPPRESSED: 500
} as const

export type DeliveryStatus =
  (typeof DeliveryStatus)[keyof typeof DeliveryStatus]

/** NotificationStatus - 通知ステータス */
export const NotificationStatus = {
  SCHEDULED: 100,
  PROCESSING: 200,
  COMPLETED: 300,
  CANCELLED: 400
} as const

export type NotificationStatus =
  (typeof NotificationStatus)[keyof typeof NotificationStatus]
