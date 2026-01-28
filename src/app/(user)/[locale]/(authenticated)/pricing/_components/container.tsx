"use client"

import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"
import { useCreateCheckoutSessionMutation } from "@/features/pricing/hooks/mutations/useCreateCheckoutSessionMutation"
import { useGetActivePlansQuery } from "@/features/pricing/hooks/queries/useGetActivePlansQuery"
import type { BillingInterval } from "@/features/pricing/types/plan"
import { PricingPresentational } from "./presentational"

export function PricingContainer() {
  const locale = useLocale()
  const t = useTranslations("pricing")
  const [selectedInterval, setSelectedInterval] =
    useState<BillingInterval>("month")
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null)

  const { data, isLoading, error } = useGetActivePlansQuery()
  const checkoutMutation = useCreateCheckoutSessionMutation()

  const plans = data?.plans ?? []

  const hasMonthlyAndYearly =
    plans.some((plan) =>
      plan.prices.some(
        (price) =>
          price.type === "recurring" && price.recurringInterval === "month"
      )
    ) &&
    plans.some((plan) =>
      plan.prices.some(
        (price) =>
          price.type === "recurring" && price.recurringInterval === "year"
      )
    )

  const handleIntervalChange = (interval: BillingInterval) => {
    setSelectedInterval(interval)
  }

  const handleSubscribe = async (priceId: string) => {
    setLoadingPriceId(priceId)

    try {
      const result = await checkoutMutation.mutateAsync({
        priceId,
        successUrl: `${window.location.origin}/${locale}/home?checkout=success`,
        cancelUrl: `${window.location.origin}/${locale}/pricing?checkout=canceled`
      })

      window.location.href = result.sessionUrl
    } catch {
      toast.error(t("errors.checkoutFailed"))
      setLoadingPriceId(null)
    }
  }

  return (
    <PricingPresentational
      plans={plans}
      selectedInterval={selectedInterval}
      onIntervalChange={handleIntervalChange}
      onSubscribe={handleSubscribe}
      isLoading={isLoading}
      loadingPriceId={loadingPriceId}
      hasMonthlyAndYearly={hasMonthlyAndYearly}
      error={error}
    />
  )
}
