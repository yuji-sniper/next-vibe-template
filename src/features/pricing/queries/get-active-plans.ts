import { findActivePlansAction } from "@/backend/modules/billing/internal/presentation/actions/find-active-plans/find-active-plans.action"
import { ServerError } from "@/utils/error/server-error"
import type { Plan, PriceType } from "../types/plan"

export type GetActivePlansQueryResult = {
  plans: Plan[]
}

export const getActivePlansQuery = async (
  priceType?: PriceType
): Promise<GetActivePlansQueryResult> => {
  const res = await findActivePlansAction(priceType ? { priceType } : undefined)

  if (!res.ok) {
    throw new ServerError(
      res.error.code,
      res.error.status,
      res.error.message,
      res.error.details
    )
  }

  const plans: Plan[] = res.data.plans

  return { plans }
}
