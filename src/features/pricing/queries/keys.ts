import type { PriceType } from "../types/plan"

export const activePlansBaseKey = ["active-plans"] as const
export const activePlansKey = (priceType?: PriceType) =>
  priceType
    ? ([...activePlansBaseKey, priceType] as const)
    : ([...activePlansBaseKey] as const)
export const subscriptionKey = ["subscription"] as const
