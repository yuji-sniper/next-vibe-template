export interface PaymentHistoryItem {
  id: string
  amount: number
  currency: string
  status: string
  createdAt: Date
}

export interface FindPaymentHistoryUseCasePortOutput {
  payments: PaymentHistoryItem[]
}

export interface FindPaymentHistoryUseCasePort {
  handle(): Promise<FindPaymentHistoryUseCasePortOutput>
}

export const FindPaymentHistoryUseCasePortToken = Symbol(
  "FindPaymentHistoryUseCasePort"
)
