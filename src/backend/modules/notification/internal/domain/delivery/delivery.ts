/**
 * DeliveryStatus - 配信ステータス番号体系（HTTPステータスコード風）
 * 1xx = 初期/保留
 * 2xx = 処理中
 * 3xx = 成功
 * 4xx = 失敗
 * 5xx = 抑制/スキップ
 */
export const DeliveryStatus = {
  PENDING: 100,
  SENDING: 200,
  RETRYING: 210,
  SENT: 300,
  FAILED: 400,
  BOUNCED: 410,
  COMPLAINED: 420,
  SUPPRESSED: 500,
  UNSUBSCRIBED: 510
} as const

export type DeliveryStatus =
  (typeof DeliveryStatus)[keyof typeof DeliveryStatus]

export class Delivery {
  private constructor(
    public readonly id: string | null,
    public readonly notificationId: string,
    public readonly userId: string,
    public readonly email: string,
    public status: DeliveryStatus,
    public attemptCount: number,
    public lastError: string | null,
    public sesMessageId: string | null,
    public sentAt: Date | null,
    public batchId: string | null,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(params: {
    notificationId: string
    userId: string
    email: string
    batchId: string
  }): Delivery {
    const now = new Date()
    return new Delivery(
      null,
      params.notificationId,
      params.userId,
      params.email,
      DeliveryStatus.PENDING,
      0,
      null,
      null,
      null,
      params.batchId,
      now,
      now
    )
  }

  static reconstruct(params: {
    id: string
    notificationId: string
    userId: string
    email: string
    status: DeliveryStatus
    attemptCount: number
    lastError: string | null
    sesMessageId: string | null
    sentAt: Date | null
    batchId: string | null
    createdAt: Date
    updatedAt: Date
  }): Delivery {
    return new Delivery(
      params.id,
      params.notificationId,
      params.userId,
      params.email,
      params.status,
      params.attemptCount,
      params.lastError,
      params.sesMessageId,
      params.sentAt,
      params.batchId,
      params.createdAt,
      params.updatedAt
    )
  }

  markAsSending(): void {
    this.status = DeliveryStatus.SENDING
    this.attemptCount += 1
    this.updatedAt = new Date()
  }

  markAsSent(sesMessageId: string): void {
    this.status = DeliveryStatus.SENT
    this.sesMessageId = sesMessageId
    this.sentAt = new Date()
    this.updatedAt = new Date()
  }

  markAsFailed(error: string): void {
    this.status = DeliveryStatus.FAILED
    this.lastError = error
    this.updatedAt = new Date()
  }

  markAsBounced(error: string): void {
    this.status = DeliveryStatus.BOUNCED
    this.lastError = error
    this.updatedAt = new Date()
  }

  markAsSuppressed(reason?: string): void {
    this.status = DeliveryStatus.SUPPRESSED
    this.lastError = reason ?? null
    this.updatedAt = new Date()
  }

  markAsRetrying(): void {
    this.status = DeliveryStatus.RETRYING
    this.updatedAt = new Date()
  }

  isPending(): boolean {
    return this.status === DeliveryStatus.PENDING
  }

  isSending(): boolean {
    return this.status === DeliveryStatus.SENDING
  }

  isSent(): boolean {
    return this.status === DeliveryStatus.SENT
  }

  isFailed(): boolean {
    return (
      this.status === DeliveryStatus.FAILED ||
      this.status === DeliveryStatus.BOUNCED ||
      this.status === DeliveryStatus.COMPLAINED
    )
  }
}
