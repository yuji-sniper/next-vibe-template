"use client"

import type { BillingInterval, Plan } from "../../../types/plan"
import { PlanCard } from "../PlanCard"

type Props = {
  plans: Plan[]
  selectedInterval: BillingInterval
  onSubscribe: (priceId: string) => void
  loadingPriceId: string | null
}

export const PlanGrid = ({
  plans,
  selectedInterval,
  onSubscribe,
  loadingPriceId
}: Props) => {
  return (
    <div data-slot="plan-grid" className="flex flex-wrap justify-center gap-6">
      {plans.map((plan) => (
        <PlanCard
          key={plan.product.id}
          plan={plan}
          selectedInterval={selectedInterval}
          onSubscribe={onSubscribe}
          isLoading={
            loadingPriceId !== null &&
            plan.prices.some((price) => price.id === loadingPriceId)
          }
        />
      ))}
    </div>
  )
}
