"use server"

import { resolveContainer } from "@/backend/bootstrap/di/container"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { withRequestContext } from "@/backend/modules/shared/presentation/middleware/with-request-context"
import type { FindPaymentHistoryHandler } from "../../handlers/find-payment-history/find-payment-history.handler"
import { FindPaymentHistoryHandlerToken } from "../../handlers/find-payment-history/find-payment-history.handler"

type PaymentHistoryItem = {
  id: string
  amount: number
  currency: string
  status: string
  createdAt: string
}

export type FindPaymentHistoryActionResponse = ActionResponse<{
  payments: PaymentHistoryItem[]
}>

export const findPaymentHistoryAction =
  async (): Promise<FindPaymentHistoryActionResponse> => {
    return withRequestContext(async () => {
      const handler = await resolveContainer<FindPaymentHistoryHandler>(
        FindPaymentHistoryHandlerToken
      )
      return handler.handle()
    })
  }
