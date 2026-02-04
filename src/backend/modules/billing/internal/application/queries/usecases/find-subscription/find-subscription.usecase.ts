import { inject, injectable } from "tsyringe"
import type { CustomerRepository } from "@/backend/modules/billing/internal/domain/customer/customer.repository"
import { CustomerRepositoryToken } from "@/backend/modules/billing/internal/domain/customer/customer.repository"
import type { PriceRepository } from "@/backend/modules/billing/internal/domain/price/price.repository"
import { PriceRepositoryToken } from "@/backend/modules/billing/internal/domain/price/price.repository"
import type { ProductRepository } from "@/backend/modules/billing/internal/domain/product/product.repository"
import { ProductRepositoryToken } from "@/backend/modules/billing/internal/domain/product/product.repository"
import type { SubscriptionRepository } from "@/backend/modules/billing/internal/domain/subscription/subscription.repository"
import { SubscriptionRepositoryToken } from "@/backend/modules/billing/internal/domain/subscription/subscription.repository"
import type {
  FindSubscriptionUseCasePort,
  FindSubscriptionUseCasePortInput,
  FindSubscriptionUseCasePortOutput
} from "@/backend/modules/billing/public/ports/find-subscription.usecase.port"
import type { GetCurrentUserPort } from "../../../ports/get-current-user.port"
import { GetCurrentUserPortToken } from "../../../ports/get-current-user.port"

@injectable()
export class FindSubscriptionUseCase implements FindSubscriptionUseCasePort {
  constructor(
    @inject(GetCurrentUserPortToken)
    private readonly getCurrentUser: GetCurrentUserPort,
    @inject(CustomerRepositoryToken)
    private readonly customerRepository: CustomerRepository,
    @inject(SubscriptionRepositoryToken)
    private readonly subscriptionRepository: SubscriptionRepository,
    @inject(PriceRepositoryToken)
    private readonly priceRepository: PriceRepository,
    @inject(ProductRepositoryToken)
    private readonly productRepository: ProductRepository
  ) {}

  async handle(
    input?: FindSubscriptionUseCasePortInput
  ): Promise<FindSubscriptionUseCasePortOutput> {
    // 1. 認証ユーザー取得
    const { userId } = await this.getCurrentUser.handle()

    // 2. Customer取得
    const customer = await this.customerRepository.findByUserId(userId)
    if (!customer) {
      return { subscription: undefined }
    }

    // 3. Subscription取得
    const subscription = await this.subscriptionRepository.findByCustomerId(
      customer.id
    )
    if (!subscription) {
      return { subscription: undefined }
    }

    // 4. Product情報取得（includeProduct が true の場合）
    const product = input?.includeProduct
      ? await this.findProduct(subscription.stripePriceId)
      : undefined

    return {
      subscription: {
        id: subscription.id,
        customerId: subscription.customerId,
        stripeSubscriptionId: subscription.stripeSubscriptionId,
        stripePriceId: subscription.stripePriceId,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        createdAt: subscription.createdAt,
        updatedAt: subscription.updatedAt,
        product
      }
    }
  }

  private async findProduct(stripePriceId: string) {
    const price = await this.priceRepository.findByStripePriceId(stripePriceId)
    if (!price) {
      return undefined
    }

    const product = await this.productRepository.findById(price.productId)
    if (!product) {
      return undefined
    }

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      features: product.features,
      price: {
        id: price.id,
        stripePriceId: price.stripePriceId,
        unitAmount: price.unitAmount,
        currency: price.currency,
        type: price.type,
        recurringInterval: price.recurringInterval,
        displayName: price.displayName
      }
    }
  }
}
