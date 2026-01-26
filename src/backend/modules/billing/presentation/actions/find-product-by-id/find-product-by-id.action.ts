"use server"

import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { handleFindProductById } from "../../handlers/find-product-by-id/find-product-by-id.handler"

export type PriceDetail = {
  id: string
  productId: string
  stripePriceId: string | null
  currency: string
  unitAmount: number
  recurringInterval: "month" | "year" | null
  recurringIntervalCount: number
  type: "one_time" | "recurring"
  active: boolean
  metadata: Record<string, string> | null
  displayName: string | null
  createdAt: string
  updatedAt: string
}

export type ProductDetail = {
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
  prices: PriceDetail[]
}

export type FindProductByIdActionInput = {
  productId: string
}

export type FindProductByIdActionResponse = ActionResponse<{
  product: ProductDetail
}>

export const findProductByIdAction = async (
  input: FindProductByIdActionInput
): Promise<FindProductByIdActionResponse> => {
  return await handleFindProductById(input)
}
