"use server"

import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { handleFindPaymentHistory } from "../../handlers/find-payment-history/find-payment-history.handler"

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
    return await handleFindPaymentHistory()
  }
