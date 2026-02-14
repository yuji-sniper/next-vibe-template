import { and, count, eq, inArray, sql } from "drizzle-orm"
import { inject, injectable } from "tsyringe"
import { v7 } from "uuid"
import type { DeliveryStatus } from "@/backend/modules/notification/internal/domain/delivery/delivery"
import {
  Delivery,
  DeliveryStatus as DeliveryStatusEnum
} from "@/backend/modules/notification/internal/domain/delivery/delivery"
import type { DeliveryRepository } from "@/backend/modules/notification/internal/domain/delivery/delivery.repository"
import { GetDb } from "@/backend/modules/shared/infrastructure/db/mysql/drizzle/get-db"
import { notificationDeliveries } from "../schemas"

@injectable()
export class DeliveryMysqlDrizzleRepository implements DeliveryRepository {
  constructor(
    @inject(GetDb)
    private readonly getDb: GetDb
  ) {}

  async findByNotificationId(
    notificationId: string,
    options?: {
      status?: DeliveryStatus
      limit?: number
      offset?: number
    }
  ): Promise<Delivery[]> {
    const db = this.getDb.handle()

    const conditions = [
      eq(notificationDeliveries.notificationId, notificationId)
    ]
    if (options?.status !== undefined) {
      conditions.push(eq(notificationDeliveries.status, options.status))
    }

    const query = db
      .select()
      .from(notificationDeliveries)
      .where(and(...conditions))
      .orderBy(notificationDeliveries.id)

    if (options?.limit !== undefined) {
      query.limit(options.limit)
    }

    if (options?.offset !== undefined) {
      query.offset(options.offset)
    }

    const result = await query

    return result.map((row) => Delivery.reconstruct(row))
  }

  async findByBatchId(
    notificationId: string,
    batchId: string
  ): Promise<Delivery[]> {
    const db = this.getDb.handle()
    const result = await db
      .select()
      .from(notificationDeliveries)
      .where(
        and(
          eq(notificationDeliveries.notificationId, notificationId),
          eq(notificationDeliveries.batchId, batchId)
        )
      )

    return result.map((row) => Delivery.reconstruct(row))
  }

  async findPendingByBatchId(
    notificationId: string,
    batchId: string
  ): Promise<Delivery[]> {
    const db = this.getDb.handle()
    const result = await db
      .select()
      .from(notificationDeliveries)
      .where(
        and(
          eq(notificationDeliveries.notificationId, notificationId),
          eq(notificationDeliveries.batchId, batchId),
          eq(notificationDeliveries.status, DeliveryStatusEnum.PENDING)
        )
      )

    return result.map((row) => Delivery.reconstruct(row))
  }

  async bulkInsertIgnore(deliveries: Delivery[]): Promise<void> {
    if (deliveries.length === 0) {
      return
    }

    const db = this.getDb.handle()

    const values = deliveries.map((d) => ({
      id: d.id ?? v7(),
      notificationId: d.notificationId,
      userId: d.userId,
      email: d.email,
      status: d.status,
      attemptCount: d.attemptCount,
      lastError: d.lastError,
      sesMessageId: d.sesMessageId,
      sentAt: d.sentAt,
      batchId: d.batchId,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt
    }))

    // ON DUPLICATE KEY UPDATE で何もしない（既存行のbatch_idを汚さない）
    await db
      .insert(notificationDeliveries)
      .values(values)
      .onDuplicateKeyUpdate({
        set: {
          updatedAt: sql`updated_at`
        }
      })
  }

  async bulkUpdateStatus(ids: string[], status: DeliveryStatus): Promise<void> {
    if (ids.length === 0) {
      return
    }

    const db = this.getDb.handle()
    await db
      .update(notificationDeliveries)
      .set({
        status,
        updatedAt: new Date()
      })
      .where(inArray(notificationDeliveries.id, ids))
  }

  async updateDeliveryResult(
    id: string,
    result: {
      status: DeliveryStatus
      sesMessageId?: string
      lastError?: string
      sentAt?: Date
    }
  ): Promise<void> {
    const db = this.getDb.handle()
    await db
      .update(notificationDeliveries)
      .set({
        status: result.status,
        sesMessageId: result.sesMessageId ?? null,
        lastError: result.lastError ?? null,
        sentAt: result.sentAt ?? null,
        updatedAt: new Date()
      })
      .where(eq(notificationDeliveries.id, id))
  }

  async countByNotificationId(
    notificationId: string,
    status?: DeliveryStatus
  ): Promise<number> {
    const db = this.getDb.handle()

    const conditions = [
      eq(notificationDeliveries.notificationId, notificationId)
    ]
    if (status !== undefined) {
      conditions.push(eq(notificationDeliveries.status, status))
    }

    const result = await db
      .select({ count: count() })
      .from(notificationDeliveries)
      .where(and(...conditions))

    return result[0]?.count ?? 0
  }

  async countByStatus(
    notificationId: string
  ): Promise<Record<DeliveryStatus, number>> {
    const db = this.getDb.handle()

    const result = await db
      .select({
        status: notificationDeliveries.status,
        count: count()
      })
      .from(notificationDeliveries)
      .where(eq(notificationDeliveries.notificationId, notificationId))
      .groupBy(notificationDeliveries.status)

    // 初期値を設定
    const counts: Record<DeliveryStatus, number> = {
      [DeliveryStatusEnum.PENDING]: 0,
      [DeliveryStatusEnum.SENDING]: 0,
      [DeliveryStatusEnum.RETRYING]: 0,
      [DeliveryStatusEnum.SENT]: 0,
      [DeliveryStatusEnum.FAILED]: 0,
      [DeliveryStatusEnum.BOUNCED]: 0,
      [DeliveryStatusEnum.COMPLAINED]: 0,
      [DeliveryStatusEnum.SUPPRESSED]: 0,
      [DeliveryStatusEnum.UNSUBSCRIBED]: 0
    }

    for (const row of result) {
      counts[row.status] = row.count
    }

    return counts
  }
}
