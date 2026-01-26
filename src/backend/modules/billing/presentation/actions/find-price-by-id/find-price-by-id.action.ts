"use server"

import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { handleFindPriceById } from "../../handlers/find-price-by-id/find-price-by-id.handler"

export type PriceDetail = {
  id: string
  productId: string
  stripePriceId: string | null
  unitAmount: number
  currency: string
  type: "one_time" | "recurring"
  recurringInterval: string | null
  recurringIntervalCount: number
  displayName: string | null
  active: boolean
  metadata: Record<string, string> | null
  createdAt: string
  updatedAt: string
}

export type FindPriceByIdActionInput = {
  priceId: string
}

export type FindPriceByIdActionResponse = ActionResponse<{
  price: PriceDetail
}>

export const findPriceByIdAction = async (
  input: FindPriceByIdActionInput
): Promise<FindPriceByIdActionResponse> => {
  return await handleFindPriceById(input)
}
