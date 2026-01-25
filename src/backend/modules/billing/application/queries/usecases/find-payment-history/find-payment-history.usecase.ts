import { inject, injectable } from "tsyringe"
import type { GetAuthUserPort } from "@/backend/modules/auth/application/queries/ports/get-auth-user.port"
import { GetAuthUserPortToken } from "@/backend/modules/auth/application/queries/ports/get-auth-user.port"
import type { CustomerRepository } from "@/backend/modules/billing/domain/customer/customer.repository"
import { CustomerRepositoryToken } from "@/backend/modules/billing/domain/customer/customer.repository"
import type { PaymentRepository } from "@/backend/modules/billing/domain/payment/payment.repository"
import { PaymentRepositoryToken } from "@/backend/modules/billing/domain/payment/payment.repository"
import type {
  FindPaymentHistoryUseCasePort,
  FindPaymentHistoryUseCasePortOutput
} from "./find-payment-history.usecase.port"

@injectable()
export class FindPaymentHistoryUseCase
  implements FindPaymentHistoryUseCasePort
{
  constructor(
    @inject(GetAuthUserPortToken)
    private readonly getAuthUser: GetAuthUserPort,
    @inject(CustomerRepositoryToken)
    private readonly customerRepository: CustomerRepository,
    @inject(PaymentRepositoryToken)
    private readonly paymentRepository: PaymentRepository
  ) {}

  async handle(): Promise<FindPaymentHistoryUseCasePortOutput> {
    // 1. 認証ユーザー取得
    const { authUser } = await this.getAuthUser.handle()

    // 2. Customer取得
    const customer = await this.customerRepository.findByUserId(authUser.id)
    if (!customer) {
      return { payments: [] }
    }

    // 3. 決済履歴取得
    const payments = await this.paymentRepository.findByCustomerId(customer.id)

    return {
      payments: payments.map((payment) => ({
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        createdAt: payment.createdAt
      }))
    }
  }
}
