import { eq } from "drizzle-orm"
import { inject, injectable } from "tsyringe"
import type { SubscriptionStatus } from "@/backend/modules/billing/internal/domain/subscription/subscription"
import { Subscription } from "@/backend/modules/billing/internal/domain/subscription/subscription"
import type { SubscriptionRepository } from "@/backend/modules/billing/internal/domain/subscription/subscription.repository"
import { GetDb } from "@/backend/modules/shared/infrastructure/db/mysql/drizzle/get-db"
import { subscriptions } from "../schemas"

@injectable()
export class SubscriptionMysqlDrizzleRepository
  implements SubscriptionRepository
{
  constructor(
    @inject(GetDb)
    private readonly getDb: GetDb
  ) {}

  async findById(id: string): Promise<Subscription | undefined> {
    const db = this.getDb.handle()
    const result = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.id, id))
      .limit(1)

    if (result.length === 0) {
      return undefined
    }

    return this.toDomain(result[0])
  }

  async findByCustomerId(
    customerId: string
  ): Promise<Subscription | undefined> {
    const db = this.getDb.handle()
    const result = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.customerId, customerId))
      .limit(1)

    if (result.length === 0) {
      return undefined
    }

    return this.toDomain(result[0])
  }

  async findByStripeSubscriptionId(
    stripeSubscriptionId: string
  ): Promise<Subscription | undefined> {
    const db = this.getDb.handle()
    const result = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId))
      .limit(1)

    if (result.length === 0) {
      return undefined
    }

    return this.toDomain(result[0])
  }

  async save(subscription: Subscription): Promise<void> {
    const db = this.getDb.handle()
    await db
      .insert(subscriptions)
      .values({
        id: subscription.id,
        customerId: subscription.customerId,
        stripeSubscriptionId: subscription.stripeSubscriptionId,
        stripePriceId: subscription.stripePriceId,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        createdAt: subscription.createdAt,
        updatedAt: subscription.updatedAt
      })
      .onDuplicateKeyUpdate({
        set: {
          stripePriceId: subscription.stripePriceId,
          status: subscription.status,
          currentPeriodStart: subscription.currentPeriodStart,
          currentPeriodEnd: subscription.currentPeriodEnd,
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
          updatedAt: subscription.updatedAt
        }
      })
  }

  async delete(id: string): Promise<void> {
    const db = this.getDb.handle()
    await db.delete(subscriptions).where(eq(subscriptions.id, id))
  }

  private toDomain(row: {
    id: string
    customerId: string
    stripeSubscriptionId: string
    stripePriceId: string
    status: string
    currentPeriodStart: Date | null
    currentPeriodEnd: Date | null
    cancelAtPeriodEnd: boolean
    createdAt: Date
    updatedAt: Date
  }): Subscription {
    return Subscription.reconstruct({
      id: row.id,
      customerId: row.customerId,
      stripeSubscriptionId: row.stripeSubscriptionId,
      stripePriceId: row.stripePriceId,
      status: row.status as SubscriptionStatus,
      currentPeriodStart: row.currentPeriodStart,
      currentPeriodEnd: row.currentPeriodEnd,
      cancelAtPeriodEnd: row.cancelAtPeriodEnd,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    })
  }
}
