"use server"

import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { handleFindPricesByProductId } from "../../handlers/find-prices-by-product-id/find-prices-by-product-id.handler"

export type Price = {
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

export type FindPricesByProductIdActionInput = {
  productId: string
  activeOnly?: boolean
}

export type FindPricesByProductIdActionResponse = ActionResponse<{
  prices: Price[]
}>

export const findPricesByProductIdAction = async (
  input: FindPricesByProductIdActionInput
): Promise<FindPricesByProductIdActionResponse> => {
  return await handleFindPricesByProductId(input)
}
