import { eq } from "drizzle-orm"
import type { MySql2Database } from "drizzle-orm/mysql2"
import { notifications } from "./db/schemas"
import { DeliveryManager } from "./services/delivery-manager"
import { SesSender } from "./services/ses-sender"
import { UserRepository } from "./services/user-repository"
import type {
  BulkEmailEntry,
  DeliveryResult,
  NotificationRecord,
  PendingDelivery,
  WorkerMessage
} from "./types"

/**
 * Worker Lambda のメイン処理ハンドラー
 * SQSから受け取ったメッセージを処理し、SES経由でメール送信
 */
export class WorkerHandler {
  private readonly deliveryManager: DeliveryManager
  private readonly userRepository: UserRepository
  private readonly sesSender: SesSender

  constructor(private readonly db: MySql2Database) {
    this.deliveryManager = new DeliveryManager(db)
    this.userRepository = new UserRepository(db)
    this.sesSender = new SesSender()
  }

  /**
   * メッセージを処理
   * @param message SQSから受け取ったメッセージ
   * @throws 一時的エラーの場合はエラーをスローしてSQS再試行
   */
  async handle(message: WorkerMessage): Promise<void> {
    const { notificationId, batchId, userIds } = message

    console.log(
      `Processing message: notificationId=${notificationId}, batchId=${batchId}, userCount=${userIds.length}`
    )

    // 1. 通知情報を取得
    const notification = await this.fetchNotification(notificationId)
    if (!notification) {
      console.error(`Notification not found: ${notificationId}`)
      return
    }

    // 2. ユーザー情報を取得
    const users = await this.userRepository.findByIds(userIds)
    if (users.length === 0) {
      console.warn(`No users found for IDs: ${userIds.join(", ")}`)
      return
    }

    console.log(`Found ${users.length} users for ${userIds.length} IDs`)

    // 3. 配信レコードをバルク確保（batch_id方式）
    await this.deliveryManager.reserveDeliveries(notificationId, users, batchId)

    // 4. 今回のbatch_idでINSERTできた行だけ取得
    const pendingDeliveries = await this.deliveryManager.getPendingByBatchId(
      notificationId,
      batchId
    )

    if (pendingDeliveries.length === 0) {
      console.log(
        `No pending deliveries for notification ${notificationId} with batchId ${batchId} (already processed)`
      )
      return
    }

    console.log(
      `Found ${pendingDeliveries.length} pending deliveries to process`
    )

    // 5. SENDING状態に遷移
    await this.deliveryManager.markAsSending(notificationId, batchId)

    // 6. SES送信
    const hasTransientError = await this.sendEmails(
      notification,
      pendingDeliveries
    )

    // 7. 一時的エラーがあった場合はエラーをスローしてSQS再試行
    if (hasTransientError) {
      throw new Error(
        `Transient error occurred while sending emails for notification ${notificationId}`
      )
    }

    console.log(
      `Completed processing for notification ${notificationId} with batchId ${batchId}`
    )
  }

  /**
   * 通知情報を取得
   */
  private async fetchNotification(
    notificationId: string
  ): Promise<NotificationRecord | null> {
    const result = await this.db
      .select()
      .from(notifications)
      .where(eq(notifications.id, notificationId))
      .limit(1)

    if (result.length === 0) {
      return null
    }

    return result[0]
  }

  /**
   * メール送信処理（バルク送信）
   * @param notification 通知情報
   * @param deliveries 送信対象の配信情報
   * @returns 一時的エラーが発生した場合 true
   */
  private async sendEmails(
    notification: NotificationRecord,
    deliveries: PendingDelivery[]
  ): Promise<boolean> {
    // PendingDelivery を BulkEmailEntry に変換
    const entries: BulkEmailEntry[] = deliveries.map((d) => ({
      deliveryId: d.id,
      email: d.email
    }))

    // バルク送信（内部で50件ずつチャンク分割される）
    const bulkResults = await this.sesSender.sendBulkEmail(
      entries,
      notification.subject,
      notification.bodyText,
      notification.bodyHtml
    )

    // BulkSendResultEntry を DeliveryResult に変換
    const results: DeliveryResult[] = []
    let hasTransientError = false

    for (const { deliveryId, result } of bulkResults) {
      switch (result.type) {
        case "success":
          results.push({
            type: "sent",
            deliveryId,
            sesMessageId: result.messageId
          })
          console.log(
            `Email sent (deliveryId: ${deliveryId}, messageId: ${result.messageId})`
          )
          break

        case "transient":
          hasTransientError = true
          results.push({ type: "transient", deliveryId })
          console.warn(
            `Transient error for deliveryId ${deliveryId}: ${result.error}`
          )
          break

        case "permanent":
          results.push({
            type: "failed",
            deliveryId,
            error: result.error
          })
          console.error(
            `Permanent error for deliveryId ${deliveryId}: ${result.error}`
          )
          break

        case "suppressed":
          results.push({
            type: "suppressed",
            deliveryId,
            reason: result.reason
          })
          console.warn(
            `Suppressed for deliveryId ${deliveryId}: ${result.reason}`
          )
          break
      }
    }

    // バルク更新
    await this.deliveryManager.bulkUpdateResults(results)

    return hasTransientError
  }
}
