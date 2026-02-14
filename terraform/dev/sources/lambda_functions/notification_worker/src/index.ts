import type { SQSBatchResponse, SQSEvent, SQSRecord } from "aws-lambda"
import { z } from "zod"
import { getDb } from "./db/connection"
import { WorkerHandler } from "./handler"
import type { WorkerMessage } from "./types"

/**
 * WorkerMessage のスキーマ定義
 */
const workerMessageSchema = z.object({
  notificationId: z.string().min(1),
  batchId: z.string().min(1),
  userIds: z.array(z.string().min(1)),
  cursorUserId: z.string().min(1)
})

/**
 * Lambda ハンドラー
 * SQS から呼び出されるエントリポイント
 * 部分的バッチ応答に対応（成功したメッセージはキューから削除）
 */
export async function handler(event: SQSEvent): Promise<SQSBatchResponse> {
  console.log("Received SQS event:", JSON.stringify(event, null, 2))

  const db = getDb()
  const workerHandler = new WorkerHandler(db)

  const batchItemFailures: SQSBatchResponse["batchItemFailures"] = []

  // 各メッセージを処理
  for (const record of event.Records) {
    const messageId = record.messageId

    try {
      const message = parseMessage(record)

      if (!message) {
        console.error(`Invalid message format: ${record.body}`)
        // 不正なメッセージはスキップ（再試行しない）
        continue
      }

      await workerHandler.handle(message)
      console.log(`Successfully processed message: ${messageId}`)
    } catch (error) {
      console.error(`Failed to process message ${messageId}:`, error)
      // 失敗したメッセージを記録（SQS再試行対象）
      batchItemFailures.push({ itemIdentifier: messageId })
    }
  }

  // 部分的バッチ応答を返す
  // batchItemFailures に含まれるメッセージのみSQS再試行される
  return { batchItemFailures }
}

/**
 * SQSレコードからメッセージをパース
 */
function parseMessage(record: SQSRecord): WorkerMessage | null {
  try {
    const body = JSON.parse(record.body)
    const result = workerMessageSchema.safeParse(body)

    if (!result.success) {
      console.error("Message validation failed:", result.error.flatten())
      return null
    }

    return result.data
  } catch (error) {
    console.error("Failed to parse message body:", error)
    return null
  }
}
