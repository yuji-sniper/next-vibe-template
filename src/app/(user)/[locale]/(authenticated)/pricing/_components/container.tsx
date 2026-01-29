"use client"

import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"
import { useChangeSubscriptionPlanMutation } from "@/features/pricing/hooks/mutations/useChangeSubscriptionPlanMutation"
import { useCreateCheckoutSessionMutation } from "@/features/pricing/hooks/mutations/useCreateCheckoutSessionMutation"
import { useGetActivePlansQuery } from "@/features/pricing/hooks/queries/useGetActivePlansQuery"
import { useGetSubscriptionQuery } from "@/features/pricing/hooks/queries/useGetSubscriptionQuery"
import {
  activePlansBaseKey,
  subscriptionBaseKey
} from "@/features/pricing/queries/keys"
import type { BillingInterval } from "@/features/pricing/types/plan"
import { PRICE_TYPE } from "@/features/pricing/types/plan"
import { getQueryClient } from "@/lib/react-query/query-client"
import { PricingPresentational } from "./presentational"

export const PRICING_PAGE_PRICE_TYPE = PRICE_TYPE.RECURRING

export function PricingContainer() {
  const locale = useLocale()
  const t = useTranslations("pricing")
  const queryClient = getQueryClient()
  const [selectedInterval, setSelectedInterval] =
    useState<BillingInterval>("month")
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null)

  const { data, isLoading, error } = useGetActivePlansQuery(
    PRICING_PAGE_PRICE_TYPE
  )
  const { data: subscriptionData } = useGetSubscriptionQuery()
  const checkoutMutation = useCreateCheckoutSessionMutation()
  const changePlanMutation = useChangeSubscriptionPlanMutation()

  const plans = data?.plans ?? []
  const subscription = subscriptionData?.subscription

  const currentStripePriceId = subscription?.stripePriceId ?? null

  const currentPlanDisplayOrder =
    currentStripePriceId !== null
      ? (plans.find((plan) =>
          plan.prices.some(
            (price) => price.stripePriceId === currentStripePriceId
          )
        )?.product.displayOrder ?? null)
      : null

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

  const handleChangePlan = async (priceId: string) => {
    setLoadingPriceId(priceId)

    try {
      await changePlanMutation.mutateAsync({ newPriceId: priceId })
      toast.success(t("changeSuccess"))
      queryClient.invalidateQueries({ queryKey: subscriptionBaseKey })
      queryClient.invalidateQueries({ queryKey: activePlansBaseKey })
    } catch {
      toast.error(t("errors.changeFailed"))
    } finally {
      setLoadingPriceId(null)
    }
  }

  return (
    <PricingPresentational
      plans={plans}
      selectedInterval={selectedInterval}
      onIntervalChange={handleIntervalChange}
      onSubscribe={handleSubscribe}
      onChangePlan={handleChangePlan}
      isLoading={isLoading}
      loadingPriceId={loadingPriceId}
      hasMonthlyAndYearly={hasMonthlyAndYearly}
      error={error}
      currentStripePriceId={currentStripePriceId}
      currentPlanDisplayOrder={currentPlanDisplayOrder}
    />
  )
}
