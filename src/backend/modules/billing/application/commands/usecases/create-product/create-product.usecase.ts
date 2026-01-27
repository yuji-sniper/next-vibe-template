import { inject, injectable } from "tsyringe"
import type { RequireAuthAdminPort } from "@/backend/modules/billing/application/ports/require-auth-admin.port"
import { RequireAuthAdminPortToken } from "@/backend/modules/billing/application/ports/require-auth-admin.port"
import { Product } from "@/backend/modules/billing/domain/product/product"
import type { ProductRepository } from "@/backend/modules/billing/domain/product/product.repository"
import { ProductRepositoryToken } from "@/backend/modules/billing/domain/product/product.repository"
import type { UuidV7GeneratorPort } from "@/backend/modules/shared/application/ports/uuid/uuid-v7-generator.port"
import { UuidV7GeneratorPortToken } from "@/backend/modules/shared/application/ports/uuid/uuid-v7-generator.port"
import type { CreateStripeProductPort } from "../../ports/create-stripe-product.port"
import { CreateStripeProductPortToken } from "../../ports/create-stripe-product.port"
import type {
  CreateProductUseCaseInput,
  CreateProductUseCaseOutput,
  CreateProductUseCasePort
} from "./create-product.usecase.port"

@injectable()
export class CreateProductUseCase implements CreateProductUseCasePort {
  constructor(
    @inject(RequireAuthAdminPortToken)
    private readonly requireAuthAdmin: RequireAuthAdminPort,
    @inject(ProductRepositoryToken)
    private readonly productRepository: ProductRepository,
    @inject(CreateStripeProductPortToken)
    private readonly createStripeProduct: CreateStripeProductPort,
    @inject(UuidV7GeneratorPortToken)
    private readonly uuidV7Generator: UuidV7GeneratorPort
  ) {}

  async handle(
    input: CreateProductUseCaseInput
  ): Promise<CreateProductUseCaseOutput> {
    // 1. Admin認可チェック
    await this.requireAuthAdmin.handle()

    // 2. Product エンティティ作成（Stripe ID未設定）
    const product = Product.create({
      id: this.uuidV7Generator.generate(),
      name: input.name,
      description: input.description,
      features: input.features,
      displayOrder: input.displayOrder,
      metadata: input.metadata
    })

    // 3. Stripe API で商品作成
    const stripeResult = await this.createStripeProduct.handle({
      name: input.name,
      description: input.description,
      metadata: input.metadata
    })

    // 4. Stripe ID を設定
    product.setStripeProductId(stripeResult.id)

    // 5. DB に保存
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
