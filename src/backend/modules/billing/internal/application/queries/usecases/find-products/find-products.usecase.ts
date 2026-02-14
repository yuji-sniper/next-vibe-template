import { inject, injectable } from "tsyringe"
import type { PriceRepository } from "@/backend/modules/billing/internal/domain/price/price.repository"
import { PriceRepositoryToken } from "@/backend/modules/billing/internal/domain/price/price.repository"
import type {
  FindProductsUseCaseInput,
  FindProductsUseCaseOutput,
  FindProductsUseCasePort,
  ProductWithPrices
} from "@/backend/modules/billing/public/ports/find-products.usecase.port"
import type { FindProductsQueryServicePort } from "./find-products.query-service.port"
import { FindProductsQueryServicePortToken } from "./find-products.query-service.port"

@injectable()
export class FindProductsUseCase implements FindProductsUseCasePort {
  constructor(
    @inject(FindProductsQueryServicePortToken)
    private readonly findProductsQueryService: FindProductsQueryServicePort,
    @inject(PriceRepositoryToken)
    private readonly priceRepository: PriceRepository
  ) {}

  async handle(
    input: FindProductsUseCaseInput
  ): Promise<FindProductsUseCaseOutput> {
    // 1. 商品一覧 + priceCount を一括取得
    const { products } = await this.findProductsQueryService.handle({
      activeOnly: input.activeOnly
    })

    // 2. displayOrder 順にソート
    const sortedProducts = products.sort(
      (a, b) => a.displayOrder - b.displayOrder
    )

    // 3. 商品を DTO に変換（価格詳細取得はオプション）
    const productsWithPrices: ProductWithPrices[] = await Promise.all(
      sortedProducts.map(async (product) => {
        const result: ProductWithPrices = {
          id: product.id,
          stripeProductId: product.stripeProductId,
          name: product.name,
          description: product.description,
          active: product.active,
          displayOrder: product.displayOrder,
          features: product.features,
          metadata: product.metadata,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          priceCount: product.priceCount
        }

        if (input.includePrices) {
          const prices = await this.priceRepository.findByProductId(product.id)
          result.prices = prices.map((price) => ({
            id: price.id,
            stripePriceId: price.stripePriceId,
            unitAmount: price.unitAmount,
            currency: price.currency,
            type: price.type,
            recurringInterval: price.recurringInterval,
            displayName: price.displayName,
            active: price.active
          }))
        }

        return result
      })
    )

    return {
      products: productsWithPrices
    }
  }
}
