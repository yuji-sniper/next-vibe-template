"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { useCancelSubscriptionMutation } from "@/features/pricing/hooks/mutations/useCancelSubscriptionMutation"
import { useGetActivePlansQuery } from "@/features/pricing/hooks/queries/useGetActivePlansQuery"
import { useGetSubscriptionQuery } from "@/features/pricing/hooks/queries/useGetSubscriptionQuery"
import { subscriptionKey } from "@/features/pricing/queries/keys"
import { PRICE_TYPE } from "@/features/pricing/types/plan"
import { BillingSettingsPresentational } from "./presentational"

export function BillingSettingsContainer() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const locale = useLocale()
  const t = useTranslations("settings")
  const queryClient = useQueryClient()

  const { data: subscriptionData } = useGetSubscriptionQuery()
  const { data: plansData } = useGetActivePlansQuery(PRICE_TYPE.RECURRING)

  const cancelMutation = useCancelSubscriptionMutation()

  const currentPlanName = useMemo(() => {
    if (!subscriptionData?.subscription || !plansData?.plans) {
      return undefined
    }

    const stripePriceId = subscriptionData.subscription.stripePriceId
    for (const plan of plansData.plans) {
      const matchedPrice = plan.prices.find(
        (price) => price.stripePriceId === stripePriceId
      )
      if (matchedPrice) {
        return plan.product.name
      }
    }
    return undefined
  }, [subscriptionData, plansData])

  const handleCancelSubscription = async () => {
    try {
      await cancelMutation.mutateAsync(undefined)
      await queryClient.invalidateQueries({ queryKey: subscriptionKey })
      setIsDialogOpen(false)
      toast.success(t("billing.cancelPlan.success"))
    } catch {
      toast.error(t("billing.cancelPlan.error"))
    }
  }

  return (
    <BillingSettingsPresentational
      subscription={subscriptionData?.subscription}
      currentPlanName={currentPlanName}
      pricingPath={`/${locale}/pricing`}
      isDialogOpen={isDialogOpen}
      isCanceling={cancelMutation.isPending}
      onOpenDialog={() => setIsDialogOpen(true)}
      onCloseDialog={() => setIsDialogOpen(false)}
      onCancelSubscription={handleCancelSubscription}
    />
  )
}
