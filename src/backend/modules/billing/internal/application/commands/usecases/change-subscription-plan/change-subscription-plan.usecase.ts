import { inject, injectable } from "tsyringe"
import type { CustomerRepository } from "@/backend/modules/billing/internal/domain/customer/customer.repository"
import { CustomerRepositoryToken } from "@/backend/modules/billing/internal/domain/customer/customer.repository"
import type { PriceRepository } from "@/backend/modules/billing/internal/domain/price/price.repository"
import { PriceRepositoryToken } from "@/backend/modules/billing/internal/domain/price/price.repository"
import type { SubscriptionRepository } from "@/backend/modules/billing/internal/domain/subscription/subscription.repository"
import { SubscriptionRepositoryToken } from "@/backend/modules/billing/internal/domain/subscription/subscription.repository"
import { CustomerNotFoundError } from "@/backend/modules/billing/public/errors/customer.errors"
import { PriceNotFoundError } from "@/backend/modules/billing/public/errors/price.errors"
import { SubscriptionNotFoundError } from "@/backend/modules/billing/public/errors/subscription.errors"
import type {
  ChangeSubscriptionPlanUseCasePort,
  ChangeSubscriptionPlanUseCasePortInput,
  ChangeSubscriptionPlanUseCasePortOutput
} from "@/backend/modules/billing/public/ports/change-subscription-plan.usecase.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { ChangeSubscriptionPlanPort } from "../../../ports/change-subscription-plan.port"
import { ChangeSubscriptionPlanPortToken } from "../../../ports/change-subscription-plan.port"
import type { GetCurrentUserPort } from "../../../ports/get-current-user.port"
import { GetCurrentUserPortToken } from "../../../ports/get-current-user.port"

@injectable()
export class ChangeSubscriptionPlanUseCase
  implements ChangeSubscriptionPlanUseCasePort
{
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(GetCurrentUserPortToken)
    private readonly getCurrentUser: GetCurrentUserPort,
    @inject(CustomerRepositoryToken)
    private readonly customerRepository: CustomerRepository,
    @inject(PriceRepositoryToken)
    private readonly priceRepository: PriceRepository,
    @inject(SubscriptionRepositoryToken)
    private readonly subscriptionRepository: SubscriptionRepository,
    @inject(ChangeSubscriptionPlanPortToken)
    private readonly changeSubscriptionPlan: ChangeSubscriptionPlanPort
  ) {}

  async handle(
    input: ChangeSubscriptionPlanUseCasePortInput
  ): Promise<ChangeSubscriptionPlanUseCasePortOutput> {
    this.logger.info("Changing subscription plan started", {
      newPriceId: input.newPriceId
    })

    // 1. 認証ユーザー取得
    const { userId } = await this.getCurrentUser.handle()

    // 2. Customer取得
    const customer = await this.customerRepository.findByUserId(userId)
    if (!customer) {
      this.logger.warn("Customer not found", { userId })
      throw new CustomerNotFoundError()
    }

    // 3. 現在のSubscription取得
    const subscription = await this.subscriptionRepository.findByCustomerId(
      customer.id
    )
    if (!subscription) {
      this.logger.warn("Subscription not found", { customerId: customer.id })
      throw new SubscriptionNotFoundError()
    }

    // 4. 内部PriceIdからStripePriceIdを取得
    const price = await this.priceRepository.findById(input.newPriceId)
    if (!price) {
      this.logger.warn("Price not found", { priceId: input.newPriceId })
      throw new PriceNotFoundError(input.newPriceId)
    }
    if (!price.stripePriceId) {
      this.logger.warn("Stripe price ID not set", {
        priceId: input.newPriceId
      })
      throw new PriceNotFoundError(input.newPriceId)
    }

    // 5. Stripe API: subscription.update({ items: [{ price: stripePriceId }] })
    this.logger.info("Changing Stripe subscription plan", {
      subscriptionId: subscription.id,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      newStripePriceId: price.stripePriceId
    })
    const result = await this.changeSubscriptionPlan.handle({
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      newStripePriceId: price.stripePriceId
    })

    // 6. DBのSubscription.stripePriceId更新
    subscription.updatePriceId(result.stripePriceId)
    await this.subscriptionRepository.save(subscription)

    this.logger.info("Subscription plan changed successfully", {
      subscriptionId: subscription.id,
      stripePriceId: result.stripePriceId
    })

    return {
      subscriptionId: subscription.id,
      stripePriceId: result.stripePriceId
    }
  }
}
