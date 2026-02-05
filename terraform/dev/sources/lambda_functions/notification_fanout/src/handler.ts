import { and, eq } from "drizzle-orm"
import type { MySql2Database } from "drizzle-orm/mysql2"
import { v7 as uuidv7 } from "uuid"
import { AudienceType, CHUNK_SIZE, NotificationStatus } from "./config"
import { notifications } from "./db/schemas"
import { SqsQueueClient } from "./services/sqs-client"
import { UserExtractor } from "./services/user-extractor"
import type { FanoutEvent, NotificationRecord, WorkerMessage } from "./types"

/**
 * Fanout Lambda のメイン処理ハンドラー
 * 対象ユーザーをチャンク抽出して Worker Queue に投入する
 */
export class FanoutHandler {
  private readonly userExtractor: UserExtractor
  private readonly sqsClient: SqsQueueClient

  constructor(private readonly db: MySql2Database) {
    this.userExtractor = new UserExtractor(db)
    this.sqsClient = new SqsQueueClient()
  }

  /**
   * イベントを処理
   * @param event EventBridge Scheduler からのイベント
   */
  async handle(event: FanoutEvent): Promise<void> {
    const { notificationId } = event
    console.log(`Starting fanout for notification: ${notificationId}`)

    // 1. 通知情報を取得
    const notification = await this.fetchNotification(notificationId)
    if (!notification) {
      console.error(`Notification not found: ${notificationId}`)
      return
    }

    // 2. ステータスを PROCESSING に更新（CAS方式: SCHEDULED → PROCESSING）
    //    別の処理（Cancel等）が先に実行された場合は更新されない
    const updated = await this.tryUpdateStatusToProcessing(notificationId)
    if (!updated) {
      console.log(
        `Notification ${notificationId} is no longer SCHEDULED (possibly cancelled or already processing), skipping`
      )
      return
    }

    try {
      // 3. 対象ユーザーを抽出して SQS に投入
      await this.processUsers(notification)

      // 4. 全ユーザー処理完了したら COMPLETED に更新
      await this.updateNotificationStatus(
        notificationId,
        NotificationStatus.COMPLETED
      )
      console.log(`Fanout completed for notification: ${notificationId}`)
    } catch (error) {
      console.error(`Fanout failed for notification: ${notificationId}`, error)
      // エラー時はステータスを SCHEDULED に戻す（リトライ可能にする）
      await this.updateNotificationStatus(
        notificationId,
        NotificationStatus.SCHEDULED
      )
      throw error
    }
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

    const row = result[0]
    return {
      id: row.id,
      title: row.title,
      subject: row.subject,
      bodyText: row.bodyText,
      bodyHtml: row.bodyHtml,
      sendAt: row.sendAt,
      audienceType: row.audienceType,
      audiencePayload: row.audiencePayload,
      status: row.status,
      schedulerName: row.schedulerName,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }
  }

  /**
   * ステータスを PROCESSING に更新（CAS方式）
   * SCHEDULED 状態の場合のみ更新し、成功したかどうかを返す
   * @returns 更新成功: true, 更新失敗（既に別ステータス）: false
   */
  private async tryUpdateStatusToProcessing(
    notificationId: string
  ): Promise<boolean> {
    const result = await this.db
      .update(notifications)
      .set({ status: NotificationStatus.PROCESSING, updatedAt: new Date() })
      .where(
        and(
          eq(notifications.id, notificationId),
          eq(notifications.status, NotificationStatus.SCHEDULED)
        )
      )

    // mysql2 の戻り値から affectedRows を取得
    const affectedRows = result[0].affectedRows

    if (affectedRows > 0) {
      console.log(`Updated notification ${notificationId} status to PROCESSING`)
      return true
    }

    return false
  }

  /**
   * 通知ステータスを更新
   */
  private async updateNotificationStatus(
    notificationId: string,
    status: NotificationStatus
  ): Promise<void> {
    await this.db
      .update(notifications)
      .set({ status, updatedAt: new Date() })
      .where(eq(notifications.id, notificationId))

    console.log(`Updated notification ${notificationId} status to ${status}`)
  }

  /**
   * 対象ユーザーを抽出して SQS に投入
   */
  private async processUsers(notification: NotificationRecord): Promise<void> {
    let cursor: string | null = null
    let totalProcessed = 0

    // SINGLE タイプは1回で完了
    if (notification.audienceType === AudienceType.SINGLE) {
      const users = await this.userExtractor.extractUsers(notification, null)
      if (users.length > 0) {
        await this.sendUsersToQueue(notification.id, users)
        totalProcessed = users.length
      }
      console.log(`Processed ${totalProcessed} users (SINGLE)`)
      return
    }

    // ALL / SEGMENT はカーソル方式でページング
    while (true) {
      const users = await this.userExtractor.extractUsers(notification, cursor)

      if (users.length === 0) {
        break
      }

      await this.sendUsersToQueue(notification.id, users)
      totalProcessed += users.length

      // 次のカーソルを設定
      cursor = users[users.length - 1].id

      console.log(
        `Processed ${totalProcessed} users so far (cursor: ${cursor})`
      )

      // 取得件数がPAGE_SIZE未満なら終了
      if (users.length < 1000) {
        break
      }
    }

    console.log(`Total processed users: ${totalProcessed}`)
  }

  /**
   * ユーザーをチャンクに分割して SQS に投入
   */
  private async sendUsersToQueue(
    notificationId: string,
    users: { id: string; email: string }[]
  ): Promise<void> {
    const messages: WorkerMessage[] = []

    // CHUNK_SIZE ごとに分割
    for (let i = 0; i < users.length; i += CHUNK_SIZE) {
      const chunk = users.slice(i, i + CHUNK_SIZE)
      const batchId = uuidv7()
      const lastUserId = chunk[chunk.length - 1].id

      messages.push({
        notificationId,
        batchId,
        userIds: chunk.map((u) => u.id),
        cursorUserId: lastUserId
      })
    }

    // SQS にバッチ送信
    await this.sqsClient.sendBatch(messages)
    console.log(
      `Sent ${messages.length} messages to SQS for ${users.length} users`
    )
  }
}
