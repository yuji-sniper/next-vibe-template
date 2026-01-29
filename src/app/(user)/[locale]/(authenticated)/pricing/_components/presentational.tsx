"use client"

import { useTranslations } from "next-intl"
import { PlanGrid } from "@/features/pricing/components/ui/PlanGrid"
import { PlanSkeleton } from "@/features/pricing/components/ui/PlanSkeleton"
import { PlansEmptyState } from "@/features/pricing/components/ui/PlansEmptyState"
import { PriceToggle } from "@/features/pricing/components/ui/PriceToggle"
import type { BillingInterval, Plan } from "@/features/pricing/types/plan"

type Props = {
  plans: Plan[]
  selectedInterval: BillingInterval
  onIntervalChange: (interval: BillingInterval) => void
  onSubscribe: (priceId: string) => void
  onChangePlan: (priceId: string) => void
  isLoading: boolean
  loadingPriceId: string | null
  hasMonthlyAndYearly: boolean
  error: Error | null
  currentStripePriceId: string | null
  currentPlanDisplayOrder: number | null
}

export function PricingPresentational({
  plans,
  selectedInterval,
  onIntervalChange,
  onSubscribe,
  onChangePlan,
  isLoading,
  loadingPriceId,
  hasMonthlyAndYearly,
  error,
  currentStripePriceId,
  currentPlanDisplayOrder
}: Props) {
  const t = useTranslations("pricing")

  if (error) {
    return (
      <div className="container py-12 text-center">
        <p className="text-destructive">
          {error.message || "An error occurred"}
        </p>
      </div>
    )
  }

  return (
    <div data-slot="pricing-page" className="container py-12 mx-auto">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">{t("heading")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      {hasMonthlyAndYearly && (
        <div className="mb-8">
          <PriceToggle
            selectedInterval={selectedInterval}
            onIntervalChange={onIntervalChange}
          />
        </div>
      )}

      {isLoading ? (
        <PlanSkeleton />
      ) : plans.length === 0 ? (
        <PlansEmptyState />
      ) : (
        <PlanGrid
          plans={plans}
          selectedInterval={selectedInterval}
          onSubscribe={onSubscribe}
          onChangePlan={onChangePlan}
          loadingPriceId={loadingPriceId}
          currentStripePriceId={currentStripePriceId}
          currentPlanDisplayOrder={currentPlanDisplayOrder}
        />
      )}
    </div>
  )
}
