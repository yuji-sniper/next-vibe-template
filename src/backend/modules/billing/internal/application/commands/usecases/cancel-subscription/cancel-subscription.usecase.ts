import { inject, injectable } from "tsyringe"
import type { CustomerRepository } from "@/backend/modules/billing/internal/domain/customer/customer.repository"
import { CustomerRepositoryToken } from "@/backend/modules/billing/internal/domain/customer/customer.repository"
import type { SubscriptionRepository } from "@/backend/modules/billing/internal/domain/subscription/subscription.repository"
import { SubscriptionRepositoryToken } from "@/backend/modules/billing/internal/domain/subscription/subscription.repository"
import { CustomerNotFoundError } from "@/backend/modules/billing/public/errors/customer.errors"
import { SubscriptionNotFoundError } from "@/backend/modules/billing/public/errors/subscription.errors"
import type {
  CancelSubscriptionUseCasePort,
  CancelSubscriptionUseCasePortInput,
  CancelSubscriptionUseCasePortOutput
} from "@/backend/modules/billing/public/ports/cancel-subscription.usecase.port"
import type { Transactor } from "@/backend/modules/shared/application/ports/db/transactor.port"
import { TransactorToken } from "@/backend/modules/shared/application/ports/db/transactor.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { CancelSubscriptionPort } from "../../../ports/cancel-subscription.port"
import { CancelSubscriptionPortToken } from "../../../ports/cancel-subscription.port"
import type { GetCurrentUserPort } from "../../../ports/get-current-user.port"
import { GetCurrentUserPortToken } from "../../../ports/get-current-user.port"

@injectable()
export class CancelSubscriptionUseCase
  implements CancelSubscriptionUseCasePort
{
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(TransactorToken)
    private readonly transactor: Transactor,
    @inject(GetCurrentUserPortToken)
    private readonly getCurrentUser: GetCurrentUserPort,
    @inject(CustomerRepositoryToken)
    private readonly customerRepository: CustomerRepository,
    @inject(SubscriptionRepositoryToken)
    private readonly subscriptionRepository: SubscriptionRepository,
    @inject(CancelSubscriptionPortToken)
    private readonly cancelSubscription: CancelSubscriptionPort
  ) {}

  async handle(
    input?: CancelSubscriptionUseCasePortInput
  ): Promise<CancelSubscriptionUseCasePortOutput> {
    this.logger.info("Canceling subscription started")

    // 1. 認証ユーザー取得
    const { userId } = await this.getCurrentUser.handle()

    // 2. Customer取得
    const customer = await this.customerRepository.findByUserId(userId)
    if (!customer) {
      this.logger.warn("Customer not found", { userId })
      throw new CustomerNotFoundError()
    }

    // 3. Subscription取得
    const subscription = await this.subscriptionRepository.findByCustomerId(
      customer.id
    )
    if (!subscription) {
      this.logger.warn("Subscription not found", { customerId: customer.id })
      throw new SubscriptionNotFoundError()
    }

    // 4. Stripe API: subscription.update({ cancel_at_period_end: true })
    const cancelAtPeriodEnd = input?.cancelAtPeriodEnd ?? true
    this.logger.info("Canceling Stripe subscription", {
      subscriptionId: subscription.id,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      cancelAtPeriodEnd
    })
    const result = await this.cancelSubscription.handle({
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      cancelAtPeriodEnd
    })

    // 5. DBのSubscription更新（トランザクション内）
    await this.transactor.execute(async () => {
      subscription.setCancelAtPeriodEnd(result.cancelAtPeriodEnd)
      await this.subscriptionRepository.save(subscription)
    })

    this.logger.info("Subscription canceled successfully", {
      subscriptionId: subscription.id,
      cancelAtPeriodEnd: result.cancelAtPeriodEnd
    })

    return {
      subscriptionId: subscription.id,
      cancelAtPeriodEnd: result.cancelAtPeriodEnd,
      currentPeriodEnd: result.currentPeriodEnd
        ? new Date(result.currentPeriodEnd * 1000)
        : null
    }
  }
}
