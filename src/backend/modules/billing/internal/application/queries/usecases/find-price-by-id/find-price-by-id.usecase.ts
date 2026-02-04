import { inject, injectable } from "tsyringe"
import type { PriceRepository } from "@/backend/modules/billing/internal/domain/price/price.repository"
import { PriceRepositoryToken } from "@/backend/modules/billing/internal/domain/price/price.repository"
import { PriceNotFoundError } from "@/backend/modules/billing/public/errors/price.errors"
import type {
  FindPriceByIdUseCaseInput,
  FindPriceByIdUseCaseOutput,
  FindPriceByIdUseCasePort
} from "@/backend/modules/billing/public/ports/find-price-by-id.usecase.port"

@injectable()
export class FindPriceByIdUseCase implements FindPriceByIdUseCasePort {
  constructor(
    @inject(PriceRepositoryToken)
    private readonly priceRepository: PriceRepository
  ) {}

  async handle(
    input: FindPriceByIdUseCaseInput
  ): Promise<FindPriceByIdUseCaseOutput> {
    // 1. 価格取得
    const price = await this.priceRepository.findById(input.priceId)

    // 2. 存在しなければ PriceNotFoundError
    if (!price) {
      throw new PriceNotFoundError(input.priceId)
    }

    // 3. DTO形式で返す
    return {
      price: {
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
      }
    }
  }
}
