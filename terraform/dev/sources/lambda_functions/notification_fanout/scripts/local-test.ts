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
 *    export WORKER_QUEUE_URL=http://localhost:4566/000000000000/worker-queue
 *
 * 2. 実行
 *    npx tsx scripts/local-test.ts <notificationId>
 */

import { handler } from "../src/index"

async function main() {
  const notificationId = process.argv[2]

  if (!notificationId) {
    console.error("Usage: npx tsx scripts/local-test.ts <notificationId>")
    process.exit(1)
  }

  console.log(`Testing fanout with notificationId: ${notificationId}`)

  // 環境変数チェック
  const requiredEnvVars = [
    "DB_HOST",
    "DB_USER",
    "DB_PASSWORD",
    "DB_NAME",
    "WORKER_QUEUE_URL"
  ]

  const missingVars = requiredEnvVars.filter((v) => !process.env[v])
  if (missingVars.length > 0) {
    console.error(`Missing environment variables: ${missingVars.join(", ")}`)
    process.exit(1)
  }

  try {
    await handler({ notificationId })
    console.log("Test completed successfully!")
  } catch (error) {
    console.error("Test failed:", error)
    process.exit(1)
  }
}

main()
