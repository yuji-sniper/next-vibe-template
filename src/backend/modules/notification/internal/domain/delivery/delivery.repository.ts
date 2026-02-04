import type { Delivery, DeliveryStatus } from "./delivery"

export interface DeliveryRepository {
  findByNotificationId(
    notificationId: string,
    options?: {
      status?: DeliveryStatus
      limit?: number
      offset?: number
    }
  ): Promise<Delivery[]>

  findByBatchId(notificationId: string, batchId: string): Promise<Delivery[]>

  findPendingByBatchId(
    notificationId: string,
    batchId: string
  ): Promise<Delivery[]>

  /**
   * 重複を無視してバルクINSERT
   * ON DUPLICATE KEY UPDATE で既存行は更新しない（batch_idを汚さない）
   */
  bulkInsertIgnore(deliveries: Delivery[]): Promise<void>

  bulkUpdateStatus(ids: string[], status: DeliveryStatus): Promise<void>

  updateDeliveryResult(
    id: string,
    result: {
      status: DeliveryStatus
      sesMessageId?: string
      lastError?: string
      sentAt?: Date
    }
  ): Promise<void>

  countByNotificationId(
    notificationId: string,
    status?: DeliveryStatus
  ): Promise<number>

  countByStatus(notificationId: string): Promise<Record<DeliveryStatus, number>>
}

export const DeliveryRepositoryToken = Symbol("DeliveryRepository")
