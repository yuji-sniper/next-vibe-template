import { inject, injectable } from "tsyringe"
import { Customer } from "@/backend/modules/billing/domain/customer/customer"
import type { CustomerRepository } from "@/backend/modules/billing/domain/customer/customer.repository"
import { CustomerRepositoryToken } from "@/backend/modules/billing/domain/customer/customer.repository"
import type { Transactor } from "@/backend/modules/shared/application/ports/db/transactor.port"
import { TransactorToken } from "@/backend/modules/shared/application/ports/db/transactor.port"
import type { UuidV7GeneratorPort } from "@/backend/modules/shared/application/ports/uuid/uuid-v7-generator.port"
import { UuidV7GeneratorPortToken } from "@/backend/modules/shared/application/ports/uuid/uuid-v7-generator.port"
import type { GetCurrentUserPort } from "../../../ports/get-current-user.port"
import { GetCurrentUserPortToken } from "../../../ports/get-current-user.port"
import type { CreateCheckoutSessionPort } from "../../ports/create-checkout-session.port"
import { CreateCheckoutSessionPortToken } from "../../ports/create-checkout-session.port"
import type { CreateStripeCustomerPort } from "../../ports/create-stripe-customer.port"
import { CreateStripeCustomerPortToken } from "../../ports/create-stripe-customer.port"
import type {
  CreateCheckoutSessionUseCasePort,
  CreateCheckoutSessionUseCasePortInput,
  CreateCheckoutSessionUseCasePortOutput
} from "./create-checkout-session.usecase.port"

@injectable()
export class CreateCheckoutSessionUseCase
  implements CreateCheckoutSessionUseCasePort
{
  constructor(
    @inject(TransactorToken)
    private readonly transactor: Transactor,
    @inject(GetCurrentUserPortToken)
    private readonly getCurrentUser: GetCurrentUserPort,
    @inject(CustomerRepositoryToken)
    private readonly customerRepository: CustomerRepository,
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
    // 1. 認証ユーザー取得
    const { userId, email } = await this.getCurrentUser.handle()

    // 2. Customer取得または作成（トランザクション内）
    const customer = await this.transactor.execute(async () => {
      return await this.getOrCreateCustomer(userId, email)
    })

    // 3. Checkout Session作成
    const { sessionUrl } = await this.createCheckoutSession.handle({
      stripeCustomerId: customer.stripeCustomerId,
      priceId: input.priceId,
      successUrl: input.successUrl,
      cancelUrl: input.cancelUrl
    })

    // 4. sessionUrlを返却（Paymentレコードはcheckout.session.completedで作成）
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
