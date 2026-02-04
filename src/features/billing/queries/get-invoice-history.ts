import { findInvoiceHistoryAction } from "@/backend/modules/billing/internal/presentation/actions/find-invoice-history/find-invoice-history.action"
import { ServerError } from "@/utils/error/server-error"
import type {
  InvoiceHistoryItem,
  InvoiceStatus
} from "../types/invoice-history"

export type GetInvoiceHistoryQueryResult = {
  invoices: InvoiceHistoryItem[]
}

export const getInvoiceHistoryQuery =
  async (): Promise<GetInvoiceHistoryQueryResult> => {
    const res = await findInvoiceHistoryAction()

    if (!res.ok) {
      throw new ServerError(
        res.error.code,
        res.error.status,
        res.error.message,
        res.error.details
      )
    }

    const invoices: InvoiceHistoryItem[] = res.data.invoices.map((invoice) => ({
      id: invoice.id,
      amount: invoice.amount,
      currency: invoice.currency,
      status: invoice.status as InvoiceStatus,
      paidAt: invoice.paidAt,
      createdAt: invoice.createdAt
    }))

    return { invoices }
  }
