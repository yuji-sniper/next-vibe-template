import { inject, injectable } from "tsyringe"
import type { PriceRepository } from "@/backend/modules/billing/domain/price/price.repository"
import { PriceRepositoryToken } from "@/backend/modules/billing/domain/price/price.repository"
import type { ProductRepository } from "@/backend/modules/billing/domain/product/product.repository"
import { ProductRepositoryToken } from "@/backend/modules/billing/domain/product/product.repository"
import type {
  FindProductsUseCaseInput,
  FindProductsUseCaseOutput,
  FindProductsUseCasePort,
  ProductWithPrices
} from "./find-products.usecase.port"

@injectable()
export class FindProductsUseCase implements FindProductsUseCasePort {
  constructor(
    @inject(ProductRepositoryToken)
    private readonly productRepository: ProductRepository,
    @inject(PriceRepositoryToken)
    private readonly priceRepository: PriceRepository
  ) {}

  async handle(
    input: FindProductsUseCaseInput
  ): Promise<FindProductsUseCaseOutput> {
    // 1. 商品一覧取得
    const products = await this.productRepository.findAll({
      activeOnly: input.activeOnly
    })

    // 2. displayOrder 順にソート
    const sortedProducts = products.sort(
      (a, b) => a.displayOrder - b.displayOrder
    )

    // 3. 商品を DTO に変換（価格取得はオプション）
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
          updatedAt: product.updatedAt
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
