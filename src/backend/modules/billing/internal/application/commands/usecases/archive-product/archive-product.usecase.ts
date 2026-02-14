import { inject, injectable } from "tsyringe"
import type { GetCurrentAdminPort } from "@/backend/modules/billing/internal/application/ports/get-current-admin.port"
import { GetCurrentAdminPortToken } from "@/backend/modules/billing/internal/application/ports/get-current-admin.port"
import type { ProductRepository } from "@/backend/modules/billing/internal/domain/product/product.repository"
import { ProductRepositoryToken } from "@/backend/modules/billing/internal/domain/product/product.repository"
import { ProductNotFoundError } from "@/backend/modules/billing/public/errors/product.errors"
import type {
  ArchiveProductUseCaseInput,
  ArchiveProductUseCasePort
} from "@/backend/modules/billing/public/ports/archive-product.usecase.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { UpdateStripeProductPort } from "../../../ports/update-stripe-product.port"
import { UpdateStripeProductPortToken } from "../../../ports/update-stripe-product.port"

@injectable()
export class ArchiveProductUseCase implements ArchiveProductUseCasePort {
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

  async handle(input: ArchiveProductUseCaseInput): Promise<void> {
    this.logger.info("Archiving product started", {
      productId: input.productId
    })

    // 1. Admin認可チェック
    await this.getCurrentAdmin.handle()

    // 2. 商品取得（存在確認）
    const product = await this.productRepository.findById(input.productId)
    if (!product) {
      this.logger.warn("Product not found", { productId: input.productId })
      throw new ProductNotFoundError(input.productId)
    }

    // 3. Stripe連携済みなら Stripe で非アクティブ化
    if (product.stripeProductId) {
      this.logger.info("Archiving Stripe product", {
        productId: input.productId,
        stripeProductId: product.stripeProductId
      })
      await this.updateStripeProduct.handle({
        stripeProductId: product.stripeProductId,
        active: false
      })
    }

    // 4. DB で active=false に更新
    product.archive()
    await this.productRepository.save(product)

    this.logger.info("Product archived successfully", {
      productId: input.productId
    })
  }
}
