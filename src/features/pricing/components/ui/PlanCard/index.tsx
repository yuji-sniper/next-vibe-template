"use client"

import { useLocale, useTranslations } from "next-intl"
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
  isLoading: boolean
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

const getOneTimePrice = (prices: Price[]): Price | undefined => {
  return prices.find((price) => price.type === "one_time")
}

export const PlanCard = ({
  plan,
  selectedInterval,
  onSubscribe,
  isLoading
}: Props) => {
  const t = useTranslations("pricing")
  const locale = useLocale()

  const recurringPrice = getPriceForInterval(plan.prices, selectedInterval)
  const oneTimePrice = getOneTimePrice(plan.prices)
  const displayPrice = recurringPrice || oneTimePrice

  if (!displayPrice) {
    return null
  }

  const isRecurring = displayPrice.type === "recurring"
  const priceLabel = isRecurring
    ? selectedInterval === "month"
      ? t("perMonth")
      : t("perYear")
    : t("oneTime")

  const handleClick = () => {
    onSubscribe(displayPrice.id)
  }

  return (
    <Card data-slot="plan-card" className="flex flex-col">
      <CardHeader>
        <CardTitle data-slot="plan-card-title">{plan.product.name}</CardTitle>
        {plan.product.description && (
          <CardDescription data-slot="plan-card-description">
            {plan.product.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div data-slot="plan-card-price" className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">
            {formatPrice(
              displayPrice.unitAmount,
              displayPrice.currency,
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
        <Button className="w-full" onClick={handleClick} disabled={isLoading}>
          {isLoading ? t("subscribing") : t("subscribe")}
        </Button>
      </CardFooter>
    </Card>
  )
}
