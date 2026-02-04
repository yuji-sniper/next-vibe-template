import { inject, injectable } from "tsyringe"
import type { CustomerRepository } from "@/backend/modules/billing/internal/domain/customer/customer.repository"
import { CustomerRepositoryToken } from "@/backend/modules/billing/internal/domain/customer/customer.repository"
import type { PaymentRepository } from "@/backend/modules/billing/internal/domain/payment/payment.repository"
import { PaymentRepositoryToken } from "@/backend/modules/billing/internal/domain/payment/payment.repository"
import type {
  FindPaymentHistoryUseCasePort,
  FindPaymentHistoryUseCasePortOutput
} from "@/backend/modules/billing/public/ports/find-payment-history.usecase.port"
import type { GetCurrentUserPort } from "../../../ports/get-current-user.port"
import { GetCurrentUserPortToken } from "../../../ports/get-current-user.port"

@injectable()
export class FindPaymentHistoryUseCase
  implements FindPaymentHistoryUseCasePort
{
  constructor(
    @inject(GetCurrentUserPortToken)
    private readonly getCurrentUser: GetCurrentUserPort,
    @inject(CustomerRepositoryToken)
    private readonly customerRepository: CustomerRepository,
    @inject(PaymentRepositoryToken)
    private readonly paymentRepository: PaymentRepository
  ) {}

  async handle(): Promise<FindPaymentHistoryUseCasePortOutput> {
    // 1. 認証ユーザー取得
    const { userId } = await this.getCurrentUser.handle()

    // 2. Customer取得
    const customer = await this.customerRepository.findByUserId(userId)
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
