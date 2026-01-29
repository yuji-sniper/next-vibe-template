export type PaymentStatus = "pending" | "succeeded" | "failed" | "canceled"

export type PaymentHistoryItem = {
  id: string
  amount: number
  currency: string
  status: PaymentStatus
  createdAt: string
}
