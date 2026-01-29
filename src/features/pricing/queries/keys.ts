import type { PriceType } from "../types/plan"

export const activePlansBaseKey = ["active-plans"] as const
export const activePlansKey = (priceType?: PriceType) =>
  priceType
    ? ([...activePlansBaseKey, priceType] as const)
    : ([...activePlansBaseKey] as const)
export const subscriptionBaseKey = ["subscription"] as const
export const subscriptionKey = (includeProduct?: boolean) =>
  includeProduct
    ? ([...subscriptionBaseKey, { includeProduct: true }] as const)
    : ([...subscriptionBaseKey] as const)
