import { inject, injectable } from "tsyringe"
import type { GetCurrentAdminPort } from "@/backend/modules/billing/internal/application/ports/get-current-admin.port"
import { GetCurrentAdminPortToken } from "@/backend/modules/billing/internal/application/ports/get-current-admin.port"
import { Price } from "@/backend/modules/billing/internal/domain/price/price"
import type { PriceRepository } from "@/backend/modules/billing/internal/domain/price/price.repository"
import { PriceRepositoryToken } from "@/backend/modules/billing/internal/domain/price/price.repository"
import type { ProductRepository } from "@/backend/modules/billing/internal/domain/product/product.repository"
import { ProductRepositoryToken } from "@/backend/modules/billing/internal/domain/product/product.repository"
import {
  ProductNotFoundError,
  ProductNotSyncedError
} from "@/backend/modules/billing/public/errors/product.errors"
import type {
  CreatePriceUseCaseInput,
  CreatePriceUseCaseOutput,
  CreatePriceUseCasePort
} from "@/backend/modules/billing/public/ports/create-price.usecase.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { UuidV7GeneratorPort } from "@/backend/modules/shared/application/ports/uuid/uuid-v7-generator.port"
import { UuidV7GeneratorPortToken } from "@/backend/modules/shared/application/ports/uuid/uuid-v7-generator.port"
import type { CreateStripePricePort } from "../../../ports/create-stripe-price.port"
import { CreateStripePricePortToken } from "../../../ports/create-stripe-price.port"

@injectable()
export class CreatePriceUseCase implements CreatePriceUseCasePort {
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(GetCurrentAdminPortToken)
    private readonly getCurrentAdmin: GetCurrentAdminPort,
    @inject(ProductRepositoryToken)
    private readonly productRepository: ProductRepository,
    @inject(PriceRepositoryToken)
    private readonly priceRepository: PriceRepository,
    @inject(CreateStripePricePortToken)
    private readonly createStripePrice: CreateStripePricePort,
    @inject(UuidV7GeneratorPortToken)
    private readonly uuidV7Generator: UuidV7GeneratorPort
  ) {}

  async handle(
    input: CreatePriceUseCaseInput
  ): Promise<CreatePriceUseCaseOutput> {
    this.logger.info("Creating price started", { productId: input.productId })

    // 1. Admin認可チェック
    await this.getCurrentAdmin.handle()

    // 2. 商品存在確認
    const product = await this.productRepository.findById(input.productId)
    if (!product) {
      this.logger.warn("Product not found", { productId: input.productId })
      throw new ProductNotFoundError(input.productId)
    }

    // 3. 商品が Stripe 連携済みか確認
    if (!product.stripeProductId) {
      this.logger.warn("Product not synced with Stripe", {
        productId: input.productId
      })
      throw new ProductNotSyncedError(input.productId)
    }

    const currency = input.currency ?? "jpy"

    // 4. Price エンティティ作成（Stripe ID 未設定）
    const price = Price.create({
      id: this.uuidV7Generator.generate(),
      productId: input.productId,
      currency,
      unitAmount: input.unitAmount,
      type: input.type,
      recurringInterval: input.recurringInterval,
      recurringIntervalCount: input.recurringIntervalCount ?? 1,
      displayName: input.displayName,
      metadata: input.metadata
    })

    // 5. Stripe API で価格作成
    this.logger.info("Creating Stripe price", {
      productId: input.productId,
      stripeProductId: product.stripeProductId,
      unitAmount: input.unitAmount,
      currency
    })
    const stripeResult = await this.createStripePrice.handle({
      productId: product.stripeProductId,
      unitAmount: input.unitAmount,
      currency,
      recurring:
        input.type === "recurring" && input.recurringInterval
          ? {
              interval: input.recurringInterval,
              intervalCount: input.recurringIntervalCount ?? 1
            }
          : undefined,
      metadata: input.metadata
    })

    // 6. Stripe ID を設定
    price.setStripePriceId(stripeResult.id)

    // 7. DB に保存
    await this.priceRepository.save(price)

    this.logger.info("Price created successfully", {
      priceId: price.id,
      stripePriceId: stripeResult.id
    })

    return {
      price: {
        id: price.id,
        productId: price.productId,
        stripePriceId: price.stripePriceId,
        currency: price.currency,
        unitAmount: price.unitAmount,
        type: price.type,
        recurringInterval: price.recurringInterval,
        recurringIntervalCount: price.recurringIntervalCount,
        active: price.active,
        displayName: price.displayName,
        metadata: price.metadata,
        createdAt: price.createdAt,
        updatedAt: price.updatedAt
      }
    }
  }
}
