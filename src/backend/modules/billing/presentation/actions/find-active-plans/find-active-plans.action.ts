"use server"

import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { handleFindActivePlans } from "../../handlers/find-active-plans/find-active-plans.handler"

export type Plan = {
  product: {
    id: string
    name: string
    description: string | null
    features: string[] | null
    displayOrder: number
  }
  prices: {
    id: string
    stripePriceId: string
    unitAmount: number
    currency: string
    type: "one_time" | "recurring"
    recurringInterval: string | null
    displayName: string | null
  }[]
}

export type FindActivePlansActionResponse = ActionResponse<{
  plans: Plan[]
}>

export const findActivePlansAction =
  async (): Promise<FindActivePlansActionResponse> => {
    return await handleFindActivePlans()
  }
