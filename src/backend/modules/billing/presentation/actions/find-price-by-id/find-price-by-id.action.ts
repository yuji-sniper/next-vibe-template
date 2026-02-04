"use server"

import { resolveContainer } from "@/backend/bootstrap/di/container"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { withRequestContext } from "@/backend/modules/shared/presentation/middleware/with-request-context"
import type { FindPriceByIdHandler } from "../../handlers/find-price-by-id/find-price-by-id.handler"
import { FindPriceByIdHandlerToken } from "../../handlers/find-price-by-id/find-price-by-id.handler"

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
  return withRequestContext(async () => {
    const handler = await resolveContainer<FindPriceByIdHandler>(
      FindPriceByIdHandlerToken
    )
    return handler.handle(input)
  })
}
