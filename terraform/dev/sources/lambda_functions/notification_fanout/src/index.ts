import type { ScheduledEvent } from "aws-lambda"
import { getDb } from "./db/connection"
import { FanoutHandler } from "./handler"
import type { FanoutEvent } from "./types"

/**
 * Lambda ハンドラー
 * EventBridge Scheduler から呼び出されるエントリポイント
 */
export async function handler(
  event: ScheduledEvent | FanoutEvent
): Promise<void> {
  console.log("Received event:", JSON.stringify(event, null, 2))

  // イベントペイロードを取得
  const fanoutEvent = parseEvent(event)

  if (!fanoutEvent) {
    console.error("Invalid event format: notificationId is required")
    return
  }

  const db = getDb()
  const fanoutHandler = new FanoutHandler(db)

  try {
    await fanoutHandler.handle(fanoutEvent)
  } catch (error) {
    console.error("Fanout handler failed:", error)
    throw error // re-throw してLambdaのリトライ機構に任せる
  } finally {
    // Lambda終了時にコネクションをクリーンアップ
    // Note: コールドスタート最適化のため、通常は closePool を呼ばない
    // await closePool()
  }
}

/**
 * イベントペイロードをパース
 * EventBridge Scheduler のイベント形式に対応
 */
function parseEvent(event: ScheduledEvent | FanoutEvent): FanoutEvent | null {
  // 直接 FanoutEvent 形式の場合
  if ("notificationId" in event && typeof event.notificationId === "string") {
    return { notificationId: event.notificationId }
  }

  // EventBridge Scheduler の detail に含まれる場合
  if ("detail" in event && event.detail && typeof event.detail === "object") {
    const detail = event.detail
    if (
      "notificationId" in detail &&
      typeof detail.notificationId === "string"
    ) {
      return { notificationId: detail.notificationId }
    }
  }

  return null
}
