import {
  type BulkEmailEntry,
  type BulkEmailEntryResult,
  SESv2Client,
  SESv2ServiceException,
  SendBulkEmailCommand
} from "@aws-sdk/client-sesv2"
import { FROM_EMAIL, FROM_NAME, SES_REGION } from "../config"
import type {
  BulkEmailEntry as BulkEmailInput,
  BulkSendResultEntry,
  SendResult
} from "../types"

/** SendBulkEmailCommand の最大宛先数 */
const BULK_EMAIL_MAX_ENTRIES = 50

/** チャンク間の遅延（ミリ秒） */
const CHUNK_DELAY_MS = 1000

/** 指定ミリ秒待機 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * BulkEmailEntryResult.Status の値
 * @see https://docs.aws.amazon.com/ses/latest/APIReference-V2/API_BulkEmailEntryResult.html
 */
const BulkEmailStatus = {
  // 成功
  SUCCESS: "SUCCESS",

  // 一時的エラー（リトライ可能）
  ACCOUNT_THROTTLED: "ACCOUNT_THROTTLED",
  ACCOUNT_DAILY_QUOTA_EXCEEDED: "ACCOUNT_DAILY_QUOTA_EXCEEDED",
  TRANSIENT_FAILURE: "TRANSIENT_FAILURE",

  // 恒久的エラー
  MESSAGE_REJECTED: "MESSAGE_REJECTED",
  MAIL_FROM_DOMAIN_NOT_VERIFIED: "MAIL_FROM_DOMAIN_NOT_VERIFIED",
  CONFIGURATION_SET_DOES_NOT_EXIST: "CONFIGURATION_SET_DOES_NOT_EXIST",
  TEMPLATE_DOES_NOT_EXIST: "TEMPLATE_DOES_NOT_EXIST",
  ACCOUNT_SUSPENDED: "ACCOUNT_SUSPENDED",
  ACCOUNT_SENDING_PAUSED: "ACCOUNT_SENDING_PAUSED",
  CONFIGURATION_SET_SENDING_PAUSED: "CONFIGURATION_SET_SENDING_PAUSED",
  INVALID_SENDING_POOL_NAME: "INVALID_SENDING_POOL_NAME",
  INVALID_PARAMETER_VALUE: "INVALID_PARAMETER_VALUE",
  FAILED: "FAILED"
} as const

/** 一時的エラー（リトライ可能）のステータス */
const TRANSIENT_STATUSES: Set<string> = new Set([
  BulkEmailStatus.ACCOUNT_THROTTLED,
  BulkEmailStatus.ACCOUNT_DAILY_QUOTA_EXCEEDED,
  BulkEmailStatus.TRANSIENT_FAILURE
])

/** 抑制扱いのステータス（送信先の問題など） */
const SUPPRESSION_STATUSES: Set<string> = new Set([
  BulkEmailStatus.MESSAGE_REJECTED // ウイルス検出など
])

/**
 * SES送信サービス
 * AWS SESv2 の SendBulkEmailCommand 経由でバルクメール送信を行う
 */
export class SesSender {
  private readonly client: SESv2Client
  private readonly fromEmail: string

  constructor() {
    this.client = new SESv2Client({
      region: SES_REGION,
      maxAttempts: 3,
      retryMode: "adaptive" // スロットリングを考慮した適応型リトライ
    })
    this.fromEmail = `"${FROM_NAME}" <${FROM_EMAIL}>`
  }

  /**
   * バルクメール送信
   * @param entries 送信対象のリスト（deliveryId, email）
   * @param subject 件名
   * @param bodyText テキスト本文
   * @param bodyHtml HTML本文（オプション）
   * @returns 各宛先ごとの送信結果
   */
  async sendBulkEmail(
    entries: BulkEmailInput[],
    subject: string,
    bodyText: string,
    bodyHtml?: string | null
  ): Promise<BulkSendResultEntry[]> {
    if (entries.length === 0) {
      return []
    }

    const allResults: BulkSendResultEntry[] = []

    // 50件ずつチャンクに分割して送信
    for (let i = 0; i < entries.length; i += BULK_EMAIL_MAX_ENTRIES) {
      const chunk = entries.slice(i, i + BULK_EMAIL_MAX_ENTRIES)
      const chunkResults = await this.sendChunk(
        chunk,
        subject,
        bodyText,
        bodyHtml
      )
      allResults.push(...chunkResults)

      // 次のチャンクがある場合は遅延を入れる（スロットリング対策）
      if (i + BULK_EMAIL_MAX_ENTRIES < entries.length) {
        await sleep(CHUNK_DELAY_MS)
      }
    }

    return allResults
  }

  /**
   * 50件以下のチャンクを送信
   */
  private async sendChunk(
    entries: BulkEmailInput[],
    subject: string,
    bodyText: string,
    bodyHtml?: string | null
  ): Promise<BulkSendResultEntry[]> {
    // BulkEmailEntry の配列を構築
    const bulkEmailEntries: BulkEmailEntry[] = entries.map((entry) => ({
      Destination: {
        ToAddresses: [entry.email]
      }
    }))

    try {
      const command = new SendBulkEmailCommand({
        FromEmailAddress: this.fromEmail,
        DefaultContent: {
          Template: {
            TemplateContent: {
              Subject: subject,
              Text: bodyText,
              Html: bodyHtml ?? undefined
            },
            TemplateData: "{}"
          }
        },
        BulkEmailEntries: bulkEmailEntries
      })

      const response = await this.client.send(command)

      // 結果をマッピング
      return this.mapBulkResults(entries, response.BulkEmailEntryResults ?? [])
    } catch (error) {
      // 全体的なエラー（API呼び出し自体が失敗）
      const sendResult = this.classifyError(error)
      return entries.map((entry) => ({
        deliveryId: entry.deliveryId,
        result: sendResult
      }))
    }
  }

  /**
   * バルク送信結果をマッピング
   * Status の値に基づいてエラー種別を判定
   */
  private mapBulkResults(
    entries: BulkEmailInput[],
    results: BulkEmailEntryResult[]
  ): BulkSendResultEntry[] {
    return entries.map((entry, index) => {
      const result = results[index]

      if (!result) {
        return {
          deliveryId: entry.deliveryId,
          result: { type: "permanent", error: "No result returned from SES" }
        }
      }

      const status = result.Status ?? ""
      const errorMessage = result.Error ?? status

      // 成功
      if (status === BulkEmailStatus.SUCCESS && result.MessageId) {
        return {
          deliveryId: entry.deliveryId,
          result: { type: "success", messageId: result.MessageId }
        }
      }

      // 抑制対象（MESSAGE_REJECTED: ウイルス検出など）
      if (SUPPRESSION_STATUSES.has(status)) {
        return {
          deliveryId: entry.deliveryId,
          result: { type: "suppressed", reason: errorMessage }
        }
      }

      // 一時的エラー（リトライ可能）
      if (TRANSIENT_STATUSES.has(status)) {
        return {
          deliveryId: entry.deliveryId,
          result: { type: "transient", error: errorMessage }
        }
      }

      // その他は恒久的エラー
      return {
        deliveryId: entry.deliveryId,
        result: { type: "permanent", error: errorMessage }
      }
    })
  }

  /**
   * エラーを分類して適切な SendResult を返す
   * API 呼び出し全体が失敗した場合のハンドリング
   */
  private classifyError(err: unknown): SendResult {
    if (err instanceof SESv2ServiceException) {
      const errorMessage = `${err.name}: ${err.message}`
      console.error(`SES send error: ${errorMessage}`)

      // $fault === "server" はサーバー側エラー（一時的、リトライ可）
      // $fault === "client" はクライアント側エラー（恒久的）
      if (err.$fault === "server") {
        return { type: "transient", error: errorMessage }
      }

      return { type: "permanent", error: errorMessage }
    }

    // SESv2ServiceException 以外（ネットワークエラーなど）は一時的エラー
    const errorMessage = err instanceof Error ? err.message : "Unknown error"
    console.error(`SES send error (non-SES): ${errorMessage}`)

    return { type: "transient", error: errorMessage }
  }
}
