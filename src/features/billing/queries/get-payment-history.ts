import { findPaymentHistoryAction } from "@/backend/modules/billing/internal/presentation/actions/find-payment-history/find-payment-history.action"
import { ServerError } from "@/utils/error/server-error"
import type {
  PaymentHistoryItem,
  PaymentStatus
} from "../types/payment-history"

export type GetPaymentHistoryQueryResult = {
  payments: PaymentHistoryItem[]
}

export const getPaymentHistoryQuery =
  async (): Promise<GetPaymentHistoryQueryResult> => {
    const res = await findPaymentHistoryAction()

    if (!res.ok) {
      throw new ServerError(
        res.error.code,
        res.error.status,
        res.error.message,
        res.error.details
      )
    }

    const payments: PaymentHistoryItem[] = res.data.payments.map((payment) => ({
      id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status as PaymentStatus,
      createdAt: payment.createdAt
    }))

    return { payments }
  }
