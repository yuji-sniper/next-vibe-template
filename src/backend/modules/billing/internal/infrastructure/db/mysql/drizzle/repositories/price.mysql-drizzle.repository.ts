import { and, eq } from "drizzle-orm"
import { inject, injectable } from "tsyringe"
import type {
  PriceType,
  RecurringInterval
} from "@/backend/modules/billing/internal/domain/price/price"
import { Price } from "@/backend/modules/billing/internal/domain/price/price"
import type { PriceRepository } from "@/backend/modules/billing/internal/domain/price/price.repository"
import { GetDb } from "@/backend/modules/shared/infrastructure/db/mysql/drizzle/get-db"
import { prices } from "../schemas"

@injectable()
export class PriceMysqlDrizzleRepository implements PriceRepository {
  constructor(
    @inject(GetDb)
    private readonly getDb: GetDb
  ) {}

  async findById(id: string): Promise<Price | null> {
    const db = this.getDb.handle()
    const result = await db
      .select()
      .from(prices)
      .where(eq(prices.id, id))
      .limit(1)

    if (result.length === 0) {
      return null
    }

    return this.toDomain(result[0])
  }

  async findByStripePriceId(stripePriceId: string): Promise<Price | null> {
    const db = this.getDb.handle()
    const result = await db
      .select()
      .from(prices)
      .where(eq(prices.stripePriceId, stripePriceId))
      .limit(1)

    if (result.length === 0) {
      return null
    }

    return this.toDomain(result[0])
  }

  async findByProductId(
    productId: string,
    options?: { activeOnly?: boolean }
  ): Promise<Price[]> {
    const db = this.getDb.handle()

    const conditions = [eq(prices.productId, productId)]
    if (options?.activeOnly) {
      conditions.push(eq(prices.active, true))
    }

    const result = await db
      .select()
      .from(prices)
      .where(and(...conditions))

    return result.map((row) => this.toDomain(row))
  }

  async save(price: Price): Promise<void> {
    const db = this.getDb.handle()
    await db
      .insert(prices)
      .values({
        id: price.id,
        productId: price.productId,
        stripePriceId: price.stripePriceId,
        currency: price.currency,
        unitAmount: price.unitAmount,
        recurringInterval: price.recurringInterval,
        recurringIntervalCount: price.recurringIntervalCount,
        type: price.type,
        active: price.active,
        metadata: price.metadata,
        displayName: price.displayName,
        createdAt: price.createdAt,
        updatedAt: price.updatedAt
      })
      .onDuplicateKeyUpdate({
        set: {
          stripePriceId: price.stripePriceId,
          active: price.active,
          updatedAt: price.updatedAt
        }
      })
  }

  private toDomain(row: {
    id: string
    productId: string
    stripePriceId: string | null
    currency: string
    unitAmount: number
    recurringInterval: string | null
    recurringIntervalCount: number | null
    type: string
    active: boolean
    metadata: Record<string, string> | null
    displayName: string | null
    createdAt: Date
    updatedAt: Date
  }): Price {
    return Price.reconstruct({
      id: row.id,
      productId: row.productId,
      stripePriceId: row.stripePriceId,
      currency: row.currency,
      unitAmount: row.unitAmount,
      recurringInterval: row.recurringInterval as RecurringInterval | null,
      recurringIntervalCount: row.recurringIntervalCount ?? 1,
      type: row.type as PriceType,
      active: row.active,
      metadata: row.metadata,
      displayName: row.displayName,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    })
  }
}
