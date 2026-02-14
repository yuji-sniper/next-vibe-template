import { inject, injectable } from "tsyringe"
import { Customer } from "@/backend/modules/billing/internal/domain/customer/customer"
import type { CustomerRepository } from "@/backend/modules/billing/internal/domain/customer/customer.repository"
import { CustomerRepositoryToken } from "@/backend/modules/billing/internal/domain/customer/customer.repository"
import type { PriceRepository } from "@/backend/modules/billing/internal/domain/price/price.repository"
import { PriceRepositoryToken } from "@/backend/modules/billing/internal/domain/price/price.repository"
import { PriceNotFoundError } from "@/backend/modules/billing/public/errors/price.errors"
import type {
  CreateCheckoutSessionUseCasePort,
  CreateCheckoutSessionUseCasePortInput,
  CreateCheckoutSessionUseCasePortOutput
} from "@/backend/modules/billing/public/ports/create-checkout-session.usecase.port"
import type { Transactor } from "@/backend/modules/shared/application/ports/db/transactor.port"
import { TransactorToken } from "@/backend/modules/shared/application/ports/db/transactor.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { UuidV7GeneratorPort } from "@/backend/modules/shared/application/ports/uuid/uuid-v7-generator.port"
import { UuidV7GeneratorPortToken } from "@/backend/modules/shared/application/ports/uuid/uuid-v7-generator.port"
import type { CreateCheckoutSessionPort } from "../../../ports/create-checkout-session.port"
import {
  CHECKOUT_SESSION_MODE,
  CreateCheckoutSessionPortToken
} from "../../../ports/create-checkout-session.port"
import type { CreateStripeCustomerPort } from "../../../ports/create-stripe-customer.port"
import { CreateStripeCustomerPortToken } from "../../../ports/create-stripe-customer.port"
import type { GetCurrentUserPort } from "../../../ports/get-current-user.port"
import { GetCurrentUserPortToken } from "../../../ports/get-current-user.port"

@injectable()
export class CreateCheckoutSessionUseCase
  implements CreateCheckoutSessionUseCasePort
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
    @inject(PriceRepositoryToken)
    private readonly priceRepository: PriceRepository,
    @inject(CreateStripeCustomerPortToken)
    private readonly createStripeCustomer: CreateStripeCustomerPort,
    @inject(CreateCheckoutSessionPortToken)
    private readonly createCheckoutSession: CreateCheckoutSessionPort,
    @inject(UuidV7GeneratorPortToken)
    private readonly uuidV7Generator: UuidV7GeneratorPort
  ) {}

  async handle(
    input: CreateCheckoutSessionUseCasePortInput
  ): Promise<CreateCheckoutSessionUseCasePortOutput> {
    this.logger.info("Creating checkout session started", {
      priceId: input.priceId
    })

    // 1. 認証ユーザー取得
    const { userId, email } = await this.getCurrentUser.handle()

    // 2. Price取得
    const price = await this.priceRepository.findById(input.priceId)
    if (!price || !price.stripePriceId) {
      this.logger.warn("Price not found", { priceId: input.priceId })
      throw new PriceNotFoundError()
    }

    // 3. Customer取得または作成（トランザクション内）
    const customer = await this.transactor.execute(async () => {
      return await this.getOrCreateCustomer(userId, email)
    })

    // 4. Checkout Session作成（modeはPriceのtypeから自動判定）
    const mode = price.isRecurring
      ? CHECKOUT_SESSION_MODE.SUBSCRIPTION
      : CHECKOUT_SESSION_MODE.PAYMENT

    this.logger.info("Creating Stripe checkout session", {
      priceId: input.priceId,
      stripePriceId: price.stripePriceId,
      customerId: customer.id,
      mode
    })
    const { sessionUrl } = await this.createCheckoutSession.handle({
      stripeCustomerId: customer.stripeCustomerId,
      stripePriceId: price.stripePriceId,
      successUrl: input.successUrl,
      cancelUrl: input.cancelUrl,
      mode
    })

    this.logger.info("Checkout session created successfully", {
      priceId: input.priceId,
      customerId: customer.id
    })

    // 5. sessionUrlを返却（レコードはcheckout.session.completedで作成）
    return { sessionUrl }
  }

  private async getOrCreateCustomer(
    userId: string,
    email: string
  ): Promise<Customer> {
    const existing = await this.customerRepository.findByUserId(userId)
    if (existing) {
      return existing
    }

    const { stripeCustomerId } = await this.createStripeCustomer.handle({
      userId,
      email
    })
    const customer = Customer.create({
      id: this.uuidV7Generator.generate(),
      userId,
      stripeCustomerId,
      email
    })
    await this.customerRepository.save(customer)
    return customer
  }
}
