"use server"

import { resolveContainer } from "@/backend/bootstrap/di/container"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { withRequestContext } from "@/backend/modules/shared/presentation/middleware/with-request-context"
import type { FindPricesByProductIdHandler } from "../../handlers/find-prices-by-product-id/find-prices-by-product-id.handler"
import { FindPricesByProductIdHandlerToken } from "../../handlers/find-prices-by-product-id/find-prices-by-product-id.handler"

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
  return withRequestContext(async () => {
    const handler = await resolveContainer<FindPricesByProductIdHandler>(
      FindPricesByProductIdHandlerToken
    )
    return handler.handle(input)
  })
}
