import { inject, injectable } from "tsyringe"
import { CustomerNotFoundError } from "@/backend/modules/billing/domain/customer/customer.errors"
import type { CustomerRepository } from "@/backend/modules/billing/domain/customer/customer.repository"
import { CustomerRepositoryToken } from "@/backend/modules/billing/domain/customer/customer.repository"
import { SubscriptionNotFoundError } from "@/backend/modules/billing/domain/subscription/subscription.errors"
import type { SubscriptionRepository } from "@/backend/modules/billing/domain/subscription/subscription.repository"
import { SubscriptionRepositoryToken } from "@/backend/modules/billing/domain/subscription/subscription.repository"
import type { GetCurrentUserPort } from "../../../ports/get-current-user.port"
import { GetCurrentUserPortToken } from "../../../ports/get-current-user.port"
import type { ChangeSubscriptionPlanPort } from "../../ports/change-subscription-plan.port"
import { ChangeSubscriptionPlanPortToken } from "../../ports/change-subscription-plan.port"
import type {
  ChangeSubscriptionPlanUseCasePort,
  ChangeSubscriptionPlanUseCasePortInput,
  ChangeSubscriptionPlanUseCasePortOutput
} from "./change-subscription-plan.usecase.port"

@injectable()
export class ChangeSubscriptionPlanUseCase
  implements ChangeSubscriptionPlanUseCasePort
{
  constructor(
    @inject(GetCurrentUserPortToken)
    private readonly getCurrentUser: GetCurrentUserPort,
    @inject(CustomerRepositoryToken)
    private readonly customerRepository: CustomerRepository,
    @inject(SubscriptionRepositoryToken)
    private readonly subscriptionRepository: SubscriptionRepository,
    @inject(ChangeSubscriptionPlanPortToken)
    private readonly changeSubscriptionPlan: ChangeSubscriptionPlanPort
  ) {}

  async handle(
    input: ChangeSubscriptionPlanUseCasePortInput
  ): Promise<ChangeSubscriptionPlanUseCasePortOutput> {
    // 1. 認証ユーザー取得
    const { userId } = await this.getCurrentUser.handle()

    // 2. Customer取得
    const customer = await this.customerRepository.findByUserId(userId)
    if (!customer) {
      throw new CustomerNotFoundError()
    }

    // 3. 現在のSubscription取得
    const subscription = await this.subscriptionRepository.findByCustomerId(
      customer.id
    )
    if (!subscription) {
      throw new SubscriptionNotFoundError()
    }

    // 4. Stripe API: subscription.update({ items: [{ price: newPriceId }] })
    const result = await this.changeSubscriptionPlan.handle({
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      newPriceId: input.newPriceId
    })

    // 5. DBのSubscription.stripePriceId更新
    subscription.updatePriceId(result.stripePriceId)
    await this.subscriptionRepository.save(subscription)

    return {
      subscriptionId: subscription.id,
      stripePriceId: result.stripePriceId
    }
  }
}
