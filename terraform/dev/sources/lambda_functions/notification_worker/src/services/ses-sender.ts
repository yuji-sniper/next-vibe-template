import {
  SESClient,
  SESServiceException,
  SendEmailCommand,
  type SendEmailCommandInput
} from "@aws-sdk/client-ses"
import { FROM_EMAIL, SES_REGION } from "../config"
import type { SendResult } from "../types"

/**
 * SES送信サービス
 * AWS SES経由でメール送信を行う
 */
export class SesSender {
  private readonly client: SESClient
  private readonly fromEmail: string

  constructor() {
    this.client = new SESClient({ region: SES_REGION })
    this.fromEmail = FROM_EMAIL
  }

  /**
   * メール送信
   * @param toEmail 宛先メールアドレス
   * @param subject 件名
   * @param bodyText テキスト本文
   * @param bodyHtml HTML本文（オプション）
   * @returns 送信結果
   */
  async sendEmail(
    toEmail: string,
    subject: string,
    bodyText: string,
    bodyHtml?: string | null
  ): Promise<SendResult> {
    const params: SendEmailCommandInput = {
      Source: this.fromEmail,
      Destination: {
        ToAddresses: [toEmail]
      },
      Message: {
        Subject: {
          Charset: "UTF-8",
          Data: subject
        },
        Body: {
          Text: {
            Charset: "UTF-8",
            Data: bodyText
          }
        }
      }
    }

    // HTML本文がある場合は追加
    if (bodyHtml && params.Message?.Body) {
      params.Message.Body.Html = {
        Charset: "UTF-8",
        Data: bodyHtml
      }
    }

    try {
      const command = new SendEmailCommand(params)
      const response = await this.client.send(command)

      if (!response.MessageId) {
        return { type: "permanent", error: "No MessageId returned from SES" }
      }

      return { type: "success", messageId: response.MessageId }
    } catch (error) {
      return this.classifyError(error)
    }
  }

  /**
   * エラーを分類して適切な SendResult を返す
   */
  private classifyError(error: unknown): SendResult {
    if (error instanceof SESServiceException) {
      const errorMessage = `${error.name}: ${error.message}`
      console.error(`SES send error: ${errorMessage}`)

      // 抑制対象のエラー
      if (this.isSuppressionError(error)) {
        return { type: "suppressed", reason: errorMessage }
      }

      // $fault === "server" はサーバー側エラー（一時的、リトライ可）
      // $fault === "client" はクライアント側エラー（恒久的）
      if (error.$fault === "server") {
        return { type: "transient", error: errorMessage }
      }

      return { type: "permanent", error: errorMessage }
    }

    // SESServiceException 以外（ネットワークエラーなど）は一時的エラー
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error"
    console.error(`SES send error (non-SES): ${errorMessage}`)

    return { type: "transient", error: errorMessage }
  }

  /**
   * 抑制対象のエラーかどうかを判定
   */
  private isSuppressionError(error: SESServiceException): boolean {
    const suppressionErrors = [
      "MessageRejected", // バウンスやサプレッションリスト
      "AccountSendingPausedException" // アカウント送信停止
    ]
    return suppressionErrors.some(
      (name) => error.name.includes(name) || error.message.includes(name)
    )
  }
}
