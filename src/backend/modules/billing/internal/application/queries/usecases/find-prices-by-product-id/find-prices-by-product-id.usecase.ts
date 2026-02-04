import { inject, injectable } from "tsyringe"
import type { PriceRepository } from "@/backend/modules/billing/internal/domain/price/price.repository"
import { PriceRepositoryToken } from "@/backend/modules/billing/internal/domain/price/price.repository"
import type {
  FindPricesByProductIdUseCaseInput,
  FindPricesByProductIdUseCaseOutput,
  FindPricesByProductIdUseCasePort
} from "@/backend/modules/billing/public/ports/find-prices-by-product-id.usecase.port"

@injectable()
export class FindPricesByProductIdUseCase
  implements FindPricesByProductIdUseCasePort
{
  constructor(
    @inject(PriceRepositoryToken)
    private readonly priceRepository: PriceRepository
  ) {}

  async handle(
    input: FindPricesByProductIdUseCaseInput
  ): Promise<FindPricesByProductIdUseCaseOutput> {
    // 価格一覧取得（activeOnly オプション対応）
    const prices = await this.priceRepository.findByProductId(input.productId, {
      activeOnly: input.activeOnly
    })

    // DTO形式で返す
    return {
      prices: prices.map((price) => ({
        id: price.id,
        productId: price.productId,
        stripePriceId: price.stripePriceId,
        unitAmount: price.unitAmount,
        currency: price.currency,
        type: price.type,
        recurringInterval: price.recurringInterval,
        recurringIntervalCount: price.recurringIntervalCount,
        displayName: price.displayName,
        active: price.active,
        metadata: price.metadata,
        createdAt: price.createdAt,
        updatedAt: price.updatedAt
      }))
    }
  }
}
