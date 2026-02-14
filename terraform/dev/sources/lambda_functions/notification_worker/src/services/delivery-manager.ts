import { and, eq, sql } from "drizzle-orm"
import type { MySql2Database } from "drizzle-orm/mysql2"
import { v7 as uuidv7 } from "uuid"
import { DeliveryStatus } from "../config"
import { notificationDeliveries } from "../db/schemas"
import type { DeliveryResult, PendingDelivery, UserRecord } from "../types"

/**
 * 配信レコード管理サービス
 * batch_id方式で冪等性を確保しつつ配信レコードを管理
 */
export class DeliveryManager {
  constructor(private readonly db: MySql2Database) {}

  /**
   * 配信レコードをバルク確保（冪等性の核）
   * 同一(notification_id, user_id)が既に存在する場合は上書きしない
   * @param notificationId 通知ID
   * @param users ユーザー情報の配列
   * @param batchId 今回のワーカーのバッチID
   */
  async reserveDeliveries(
    notificationId: string,
    users: UserRecord[],
    batchId: string
  ): Promise<void> {
    if (users.length === 0) {
      return
    }

    // バルクINSERT用のVALUES句を構築
    const values = users.map((user) => ({
      id: uuidv7(),
      notificationId,
      userId: user.id,
      email: user.email,
      status: DeliveryStatus.PENDING,
      attemptCount: 0,
      batchId,
      createdAt: new Date(),
      updatedAt: new Date()
    }))

    // ON DUPLICATE KEY UPDATE で既存行を更新しない（updated_atを自己代入）
    // これにより既存行のbatch_idを汚さず、新規INSERTされた行のみ今回のbatch_idを持つ
    await this.db
      .insert(notificationDeliveries)
      .values(values)
      .onDuplicateKeyUpdate({
        set: {
          // 何もしない（既存行のbatch_id等を汚さない）
          updatedAt: sql`${notificationDeliveries.updatedAt}`
        }
      })

    console.log(
      `Reserved ${users.length} deliveries for notification ${notificationId} with batchId ${batchId}`
    )
  }

  /**
   * 今回のbatch_idでINSERTできた行（送信対象）を取得
   * @param notificationId 通知ID
   * @param batchId バッチID
   * @returns 送信対象の配信情報
   */
  async getPendingByBatchId(
    notificationId: string,
    batchId: string
  ): Promise<PendingDelivery[]> {
    const result = await this.db
      .select({
        id: notificationDeliveries.id,
        userId: notificationDeliveries.userId,
        email: notificationDeliveries.email
      })
      .from(notificationDeliveries)
      .where(
        and(
          eq(notificationDeliveries.notificationId, notificationId),
          eq(notificationDeliveries.batchId, batchId),
          eq(notificationDeliveries.status, DeliveryStatus.PENDING)
        )
      )

    return result
  }

  /**
   * 送信中（SENDING）状態に遷移
   * @param notificationId 通知ID
   * @param batchId バッチID
   */
  async markAsSending(notificationId: string, batchId: string): Promise<void> {
    await this.db
      .update(notificationDeliveries)
      .set({
        status: DeliveryStatus.SENDING,
        attemptCount: sql`${notificationDeliveries.attemptCount} + 1`,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(notificationDeliveries.notificationId, notificationId),
          eq(notificationDeliveries.batchId, batchId),
          eq(notificationDeliveries.status, DeliveryStatus.PENDING)
        )
      )

    console.log(
      `Marked deliveries as SENDING for notification ${notificationId} with batchId ${batchId}`
    )
  }

  /**
   * 複数の配信結果をバルク更新
   * JSON_TABLE を使った単一 UPDATE 文で一括処理（MySQL 8.0+）
   * @param results 配信結果の配列
   */
  async bulkUpdateResults(results: DeliveryResult[]): Promise<void> {
    if (results.length === 0) {
      return
    }

    // transient は DB 更新しない（SQS再試行に任せる）
    const updateTargets = results.filter(
      (r): r is Exclude<DeliveryResult, { type: "transient" }> =>
        r.type !== "transient"
    )

    if (updateTargets.length === 0) {
      return
    }

    // ステータス別にカウント（ログ用）
    const sentCount = updateTargets.filter((r) => r.type === "sent").length
    const failedCount = updateTargets.filter((r) => r.type === "failed").length
    const suppressedCount = updateTargets.filter(
      (r) => r.type === "suppressed"
    ).length

    // 更新データを構築
    const updateRows = updateTargets.map((result) => {
      switch (result.type) {
        case "sent":
          return {
            id: result.deliveryId,
            status: DeliveryStatus.SENT,
            ses_message_id: result.sesMessageId,
            last_error: null,
            sent_at: new Date().toISOString().slice(0, 23).replace("T", " ")
          }
        case "failed":
          return {
            id: result.deliveryId,
            status: DeliveryStatus.FAILED,
            ses_message_id: null,
            last_error: result.error,
            sent_at: null
          }
        case "suppressed":
          return {
            id: result.deliveryId,
            status: DeliveryStatus.SUPPRESSED,
            ses_message_id: null,
            last_error: result.reason,
            sent_at: null
          }
        default: {
          const _exhaustive: never = result
          throw new Error(`Unknown result type: ${_exhaustive}`)
        }
      }
    })

    // UNION ALL 派生テーブルを使った UPDATE（TiDB互換）
    const rows = updateRows.map(
      (row) =>
        sql`SELECT ${row.id} AS id, ${row.status} AS status, ${row.ses_message_id} AS ses_message_id, ${row.last_error} AS last_error, CAST(${row.sent_at} AS DATETIME(3)) AS sent_at`
    )
    const unionAll = sql.join(rows, sql` UNION ALL `)

    await this.db.execute(sql`
      UPDATE notification_deliveries nd
      JOIN (${unionAll}) AS src ON nd.id = src.id
      SET
        nd.status = src.status,
        nd.ses_message_id = COALESCE(src.ses_message_id, nd.ses_message_id),
        nd.last_error = COALESCE(src.last_error, nd.last_error),
        nd.sent_at = COALESCE(src.sent_at, nd.sent_at),
        nd.updated_at = NOW(3)
    `)

    console.log(
      `Bulk updated ${updateTargets.length} deliveries: sent=${sentCount}, failed=${failedCount}, suppressed=${suppressedCount}`
    )
  }
}
