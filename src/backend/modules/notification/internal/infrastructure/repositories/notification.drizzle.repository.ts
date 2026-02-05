import { and, count, desc, eq, sql } from "drizzle-orm"
import { inject, injectable } from "tsyringe"
import type {
  AudienceType,
  NotificationStatus
} from "@/backend/modules/notification/internal/domain/notification/notification"
import {
  Notification,
  NotificationStatus as NotificationStatusEnum
} from "@/backend/modules/notification/internal/domain/notification/notification"
import type { NotificationRepository } from "@/backend/modules/notification/internal/domain/notification/notification.repository"
import { GetDb } from "@/backend/modules/shared/infrastructure/db/mysql/drizzle/get-db"
import { notifications } from "../db/mysql/drizzle/schemas"

@injectable()
export class NotificationDrizzleRepository implements NotificationRepository {
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

    return this.toDomain(result[0])
  }

  async findByIdForUpdate(id: string): Promise<Notification | null> {
    const db = this.getDb.handle()

    const result = await db.execute(
      sql`SELECT
        id, title, subject, body_text, body_html, send_at,
        audience_type, audience_payload, status, scheduler_name,
        created_at, updated_at
      FROM notifications
      WHERE id = ${id}
      FOR UPDATE`
    )

    type NotificationRow = {
      id: string
      title: string
      subject: string
      body_text: string
      body_html: string | null
      send_at: Date
      audience_type: number
      audience_payload: string | null
      status: number
      scheduler_name: string | null
      created_at: Date
      updated_at: Date
    }

    const rows = result[0] as unknown as NotificationRow[]

    if (rows.length === 0) {
      return null
    }

    const row = rows[0]
    return Notification.reconstruct({
      id: row.id,
      title: row.title,
      subject: row.subject,
      bodyText: row.body_text,
      bodyHtml: row.body_html,
      sendAt: row.send_at,
      audienceType: row.audience_type as AudienceType,
      audiencePayload: row.audience_payload
        ? (JSON.parse(row.audience_payload) as Record<string, unknown>)
        : null,
      status: row.status as NotificationStatus,
      schedulerName: row.scheduler_name,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    })
  }

  async findByStatus(status: NotificationStatus): Promise<Notification[]> {
    const db = this.getDb.handle()
    const result = await db
      .select()
      .from(notifications)
      .where(eq(notifications.status, status))
      .orderBy(desc(notifications.sendAt))

    return result.map((row) => this.toDomain(row))
  }

  async findScheduled(limit: number): Promise<Notification[]> {
    const db = this.getDb.handle()
    const result = await db
      .select()
      .from(notifications)
      .where(eq(notifications.status, NotificationStatusEnum.SCHEDULED))
      .orderBy(notifications.sendAt)
      .limit(limit)

    return result.map((row) => this.toDomain(row))
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

    return result.map((row) => this.toDomain(row))
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

  private toDomain(row: {
    id: string
    title: string
    subject: string
    bodyText: string
    bodyHtml: string | null
    sendAt: Date
    audienceType: number
    audiencePayload: unknown
    status: number
    schedulerName: string | null
    createdAt: Date
    updatedAt: Date
  }): Notification {
    return Notification.reconstruct({
      id: row.id,
      title: row.title,
      subject: row.subject,
      bodyText: row.bodyText,
      bodyHtml: row.bodyHtml,
      sendAt: row.sendAt,
      audienceType: row.audienceType as AudienceType,
      audiencePayload: row.audiencePayload as Record<string, unknown> | null,
      status: row.status as NotificationStatus,
      schedulerName: row.schedulerName,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    })
  }
}
