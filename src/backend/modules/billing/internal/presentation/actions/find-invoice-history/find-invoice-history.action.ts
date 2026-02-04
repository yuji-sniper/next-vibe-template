"use server"

import { resolveContainer } from "@/backend/bootstrap/di/container"
import type { FindInvoiceHistoryHandler } from "@/backend/modules/billing/internal/presentation/handlers/find-invoice-history/find-invoice-history.handler"
import { FindInvoiceHistoryHandlerToken } from "@/backend/modules/billing/internal/presentation/handlers/find-invoice-history/find-invoice-history.handler"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { withRequestContext } from "@/backend/modules/shared/presentation/middleware/with-request-context"

type InvoiceHistoryItem = {
  id: string
  amount: number
  currency: string
  status: string
  paidAt: string | null
  createdAt: string
}

export type FindInvoiceHistoryActionResponse = ActionResponse<{
  invoices: InvoiceHistoryItem[]
}>

export const findInvoiceHistoryAction =
  async (): Promise<FindInvoiceHistoryActionResponse> => {
    return withRequestContext(async () => {
      const handler = await resolveContainer<FindInvoiceHistoryHandler>(
        FindInvoiceHistoryHandlerToken
      )
      return handler.handle()
    })
  }
