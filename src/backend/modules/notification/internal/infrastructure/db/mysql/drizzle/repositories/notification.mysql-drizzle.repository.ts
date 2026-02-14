import { and, count, desc, eq } from "drizzle-orm"
import { inject, injectable } from "tsyringe"
import type { NotificationStatus } from "@/backend/modules/notification/internal/domain/notification/notification"
import {
  Notification,
  NotificationStatus as NotificationStatusEnum
} from "@/backend/modules/notification/internal/domain/notification/notification"
import type { NotificationRepository } from "@/backend/modules/notification/internal/domain/notification/notification.repository"
import { GetDb } from "@/backend/modules/shared/infrastructure/db/mysql/drizzle/get-db"
import { notifications } from "../schemas"

@injectable()
export class NotificationMysqlDrizzleRepository
  implements NotificationRepository
{
  constructor(
    @inject(GetDb)
    private readonly getDb: GetDb
  ) {}

  async findById(id: string): Promise<Notification | null> {
    const db = this.getDb.handle()
    const result = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, id))
      .limit(1)

    if (result.length === 0) {
      return null
    }

    return Notification.reconstruct(result[0])
  }

  async findByIdForUpdate(id: string): Promise<Notification | null> {
    const db = this.getDb.handle()
    const result = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, id))
      .limit(1)
      .for("update")

    if (result.length === 0) {
      return null
    }

    return Notification.reconstruct(result[0])
  }

  async findByStatus(status: NotificationStatus): Promise<Notification[]> {
    const db = this.getDb.handle()
    const result = await db
      .select()
      .from(notifications)
      .where(eq(notifications.status, status))
      .orderBy(desc(notifications.sendAt))

    return result.map((row) => Notification.reconstruct(row))
  }

  async findScheduled(limit: number): Promise<Notification[]> {
    const db = this.getDb.handle()
    const result = await db
      .select()
      .from(notifications)
      .where(eq(notifications.status, NotificationStatusEnum.SCHEDULED))
      .orderBy(notifications.sendAt)
      .limit(limit)

    return result.map((row) => Notification.reconstruct(row))
  }

  async findAll(options?: {
    status?: NotificationStatus
    limit?: number
    offset?: number
  }): Promise<Notification[]> {
    const db = this.getDb.handle()

    const conditions = []
    if (options?.status !== undefined) {
      conditions.push(eq(notifications.status, options.status))
    }

    const query = db
      .select()
      .from(notifications)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(notifications.createdAt))

    if (options?.limit !== undefined) {
      query.limit(options.limit)
    }

    if (options?.offset !== undefined) {
      query.offset(options.offset)
    }

    const result = await query

    return result.map((row) => Notification.reconstruct(row))
  }

  async count(status?: NotificationStatus): Promise<number> {
    const db = this.getDb.handle()

    const conditions = []
    if (status !== undefined) {
      conditions.push(eq(notifications.status, status))
    }

    const result = await db
      .select({ count: count() })
      .from(notifications)
      .where(conditions.length > 0 ? and(...conditions) : undefined)

    return result[0]?.count ?? 0
  }

  async save(notification: Notification): Promise<void> {
    const db = this.getDb.handle()
    await db
      .insert(notifications)
      .values({
        id: notification.id,
        title: notification.title,
        subject: notification.subject,
        bodyText: notification.bodyText,
        bodyHtml: notification.bodyHtml,
        sendAt: notification.sendAt,
        audienceType: notification.audienceType,
        audiencePayload: notification.audiencePayload,
        status: notification.status,
        schedulerName: notification.schedulerName,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt
      })
      .onDuplicateKeyUpdate({
        set: {
          title: notification.title,
          subject: notification.subject,
          bodyText: notification.bodyText,
          bodyHtml: notification.bodyHtml,
          sendAt: notification.sendAt,
          audienceType: notification.audienceType,
          audiencePayload: notification.audiencePayload,
          status: notification.status,
          schedulerName: notification.schedulerName,
          updatedAt: notification.updatedAt
        }
      })
  }
}
