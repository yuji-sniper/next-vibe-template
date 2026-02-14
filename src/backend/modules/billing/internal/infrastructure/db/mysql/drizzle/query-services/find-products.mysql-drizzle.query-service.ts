import { count, eq } from "drizzle-orm"
import { inject, injectable } from "tsyringe"
import type {
  FindProductsQueryServicePort,
  FindProductsQueryServicePortInput,
  FindProductsQueryServicePortOutput
} from "@/backend/modules/billing/internal/application/queries/usecases/find-products/find-products.query-service.port"
import { GetDb } from "@/backend/modules/shared/infrastructure/db/mysql/drizzle/get-db"
import { prices, products } from "../schemas"

@injectable()
export class FindProductsMysqlDrizzleQueryService
  implements FindProductsQueryServicePort
{
  constructor(
    @inject(GetDb)
    private readonly getDb: GetDb
  ) {}

  async handle(
    input: FindProductsQueryServicePortInput
  ): Promise<FindProductsQueryServicePortOutput> {
    const db = this.getDb.handle()

    const rows = await db
      .select({
        id: products.id,
        stripeProductId: products.stripeProductId,
        name: products.name,
        description: products.description,
        active: products.active,
        displayOrder: products.displayOrder,
        features: products.features,
        metadata: products.metadata,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        priceCount: count(prices.id)
      })
      .from(products)
      .leftJoin(prices, eq(products.id, prices.productId))
      .where(input.activeOnly ? eq(products.active, true) : undefined)
      .groupBy(products.id)

    return {
      products: rows.map((row) => ({
        id: row.id,
        stripeProductId: row.stripeProductId,
        name: row.name,
        description: row.description,
        active: row.active,
        displayOrder: row.displayOrder ?? 0,
        features: row.features ?? null,
        metadata: row.metadata ?? null,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        priceCount: row.priceCount
      }))
    }
  }
}
