import { inject, injectable } from "tsyringe"
import type { GetAuthUserPort } from "@/backend/modules/auth/application/queries/ports/get-auth-user.port"
import { GetAuthUserPortToken } from "@/backend/modules/auth/application/queries/ports/get-auth-user.port"
import type { CustomerRepository } from "@/backend/modules/billing/domain/customer/customer.repository"
import { CustomerRepositoryToken } from "@/backend/modules/billing/domain/customer/customer.repository"
import type { SubscriptionRepository } from "@/backend/modules/billing/domain/subscription/subscription.repository"
import { SubscriptionRepositoryToken } from "@/backend/modules/billing/domain/subscription/subscription.repository"
import type {
  FindSubscriptionUseCasePort,
  FindSubscriptionUseCasePortOutput
} from "./find-subscription.usecase.port"

@injectable()
export class FindSubscriptionUseCase implements FindSubscriptionUseCasePort {
  constructor(
    @inject(GetAuthUserPortToken)
    private readonly getAuthUser: GetAuthUserPort,
    @inject(CustomerRepositoryToken)
    private readonly customerRepository: CustomerRepository,
    @inject(SubscriptionRepositoryToken)
    private readonly subscriptionRepository: SubscriptionRepository
  ) {}

  async handle(): Promise<FindSubscriptionUseCasePortOutput> {
    // 1. 認証ユーザー取得
    const { authUser } = await this.getAuthUser.handle()

    // 2. Customer取得
    const customer = await this.customerRepository.findByUserId(authUser.id)
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
