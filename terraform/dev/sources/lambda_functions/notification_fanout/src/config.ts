/** 1回のDB抽出で取得するユーザー数 */
export const PAGE_SIZE = 1000

/** 1SQSメッセージあたりのユーザー数 */
export const CHUNK_SIZE = 100

/** Worker Queue URL（環境変数から取得） */
export const WORKER_QUEUE_URL = process.env.WORKER_QUEUE_URL ?? ""

/** DB接続設定（環境変数から取得） */
export const DB_CONFIG = {
  host: process.env.DB_HOST ?? "",
  port: Number(process.env.DB_PORT ?? "3306"),
  user: process.env.DB_USER ?? "",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME ?? ""
}

/** NotificationStatus - 通知ステータス */
export const NotificationStatus = {
  SCHEDULED: 100,
  PROCESSING: 200,
  COMPLETED: 300,
  CANCELLED: 400
} as const

export type NotificationStatus =
  (typeof NotificationStatus)[keyof typeof NotificationStatus]

/** AudienceType - 対象タイプ */
export const AudienceType = {
  ALL: 1,
  SEGMENT: 2,
  SINGLE: 3
} as const

export type AudienceType = (typeof AudienceType)[keyof typeof AudienceType]
