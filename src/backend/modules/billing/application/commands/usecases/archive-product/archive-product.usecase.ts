import { inject, injectable } from "tsyringe"
import type { RequireAuthAdminPort } from "@/backend/modules/billing/application/ports/require-auth-admin.port"
import { RequireAuthAdminPortToken } from "@/backend/modules/billing/application/ports/require-auth-admin.port"
import { ProductNotFoundError } from "@/backend/modules/billing/domain/product/product.errors"
import type { ProductRepository } from "@/backend/modules/billing/domain/product/product.repository"
import { ProductRepositoryToken } from "@/backend/modules/billing/domain/product/product.repository"
import type { UpdateStripeProductPort } from "../../ports/update-stripe-product.port"
import { UpdateStripeProductPortToken } from "../../ports/update-stripe-product.port"
import type {
  ArchiveProductUseCaseInput,
  ArchiveProductUseCasePort
} from "./archive-product.usecase.port"

@injectable()
export class ArchiveProductUseCase implements ArchiveProductUseCasePort {
  constructor(
    @inject(RequireAuthAdminPortToken)
    private readonly requireAuthAdmin: RequireAuthAdminPort,
    @inject(ProductRepositoryToken)
    private readonly productRepository: ProductRepository,
    @inject(UpdateStripeProductPortToken)
    private readonly updateStripeProduct: UpdateStripeProductPort
  ) {}

  async handle(input: ArchiveProductUseCaseInput): Promise<void> {
    // 1. Admin認可チェック
    await this.requireAuthAdmin.handle()

    // 2. 商品取得（存在確認）
    const product = await this.productRepository.findById(input.productId)
    if (!product) {
      throw new ProductNotFoundError(input.productId)
    }

    // 3. Stripe連携済みなら Stripe で非アクティブ化
    if (product.stripeProductId) {
      await this.updateStripeProduct.handle({
        stripeProductId: product.stripeProductId,
        active: false
      })
    }

    // 4. DB で active=false に更新
    product.archive()
    await this.productRepository.save(product)
  }
}
