import {
  SendMessageBatchCommand,
  type SendMessageBatchRequestEntry,
  SQSClient
} from "@aws-sdk/client-sqs"
import { WORKER_QUEUE_URL } from "../config"
import type { WorkerMessage } from "../types"

/** SQS バッチ送信の最大メッセージ数 */
const MAX_BATCH_SIZE = 10

/**
 * SQS クライアントラッパー
 * Worker Queue へのメッセージ送信を行う
 */
export class SqsQueueClient {
  private readonly client: SQSClient
  private readonly queueUrl: string

  constructor() {
    this.client = new SQSClient({})
    this.queueUrl = WORKER_QUEUE_URL
  }

  /**
   * Worker Queue にメッセージをバッチ送信
   * @param messages 送信するメッセージリスト
   */
  async sendBatch(messages: WorkerMessage[]): Promise<void> {
    if (messages.length === 0) {
      return
    }

    // MAX_BATCH_SIZE ごとに分割して送信
    for (let i = 0; i < messages.length; i += MAX_BATCH_SIZE) {
      const batch = messages.slice(i, i + MAX_BATCH_SIZE)
      await this.sendBatchInternal(batch)
    }
  }

  /**
   * 内部バッチ送信（最大10メッセージ）
   */
  private async sendBatchInternal(messages: WorkerMessage[]): Promise<void> {
    const entries: SendMessageBatchRequestEntry[] = messages.map(
      (message, index) => ({
        Id: `msg-${index}-${message.batchId}`,
        MessageBody: JSON.stringify(message)
        // メッセージグループIDを設定（FIFO Queueの場合）
        // MessageGroupId: message.notificationId,
        // 重複排除ID（FIFO Queueの場合）
        // MessageDeduplicationId: `${message.notificationId}-${message.batchId}`
      })
    )

    const command = new SendMessageBatchCommand({
      QueueUrl: this.queueUrl,
      Entries: entries
    })

    try {
      const result = await this.client.send(command)

      if (result.Failed && result.Failed.length > 0) {
        console.error("Some messages failed to send:", result.Failed)
        throw new Error(
          `Failed to send ${result.Failed.length} messages to SQS`
        )
      }

      console.log(`Successfully sent ${messages.length} messages to SQS`)
    } catch (error) {
      console.error("Failed to send messages to SQS:", error)
      throw error
    }
  }
}
