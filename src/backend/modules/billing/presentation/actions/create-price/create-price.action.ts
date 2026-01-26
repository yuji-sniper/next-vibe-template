"use server"

import type {
  PriceType,
  RecurringInterval
} from "@/backend/modules/billing/domain/price/price"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { handleCreatePrice } from "../../handlers/create-price/create-price.handler"

export type CreatePriceActionRequest = {
  productId: string
  unitAmount: number
  currency?: string
  type: PriceType
  recurringInterval?: RecurringInterval
  recurringIntervalCount?: number
  displayName?: string
  metadata?: Record<string, string>
}

export type CreatePriceActionResponse = ActionResponse<{
  price: {
    id: string
    productId: string
    stripePriceId: string | null
    currency: string
    unitAmount: number
    type: PriceType
    recurringInterval: RecurringInterval | null
    recurringIntervalCount: number
    active: boolean
    displayName: string | null
    metadata: Record<string, string> | null
    createdAt: Date
    updatedAt: Date
  }
}>

export const createPriceAction = async (
  request: CreatePriceActionRequest
): Promise<CreatePriceActionResponse> => {
  return await handleCreatePrice(request)
}
