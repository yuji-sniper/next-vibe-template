"use client"

import type { BillingInterval, Plan } from "../../../types/plan"
import { PlanCard } from "../PlanCard"

type Props = {
  plans: Plan[]
  selectedInterval: BillingInterval
  onSubscribe: (priceId: string) => void
  onChangePlan: (priceId: string) => void
  loadingPriceId: string | null
  currentStripePriceId: string | null
  currentPlanDisplayOrder: number | null
}

export const PlanGrid = ({
  plans,
  selectedInterval,
  onSubscribe,
  onChangePlan,
  loadingPriceId,
  currentStripePriceId,
  currentPlanDisplayOrder
}: Props) => {
  return (
    <div data-slot="plan-grid" className="flex flex-wrap justify-center gap-6">
      {plans.map((plan) => {
        const isCurrentPlan =
          currentStripePriceId !== null &&
          plan.prices.some(
            (price) => price.stripePriceId === currentStripePriceId
          )

        return (
          <PlanCard
            key={plan.product.id}
            plan={plan}
            selectedInterval={selectedInterval}
            onSubscribe={onSubscribe}
            onChangePlan={onChangePlan}
            isLoading={
              loadingPriceId !== null &&
              plan.prices.some((price) => price.id === loadingPriceId)
            }
            isCurrentPlan={isCurrentPlan}
            currentPlanDisplayOrder={currentPlanDisplayOrder}
          />
        )
      })}
    </div>
  )
}
