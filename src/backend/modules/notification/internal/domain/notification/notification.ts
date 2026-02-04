/**
 * NotificationStatus - 通知ステータス番号体系（HTTPステータスコード風）
 * 1xx = 初期/予約
 * 2xx = 処理中
 * 3xx = 成功
 * 4xx = キャンセル/失敗
 */
export const NotificationStatus = {
  SCHEDULED: 100,
  PROCESSING: 200,
  COMPLETED: 300,
  CANCELLED: 400
} as const

export type NotificationStatus =
  (typeof NotificationStatus)[keyof typeof NotificationStatus]

/**
 * AudienceType - 対象タイプ
 * 1 = all（全ユーザー）
 * 2 = segment（セグメント指定）
 * 3 = single（個別指定）
 */
export const AudienceType = {
  ALL: 1,
  SEGMENT: 2,
  SINGLE: 3
} as const

export type AudienceType = (typeof AudienceType)[keyof typeof AudienceType]

export class Notification {
  private constructor(
    public readonly id: string,
    public title: string,
    public subject: string,
    public bodyText: string,
    public bodyHtml: string | null,
    public sendAt: Date,
    public audienceType: AudienceType,
    public audiencePayload: Record<string, unknown> | null,
    public status: NotificationStatus,
    public schedulerName: string | null,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(params: {
    id: string
    title: string
    subject: string
    bodyText: string
    bodyHtml?: string | null
    sendAt: Date
    audienceType: AudienceType
    audiencePayload?: Record<string, unknown> | null
    schedulerName: string
  }): Notification {
    const now = new Date()
    return new Notification(
      params.id,
      params.title,
      params.subject,
      params.bodyText,
      params.bodyHtml ?? null,
      params.sendAt,
      params.audienceType,
      params.audiencePayload ?? null,
      NotificationStatus.SCHEDULED,
      params.schedulerName,
      now,
      now
    )
  }

  static reconstruct(params: {
    id: string
    title: string
    subject: string
    bodyText: string
    bodyHtml: string | null
    sendAt: Date
    audienceType: AudienceType
    audiencePayload: Record<string, unknown> | null
    status: NotificationStatus
    schedulerName: string | null
    createdAt: Date
    updatedAt: Date
  }): Notification {
    return new Notification(
      params.id,
      params.title,
      params.subject,
      params.bodyText,
      params.bodyHtml,
      params.sendAt,
      params.audienceType,
      params.audiencePayload,
      params.status,
      params.schedulerName,
      params.createdAt,
      params.updatedAt
    )
  }

  updateTitle(title: string): void {
    this.title = title
    this.updatedAt = new Date()
  }

  updateSubject(subject: string): void {
    this.subject = subject
    this.updatedAt = new Date()
  }

  updateBodyText(bodyText: string): void {
    this.bodyText = bodyText
    this.updatedAt = new Date()
  }

  updateBodyHtml(bodyHtml: string | null): void {
    this.bodyHtml = bodyHtml
    this.updatedAt = new Date()
  }

  updateSendAt(sendAt: Date): void {
    this.sendAt = sendAt
    this.updatedAt = new Date()
  }

  updateAudienceType(audienceType: AudienceType): void {
    this.audienceType = audienceType
    this.updatedAt = new Date()
  }

  updateAudiencePayload(audiencePayload: Record<string, unknown> | null): void {
    this.audiencePayload = audiencePayload
    this.updatedAt = new Date()
  }

  updateSchedulerName(schedulerName: string): void {
    this.schedulerName = schedulerName
    this.updatedAt = new Date()
  }

  cancel(): void {
    this.status = NotificationStatus.CANCELLED
    this.updatedAt = new Date()
  }

  complete(): void {
    this.status = NotificationStatus.COMPLETED
    this.updatedAt = new Date()
  }

  startProcessing(): void {
    this.status = NotificationStatus.PROCESSING
    this.updatedAt = new Date()
  }

  isScheduled(): boolean {
    return this.status === NotificationStatus.SCHEDULED
  }

  isCancelled(): boolean {
    return this.status === NotificationStatus.CANCELLED
  }

  isCompleted(): boolean {
    return this.status === NotificationStatus.COMPLETED
  }
}
