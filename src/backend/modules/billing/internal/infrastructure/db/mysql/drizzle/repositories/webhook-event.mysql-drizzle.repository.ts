import { eq } from "drizzle-orm"
import { inject, injectable } from "tsyringe"
import { WebhookEvent } from "@/backend/modules/billing/internal/domain/webhook-event/webhook-event"
import type { WebhookEventRepository } from "@/backend/modules/billing/internal/domain/webhook-event/webhook-event.repository"
import { GetDb } from "@/backend/modules/shared/infrastructure/db/mysql/drizzle/get-db"
import { stripeWebhookEvents } from "../schemas"

@injectable()
export class WebhookEventMysqlDrizzleRepository
  implements WebhookEventRepository
{
  constructor(
    @inject(GetDb)
    private readonly getDb: GetDb
  ) {}

  async findByStripeEventId(
    stripeEventId: string
  ): Promise<WebhookEvent | null> {
    const db = this.getDb.handle()
    const result = await db
      .select()
      .from(stripeWebhookEvents)
      .where(eq(stripeWebhookEvents.stripeEventId, stripeEventId))
      .limit(1)

    if (result.length === 0) {
      return null
    }

    const row = result[0]
    return WebhookEvent.reconstruct({
      id: row.id,
      stripeEventId: row.stripeEventId,
      eventType: row.eventType,
      processed: row.processed,
      createdAt: row.createdAt
    })
  }

  async save(event: WebhookEvent): Promise<void> {
    const db = this.getDb.handle()
    await db
      .insert(stripeWebhookEvents)
      .values({
        id: event.id,
        stripeEventId: event.stripeEventId,
        eventType: event.eventType,
        processed: event.processed,
        createdAt: event.createdAt
      })
      .onDuplicateKeyUpdate({
        set: { processed: event.processed }
      })
  }
}
