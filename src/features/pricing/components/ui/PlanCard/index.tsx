"use client"

import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import type { BillingInterval, Plan, Price } from "../../../types/plan"
import { FeatureList } from "../FeatureList"

type Props = {
  plan: Plan
  selectedInterval: BillingInterval
  onSubscribe: (priceId: string) => void
  onChangePlan: (priceId: string) => void
  isLoading: boolean
  isCurrentPlan: boolean
  currentPlanDisplayOrder: number | null
}

const formatPrice = (
  unitAmount: number,
  currency: string,
  locale: string
): string => {
  return new Intl.NumberFormat(locale === "ja" ? "ja-JP" : "en-US", {
    style: "currency",
    currency: currency.toUpperCase()
  }).format(unitAmount)
}

const getPriceForInterval = (
  prices: Price[],
  interval: BillingInterval
): Price | undefined => {
  return prices.find(
    (price) =>
      price.type === "recurring" && price.recurringInterval === interval
  )
}

export const PlanCard = ({
  plan,
  selectedInterval,
  onSubscribe,
  onChangePlan,
  isLoading,
  isCurrentPlan,
  currentPlanDisplayOrder
}: Props) => {
  const t = useTranslations("pricing")
  const locale = useLocale()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const recurringPrice = getPriceForInterval(plan.prices, selectedInterval)

  if (!recurringPrice) {
    return null
  }

  const priceLabel = selectedInterval === "month" ? t("perMonth") : t("perYear")

  const isUpgrade =
    currentPlanDisplayOrder !== null &&
    plan.product.displayOrder > currentPlanDisplayOrder

  const handleClick = () => {
    if (currentPlanDisplayOrder !== null) {
      setIsDialogOpen(true)
    } else {
      onSubscribe(recurringPrice.id)
    }
  }

  const handleConfirmChange = () => {
    setIsDialogOpen(false)
    onChangePlan(recurringPrice.id)
  }

  const getButtonLabel = (): string => {
    if (isLoading) {
      if (currentPlanDisplayOrder !== null) {
        return t("changing")
      }
      return t("subscribing")
    }

    if (isCurrentPlan) {
      return t("currentPlan")
    }

    if (currentPlanDisplayOrder !== null) {
      if (isUpgrade) {
        return t("upgrade", { planName: plan.product.name })
      }
      return t("downgrade", { planName: plan.product.name })
    }

    return t("subscribe")
  }

  return (
    <>
      <Card data-slot="plan-card" className="flex w-full max-w-sm flex-col">
        <CardHeader>
          <CardTitle data-slot="plan-card-title">{plan.product.name}</CardTitle>
          {plan.product.description && (
            <CardDescription data-slot="plan-card-description">
              {plan.product.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="flex-1 space-y-4">
          <div
            data-slot="plan-card-price"
            className="flex items-baseline gap-1"
          >
            <span className="text-3xl font-bold">
              {formatPrice(
                recurringPrice.unitAmount,
                recurringPrice.currency,
                locale
              )}
            </span>
            <span className="text-sm text-muted-foreground">{priceLabel}</span>
          </div>
          {plan.product.features && plan.product.features.length > 0 && (
            <div data-slot="plan-card-features">
              <FeatureList features={plan.product.features} />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleClick}
            disabled={isLoading || isCurrentPlan}
          >
            {getButtonLabel()}
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isUpgrade
                ? t("changePlanDialog.upgradeTitle", {
                    planName: plan.product.name
                  })
                : t("changePlanDialog.downgradeTitle", {
                    planName: plan.product.name
                  })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isUpgrade
                ? t("changePlanDialog.upgradeDescription")
                : t("changePlanDialog.downgradeDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("changePlanDialog.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmChange}>
              {t("changePlanDialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
