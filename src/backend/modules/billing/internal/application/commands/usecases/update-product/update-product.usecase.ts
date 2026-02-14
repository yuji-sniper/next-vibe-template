import { inject, injectable } from "tsyringe"
import type { GetCurrentAdminPort } from "@/backend/modules/billing/internal/application/ports/get-current-admin.port"
import { GetCurrentAdminPortToken } from "@/backend/modules/billing/internal/application/ports/get-current-admin.port"
import type { ProductRepository } from "@/backend/modules/billing/internal/domain/product/product.repository"
import { ProductRepositoryToken } from "@/backend/modules/billing/internal/domain/product/product.repository"
import { ProductNotFoundError } from "@/backend/modules/billing/public/errors/product.errors"
import type {
  UpdateProductUseCaseInput,
  UpdateProductUseCaseOutput,
  UpdateProductUseCasePort
} from "@/backend/modules/billing/public/ports/update-product.usecase.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { UpdateStripeProductPort } from "../../../ports/update-stripe-product.port"
import { UpdateStripeProductPortToken } from "../../../ports/update-stripe-product.port"

@injectable()
export class UpdateProductUseCase implements UpdateProductUseCasePort {
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(GetCurrentAdminPortToken)
    private readonly getCurrentAdmin: GetCurrentAdminPort,
    @inject(ProductRepositoryToken)
    private readonly productRepository: ProductRepository,
    @inject(UpdateStripeProductPortToken)
    private readonly updateStripeProduct: UpdateStripeProductPort
  ) {}

  async handle(
    input: UpdateProductUseCaseInput
  ): Promise<UpdateProductUseCaseOutput> {
    this.logger.info("Updating product started", { productId: input.productId })

    // 1. Admin認可チェック
    await this.getCurrentAdmin.handle()

    // 2. 商品取得（存在確認）
    const product = await this.productRepository.findById(input.productId)
    if (!product) {
      this.logger.warn("Product not found", { productId: input.productId })
      throw new ProductNotFoundError(input.productId)
    }

    // 3. エンティティの更新
    if (input.name !== undefined) {
      product.updateName(input.name)
    }
    if (input.description !== undefined) {
      product.updateDescription(input.description)
    }
    if (input.active !== undefined) {
      if (input.active) {
        product.activate()
      } else {
        product.archive()
      }
    }
    if (input.features !== undefined) {
      product.updateFeatures(input.features)
    }
    if (input.displayOrder !== undefined) {
      product.updateDisplayOrder(input.displayOrder)
    }
    if (input.metadata !== undefined) {
      product.updateMetadata(input.metadata)
    }

    // 4. Stripe連携済みなら Stripe API 更新
    if (product.stripeProductId) {
      this.logger.info("Updating Stripe product", {
        productId: input.productId,
        stripeProductId: product.stripeProductId
      })
      await this.updateStripeProduct.handle({
        stripeProductId: product.stripeProductId,
        name: input.name,
        description: input.description,
        active: input.active,
        metadata: input.metadata
      })
    }

    // 5. DB 更新
    await this.productRepository.save(product)

    this.logger.info("Product updated successfully", {
      productId: input.productId
    })

    return {
      product: {
        id: product.id,
        stripeProductId: product.stripeProductId,
        name: product.name,
        description: product.description,
        active: product.active,
        features: product.features,
        displayOrder: product.displayOrder,
        metadata: product.metadata,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }
    }
  }
}
