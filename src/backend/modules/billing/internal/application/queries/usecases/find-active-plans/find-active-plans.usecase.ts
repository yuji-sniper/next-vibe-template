import { inject, injectable } from "tsyringe"
import type { PriceRepository } from "@/backend/modules/billing/internal/domain/price/price.repository"
import { PriceRepositoryToken } from "@/backend/modules/billing/internal/domain/price/price.repository"
import type { ProductRepository } from "@/backend/modules/billing/internal/domain/product/product.repository"
import { ProductRepositoryToken } from "@/backend/modules/billing/internal/domain/product/product.repository"
import type {
  FindActivePlansUseCaseInput,
  FindActivePlansUseCaseOutput,
  FindActivePlansUseCasePort,
  Plan
} from "@/backend/modules/billing/public/ports/find-active-plans.usecase.port"

@injectable()
export class FindActivePlansUseCase implements FindActivePlansUseCasePort {
  constructor(
    @inject(ProductRepositoryToken)
    private readonly productRepository: ProductRepository,
    @inject(PriceRepositoryToken)
    private readonly priceRepository: PriceRepository
  ) {}

  async handle(
    input?: FindActivePlansUseCaseInput
  ): Promise<FindActivePlansUseCaseOutput> {
    // 1. アクティブ商品一覧取得
    const products = await this.productRepository.findAll({ activeOnly: true })

    // 2. Stripe連携済みの商品のみフィルタ
    const syncedProducts = products.filter(
      (product) => product.stripeProductId !== null
    )

    // 3. displayOrder 順にソート
    const sortedProducts = syncedProducts.sort(
      (a, b) => a.displayOrder - b.displayOrder
    )

    // 4. 各商品のアクティブ価格取得 + Stripe連携済みフィルタ
    const plans: Plan[] = []

    for (const product of sortedProducts) {
      const prices = await this.priceRepository.findByProductId(product.id, {
        activeOnly: true
      })

      // Stripe連携済みの価格のみフィルタ
      let syncedPrices = prices.filter((price) => price.stripePriceId !== null)

      // priceType が指定されている場合、追加フィルタ
      if (input?.priceType) {
        syncedPrices = syncedPrices.filter(
          (price) => price.type === input.priceType
        )
      }

      // 価格が1つ以上ある商品のみ返却
      if (syncedPrices.length > 0) {
        plans.push({
          product: {
            id: product.id,
            name: product.name,
            description: product.description,
            features: product.features,
            displayOrder: product.displayOrder
          },
          prices: syncedPrices.map((price) => ({
            id: price.id,
            stripePriceId: price.stripePriceId as string,
            unitAmount: price.unitAmount,
            currency: price.currency,
            type: price.type,
            recurringInterval: price.recurringInterval,
            displayName: price.displayName
          }))
        })
      }
    }

    return { plans }
  }
}
