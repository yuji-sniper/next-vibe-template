"use client"

import { useTranslations } from "next-intl"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { BillingInterval } from "../../../types/plan"

type Props = {
  selectedInterval: BillingInterval
  onIntervalChange: (interval: BillingInterval) => void
}

export const PriceToggle = ({ selectedInterval, onIntervalChange }: Props) => {
  const t = useTranslations("pricing")

  const handleToggle = (checked: boolean) => {
    onIntervalChange(checked ? "year" : "month")
  }

  return (
    <div className="flex items-center justify-center gap-3">
      <Label
        htmlFor="billing-interval"
        className={
          selectedInterval === "month"
            ? "font-medium text-foreground"
            : "text-muted-foreground"
        }
      >
        {t("monthly")}
      </Label>
      <Switch
        id="billing-interval"
        checked={selectedInterval === "year"}
        onCheckedChange={handleToggle}
      />
      <Label
        htmlFor="billing-interval"
        className={
          selectedInterval === "year"
            ? "font-medium text-foreground"
            : "text-muted-foreground"
        }
      >
        {t("yearly")}
      </Label>
    </div>
  )
}
