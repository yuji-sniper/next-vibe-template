"use client"

import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { PriceFormValues } from "@/features/admin-products/types/price-form"
import { PriceForm } from "./price-form"

type PriceCreatePresentationalProps = {
  productName: string
  stripeProductId: string | null
  isLoading: boolean
  onSubmit: (values: PriceFormValues) => void
  onCancel: () => void
  isPending: boolean
}

export const PriceCreatePresentational = ({
  productName,
  stripeProductId,
  isLoading,
  onSubmit,
  onCancel,
  isPending
}: PriceCreatePresentationalProps) => {
  if (isLoading) {
    return (
      <div className="container max-w-2xl py-8">
        <div className="mb-6">
          <Skeleton className="h-10 w-40" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="mt-2 h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const isStripeConnected = !!stripeProductId

  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={onCancel} className="gap-2">
          <ArrowLeftIcon className="size-4" />
          商品編集に戻る
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>価格を作成</CardTitle>
            <div className="flex items-center gap-2">
              {isStripeConnected ? (
                <Badge variant="outline" className="gap-1">
                  <CheckCircleIcon className="size-3 text-green-500" />
                  Stripe連携済み
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1">
                  <XCircleIcon className="size-3 text-muted-foreground" />
                  未連携
                </Badge>
              )}
            </div>
          </div>
          <CardDescription>
            {productName} の新しい価格を作成します
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isStripeConnected ? (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
              <p className="text-sm font-medium text-destructive">
                この商品はStripeと連携されていません
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                価格を作成するには、先に商品をStripeと連携してください
              </p>
            </div>
          ) : (
            <PriceForm
              onSubmit={onSubmit}
              onCancel={onCancel}
              isPending={isPending}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
