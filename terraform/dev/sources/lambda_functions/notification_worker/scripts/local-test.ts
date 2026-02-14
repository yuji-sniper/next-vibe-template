/**
 * ローカルテスト用スクリプト
 *
 * 使用方法:
 * 1. 環境変数を設定
 *    export DB_HOST=localhost
 *    export DB_PORT=3306
 *    export DB_USER=root
 *    export DB_PASSWORD=password
 *    export DB_NAME=your_database
 *    export FROM_EMAIL=noreply@example.com
 *    export SES_REGION=ap-northeast-1
 *
 * 2. 実行
 *    npx tsx scripts/local-test.ts <notificationId> <batchId> <userIds...>
 *
 * 例:
 *    npx tsx scripts/local-test.ts notification-123 batch-456 user-1 user-2 user-3
 */

import type { SQSEvent } from "aws-lambda"
import { handler } from "../src/index"

async function main() {
  const args = process.argv.slice(2)

  if (args.length < 3) {
    console.error(
      "Usage: npx tsx scripts/local-test.ts <notificationId> <batchId> <userIds...>"
    )
    process.exit(1)
  }

  const [notificationId, batchId, ...userIds] = args

  console.log(`Testing worker with:`)
  console.log(`  notificationId: ${notificationId}`)
  console.log(`  batchId: ${batchId}`)
  console.log(`  userIds: ${userIds.join(", ")}`)

  // 環境変数チェック
  const requiredEnvVars = [
    "DB_HOST",
    "DB_USER",
    "DB_PASSWORD",
    "DB_NAME",
    "FROM_EMAIL"
  ]

  const missingVars = requiredEnvVars.filter((v) => !process.env[v])
  if (missingVars.length > 0) {
    console.error(`Missing environment variables: ${missingVars.join(", ")}`)
    process.exit(1)
  }

  // SQSイベントを構築
  const sqsEvent: SQSEvent = {
    Records: [
      {
        messageId: "test-message-1",
        receiptHandle: "test-receipt-handle",
        body: JSON.stringify({
          notificationId,
          batchId,
          userIds,
          cursorUserId: userIds[userIds.length - 1]
        }),
        attributes: {
          ApproximateReceiveCount: "1",
          SentTimestamp: Date.now().toString(),
          SenderId: "test-sender",
          ApproximateFirstReceiveTimestamp: Date.now().toString()
        },
        messageAttributes: {},
        md5OfBody: "test-md5",
        eventSource: "aws:sqs",
        eventSourceARN: "arn:aws:sqs:ap-northeast-1:000000000000:test-queue",
        awsRegion: "ap-northeast-1"
      }
    ]
  }

  try {
    const result = await handler(sqsEvent)
    console.log("Test completed!")
    console.log("Result:", JSON.stringify(result, null, 2))

    if (result.batchItemFailures.length > 0) {
      console.warn("Some messages failed:", result.batchItemFailures)
      process.exit(1)
    }
  } catch (error) {
    console.error("Test failed:", error)
    process.exit(1)
  }
}

main()
