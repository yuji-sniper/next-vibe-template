import { eq } from "drizzle-orm"
import { inject, injectable } from "tsyringe"
import { Product } from "@/backend/modules/billing/internal/domain/product/product"
import type { ProductRepository } from "@/backend/modules/billing/internal/domain/product/product.repository"
import { GetDb } from "@/backend/modules/shared/infrastructure/db/mysql/drizzle/get-db"
import { products } from "../schemas"

@injectable()
export class ProductMysqlDrizzleRepository implements ProductRepository {
  constructor(
    @inject(GetDb)
    private readonly getDb: GetDb
  ) {}

  async findById(id: string): Promise<Product | null> {
    const db = this.getDb.handle()
    const result = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1)

    if (result.length === 0) {
      return null
    }

    return this.toDomain(result[0])
  }

  async findByStripeProductId(
    stripeProductId: string
  ): Promise<Product | null> {
    const db = this.getDb.handle()
    const result = await db
      .select()
      .from(products)
      .where(eq(products.stripeProductId, stripeProductId))
      .limit(1)

    if (result.length === 0) {
      return null
    }

    return this.toDomain(result[0])
  }

  async findAll(options?: { activeOnly?: boolean }): Promise<Product[]> {
    const db = this.getDb.handle()
    const result = await db
      .select()
      .from(products)
      .where(options?.activeOnly ? eq(products.active, true) : undefined)

    return result.map((row) => this.toDomain(row))
  }

  async save(product: Product): Promise<void> {
    const db = this.getDb.handle()
    await db
      .insert(products)
      .values({
        id: product.id,
        stripeProductId: product.stripeProductId,
        name: product.name,
        description: product.description,
        active: product.active,
        metadata: product.metadata,
        displayOrder: product.displayOrder,
        features: product.features,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      })
      .onDuplicateKeyUpdate({
        set: {
          stripeProductId: product.stripeProductId,
          name: product.name,
          description: product.description,
          active: product.active,
          metadata: product.metadata,
          displayOrder: product.displayOrder,
          features: product.features,
          updatedAt: product.updatedAt
        }
      })
  }

  private toDomain(row: {
    id: string
    stripeProductId: string | null
    name: string
    description: string | null
    active: boolean
    metadata: Record<string, string> | null
    displayOrder: number | null
    features: string[] | null
    createdAt: Date
    updatedAt: Date
  }): Product {
    return Product.reconstruct({
      id: row.id,
      stripeProductId: row.stripeProductId,
      name: row.name,
      description: row.description,
      active: row.active,
      metadata: row.metadata,
      displayOrder: row.displayOrder ?? 0,
      features: row.features,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    })
  }
}
