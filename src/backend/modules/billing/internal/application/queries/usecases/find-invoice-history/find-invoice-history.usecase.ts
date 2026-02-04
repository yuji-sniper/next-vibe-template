import { inject, injectable } from "tsyringe"
import type { GetCurrentUserPort } from "@/backend/modules/billing/internal/application/ports/get-current-user.port"
import { GetCurrentUserPortToken } from "@/backend/modules/billing/internal/application/ports/get-current-user.port"
import type { CustomerRepository } from "@/backend/modules/billing/internal/domain/customer/customer.repository"
import { CustomerRepositoryToken } from "@/backend/modules/billing/internal/domain/customer/customer.repository"
import type { InvoiceRepository } from "@/backend/modules/billing/internal/domain/invoice/invoice.repository"
import { InvoiceRepositoryToken } from "@/backend/modules/billing/internal/domain/invoice/invoice.repository"
import type {
  FindInvoiceHistoryUseCasePort,
  FindInvoiceHistoryUseCasePortOutput
} from "@/backend/modules/billing/public/ports/find-invoice-history.usecase.port"

@injectable()
export class FindInvoiceHistoryUseCase
  implements FindInvoiceHistoryUseCasePort
{
  constructor(
    @inject(GetCurrentUserPortToken)
    private readonly getCurrentUser: GetCurrentUserPort,
    @inject(CustomerRepositoryToken)
    private readonly customerRepository: CustomerRepository,
    @inject(InvoiceRepositoryToken)
    private readonly invoiceRepository: InvoiceRepository
  ) {}

  async handle(): Promise<FindInvoiceHistoryUseCasePortOutput> {
    // 1. 認証ユーザー取得
    const { userId } = await this.getCurrentUser.handle()

    // 2. Customer取得
    const customer = await this.customerRepository.findByUserId(userId)
    if (!customer) {
      return { invoices: [] }
    }

    // 3. インボイス履歴取得
    const invoices = await this.invoiceRepository.findByCustomerId(customer.id)

    return {
      invoices: invoices.map((invoice) => ({
        id: invoice.id,
        amount: invoice.amount,
        currency: invoice.currency,
        status: invoice.status,
        paidAt: invoice.paidAt,
        createdAt: invoice.createdAt
      }))
    }
  }
}
