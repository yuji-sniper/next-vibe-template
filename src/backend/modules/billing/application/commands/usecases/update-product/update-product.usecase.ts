import { inject, injectable } from "tsyringe"
import { ProductNotFoundError } from "@/backend/modules/billing/domain/product/product.errors"
import type { ProductRepository } from "@/backend/modules/billing/domain/product/product.repository"
import { ProductRepositoryToken } from "@/backend/modules/billing/domain/product/product.repository"
import type { UpdateStripeProductPort } from "../../ports/update-stripe-product.port"
import { UpdateStripeProductPortToken } from "../../ports/update-stripe-product.port"
import type {
  UpdateProductUseCaseInput,
  UpdateProductUseCaseOutput,
  UpdateProductUseCasePort
} from "./update-product.usecase.port"

@injectable()
export class UpdateProductUseCase implements UpdateProductUseCasePort {
  constructor(
    @inject(ProductRepositoryToken)
    private readonly productRepository: ProductRepository,
    @inject(UpdateStripeProductPortToken)
    private readonly updateStripeProduct: UpdateStripeProductPort
  ) {}

  async handle(
    input: UpdateProductUseCaseInput
  ): Promise<UpdateProductUseCaseOutput> {
    // 1. 商品取得（存在確認）
    const product = await this.productRepository.findById(input.productId)
    if (!product) {
      throw new ProductNotFoundError(input.productId)
    }

    // 2. エンティティの更新
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

    // 3. Stripe連携済みなら Stripe API 更新
    if (product.stripeProductId) {
      await this.updateStripeProduct.handle({
        stripeProductId: product.stripeProductId,
        name: input.name,
        description: input.description,
        active: input.active,
        metadata: input.metadata
      })
    }

    // 4. DB 更新
    await this.productRepository.save(product)

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
