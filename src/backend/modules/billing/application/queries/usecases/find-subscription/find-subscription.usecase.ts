import { inject, injectable } from "tsyringe"
import type { CustomerRepository } from "@/backend/modules/billing/domain/customer/customer.repository"
import { CustomerRepositoryToken } from "@/backend/modules/billing/domain/customer/customer.repository"
import type { SubscriptionRepository } from "@/backend/modules/billing/domain/subscription/subscription.repository"
import { SubscriptionRepositoryToken } from "@/backend/modules/billing/domain/subscription/subscription.repository"
import type { GetCurrentUserPort } from "../../../ports/get-current-user.port"
import { GetCurrentUserPortToken } from "../../../ports/get-current-user.port"
import type {
  FindSubscriptionUseCasePort,
  FindSubscriptionUseCasePortOutput
} from "./find-subscription.usecase.port"

@injectable()
export class FindSubscriptionUseCase implements FindSubscriptionUseCasePort {
  constructor(
    @inject(GetCurrentUserPortToken)
    private readonly getCurrentUser: GetCurrentUserPort,
    @inject(CustomerRepositoryToken)
    private readonly customerRepository: CustomerRepository,
    @inject(SubscriptionRepositoryToken)
    private readonly subscriptionRepository: SubscriptionRepository
  ) {}

  async handle(): Promise<FindSubscriptionUseCasePortOutput> {
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
        updatedAt: subscription.updatedAt
      }
    }
  }
}
