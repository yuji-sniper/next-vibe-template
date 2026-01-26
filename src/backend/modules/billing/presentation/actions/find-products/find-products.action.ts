"use server"

import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { handleFindProducts } from "../../handlers/find-products/find-products.handler"

export type Product = {
  id: string
  stripeProductId: string | null
  name: string
  description: string | null
  active: boolean
  displayOrder: number
  features: string[] | null
  metadata: Record<string, string> | null
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
  return await handleFindProducts(input)
}
