import type { Notification, NotificationStatus } from "./notification"

export interface NotificationRepository {
  findById(id: string): Promise<Notification | null>
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
