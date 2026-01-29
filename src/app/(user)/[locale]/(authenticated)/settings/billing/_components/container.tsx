"use client"

import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"
import { useGetInvoiceHistoryQuery } from "@/features/billing/hooks/queries/useGetInvoiceHistoryQuery"
import { useCancelSubscriptionMutation } from "@/features/pricing/hooks/mutations/useCancelSubscriptionMutation"
import { useGetSubscriptionQuery } from "@/features/pricing/hooks/queries/useGetSubscriptionQuery"
import { subscriptionBaseKey } from "@/features/pricing/queries/keys"
import { getQueryClient } from "@/lib/react-query/query-client"
import { BillingSettingsPresentational } from "./presentational"

export function BillingSettingsContainer() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isResumeDialogOpen, setIsResumeDialogOpen] = useState(false)
  const locale = useLocale()
  const t = useTranslations("settings")
  const queryClient = getQueryClient()

  const { data: subscriptionData } = useGetSubscriptionQuery(true)
  const { data: invoiceHistoryData } = useGetInvoiceHistoryQuery()

  const cancelMutation = useCancelSubscriptionMutation()
  const resumeMutation = useCancelSubscriptionMutation()

  const currentPlanName = subscriptionData?.subscription?.product?.name

  const handleCancelSubscription = async () => {
    try {
      await cancelMutation.mutateAsync(undefined)
      await queryClient.invalidateQueries({ queryKey: subscriptionBaseKey })
      setIsDialogOpen(false)
      toast.success(t("billing.cancelPlan.success"))
    } catch {
      toast.error(t("billing.cancelPlan.error"))
    }
  }

  const handleResumeSubscription = async () => {
    try {
      await resumeMutation.mutateAsync({ cancelAtPeriodEnd: false })
      await queryClient.invalidateQueries({ queryKey: subscriptionBaseKey })
      setIsResumeDialogOpen(false)
      toast.success(t("billing.resumePlan.success"))
    } catch {
      toast.error(t("billing.resumePlan.error"))
    }
  }

  return (
    <BillingSettingsPresentational
      subscription={subscriptionData?.subscription}
      currentPlanName={currentPlanName}
      pricingPath={`/${locale}/pricing`}
      invoices={invoiceHistoryData?.invoices ?? []}
      isDialogOpen={isDialogOpen}
      isCanceling={cancelMutation.isPending}
      onOpenDialog={() => setIsDialogOpen(true)}
      onCloseDialog={() => setIsDialogOpen(false)}
      onCancelSubscription={handleCancelSubscription}
      isResumeDialogOpen={isResumeDialogOpen}
      isResuming={resumeMutation.isPending}
      onOpenResumeDialog={() => setIsResumeDialogOpen(true)}
      onCloseResumeDialog={() => setIsResumeDialogOpen(false)}
      onResumeSubscription={handleResumeSubscription}
    />
  )
}
