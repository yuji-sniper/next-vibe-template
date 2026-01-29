"use client"

import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import type { Subscription } from "@/features/pricing/types/subscription"

type BillingSettingsPresentationalProps = {
  subscription: Subscription | undefined
  currentPlanName: string | undefined
  pricingPath: string
  isDialogOpen: boolean
  isCanceling: boolean
  onOpenDialog: () => void
  onCloseDialog: () => void
  onCancelSubscription: () => void
}

export function BillingSettingsPresentational({
  subscription,
  currentPlanName,
  pricingPath,
  isDialogOpen,
  isCanceling,
  onOpenDialog,
  onCloseDialog,
  onCancelSubscription
}: BillingSettingsPresentationalProps) {
  const t = useTranslations("settings")
  const locale = useLocale()

  const isActive =
    subscription?.status === "active" || subscription?.status === "trialing"
  const isCancelScheduled = subscription?.cancelAtPeriodEnd === true

  const formattedPeriodEnd = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString(locale)
    : null

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("billing.currentPlan")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-lg font-medium">
              {currentPlanName ?? t("billing.noPlan")}
            </p>
            {isActive && formattedPeriodEnd && (
              <p className="text-sm text-muted-foreground">
                {isCancelScheduled
                  ? `${t("billing.cancelScheduled")}: ~${formattedPeriodEnd}`
                  : `${t("billing.nextRenewal")}: ${formattedPeriodEnd}`}
              </p>
            )}
          </div>
          <Button asChild variant="outline">
            <Link href={pricingPath}>{t("billing.adjustPlan")}</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("billing.cancelPlan.title")}</CardTitle>
          <CardDescription>
            {t("billing.cancelPlan.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={onOpenDialog}
            disabled={!isActive || isCancelScheduled}
          >
            {t("billing.cancelPlan.button")}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={onCloseDialog}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{t("billing.cancelPlan.dialog.title")}</DialogTitle>
            <DialogDescription>
              {t("billing.cancelPlan.dialog.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isCanceling}>
                {t("billing.cancelPlan.dialog.cancel")}
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={onCancelSubscription}
              disabled={isCanceling}
            >
              {isCanceling
                ? t("billing.cancelPlan.dialog.canceling")
                : t("billing.cancelPlan.dialog.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
