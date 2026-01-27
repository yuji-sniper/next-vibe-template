"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"

export const PlansEmptyState = () => {
  const t = useTranslations("pricing.empty")

  return (
    <Card data-slot="plans-empty-state" className="mx-auto max-w-md">
      <CardContent className="py-12 text-center">
        <h3 className="mb-2 text-lg font-semibold">{t("title")}</h3>
        <p className="text-muted-foreground">{t("description")}</p>
      </CardContent>
    </Card>
  )
}
