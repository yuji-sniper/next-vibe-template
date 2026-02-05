import type { Notification, NotificationStatus } from "./notification"

export interface NotificationRepository {
  findById(id: string): Promise<Notification | null>
  /**
   * 悲観的ロック（SELECT FOR UPDATE）で通知を取得する。
   * 必ずトランザクション内で使用すること。
   */
  findByIdForUpdate(id: string): Promise<Notification | null>
  findByStatus(status: NotificationStatus): Promise<Notification[]>
  findScheduled(limit: number): Promise<Notification[]>
  findAll(options?: {
    status?: NotificationStatus
    limit?: number
    offset?: number
  }): Promise<Notification[]>
  count(status?: NotificationStatus): Promise<number>
  save(notification: Notification): Promise<void>
}

export const NotificationRepositoryToken = Symbol("NotificationRepository")
