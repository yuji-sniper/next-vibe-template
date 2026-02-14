"use server"

import { resolveContainer } from "@/backend/bootstrap/di/container"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { withRequestContext } from "@/backend/modules/shared/presentation/middleware/with-request-context"
import type { FindProductsHandler } from "../../handlers/find-products/find-products.handler"
import { FindProductsHandlerToken } from "../../handlers/find-products/find-products.handler"

export type Product = {
  id: string
  stripeProductId: string | null
  name: string
  description: string | null
  active: boolean
  displayOrder: number
  features: string[] | null
  metadata: Record<string, string> | null
  priceCount: number
  createdAt: string
  updatedAt: string
  prices?: {
    id: string
    stripePriceId: string | null
    unitAmount: number
    currency: string
    type: "one_time" | "recurring"
    recurringInterval: string | null
    displayName: string | null
    active: boolean
  }[]
}

export type FindProductsActionInput = {
  activeOnly?: boolean
  includePrices?: boolean
}

export type FindProductsActionResponse = ActionResponse<{
  products: Product[]
}>

export const findProductsAction = async (
  input: FindProductsActionInput = {}
): Promise<FindProductsActionResponse> => {
  return withRequestContext(async () => {
    const handler = await resolveContainer<FindProductsHandler>(
      FindProductsHandlerToken
    )
    return handler.handle(input)
  })
}
