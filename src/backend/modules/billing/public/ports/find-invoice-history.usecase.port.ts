export interface InvoiceHistoryItem {
  id: string
  amount: number
  currency: string
  status: string
  paidAt: Date | null
  createdAt: Date
}

export interface FindInvoiceHistoryUseCasePortOutput {
  invoices: InvoiceHistoryItem[]
}

export interface FindInvoiceHistoryUseCasePort {
  handle(): Promise<FindInvoiceHistoryUseCasePortOutput>
}

export const FindInvoiceHistoryUseCasePortToken = Symbol(
  "FindInvoiceHistoryUseCasePort"
)
