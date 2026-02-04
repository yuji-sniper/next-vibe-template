import { inject, injectable } from "tsyringe"
import type { PriceRepository } from "@/backend/modules/billing/internal/domain/price/price.repository"
import { PriceRepositoryToken } from "@/backend/modules/billing/internal/domain/price/price.repository"
import type { ProductRepository } from "@/backend/modules/billing/internal/domain/product/product.repository"
import { ProductRepositoryToken } from "@/backend/modules/billing/internal/domain/product/product.repository"
import { ProductNotFoundError } from "@/backend/modules/billing/public/errors/product.errors"
import type {
  FindProductByIdUseCaseInput,
  FindProductByIdUseCaseOutput,
  FindProductByIdUseCasePort
} from "@/backend/modules/billing/public/ports/find-product-by-id.usecase.port"

@injectable()
export class FindProductByIdUseCase implements FindProductByIdUseCasePort {
  constructor(
    @inject(ProductRepositoryToken)
    private readonly productRepository: ProductRepository,
    @inject(PriceRepositoryToken)
    private readonly priceRepository: PriceRepository
  ) {}

  async handle(
    input: FindProductByIdUseCaseInput
  ): Promise<FindProductByIdUseCaseOutput> {
    // 1. 商品取得
    const product = await this.productRepository.findById(input.productId)

    // 2. 存在しなければ ProductNotFoundError
    if (!product) {
      throw new ProductNotFoundError(input.productId)
    }

    // 3. 商品に紐づくプライスを取得
    const prices = await this.priceRepository.findByProductId(input.productId)

    // 4. DTO形式で返す
    return {
      product: {
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
        prices: prices.map((price) => ({
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
        }))
      }
    }
  }
}
