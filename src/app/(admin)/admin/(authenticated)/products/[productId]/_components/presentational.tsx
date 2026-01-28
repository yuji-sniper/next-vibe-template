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
import type { Price } from "@/features/admin-products/types/price"
import type { ProductFormValues } from "@/features/admin-products/types/product-form"
import { ProductForm } from "../../_components/product-form"
import { PriceList } from "./price-list"

type ProductEditPresentationalProps = {
  productId: string
  productName: string
  stripeProductId: string | null
  isLoading: boolean
  defaultValues: Partial<ProductFormValues>
  prices: Price[]
  onSubmit: (values: ProductFormValues) => void
  onCancel: () => void
  onArchivePrice: (priceId: string) => void
  isPending: boolean
  isArchivingPrice: boolean
}

export const ProductEditPresentational = ({
  productId,
  productName,
  stripeProductId,
  isLoading,
  defaultValues,
  prices,
  onSubmit,
  onCancel,
  onArchivePrice,
  isPending,
  isArchivingPrice
}: ProductEditPresentationalProps) => {
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
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={onCancel} className="gap-2">
          <ArrowLeftIcon className="size-4" />
          商品一覧に戻る
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>商品を編集</CardTitle>
              <div className="flex items-center gap-2">
                {stripeProductId ? (
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
            <CardDescription>{productName}</CardDescription>
          </CardHeader>
          <CardContent>
            <ProductForm
              mode="edit"
              defaultValues={defaultValues}
              onSubmit={onSubmit}
              isPending={isPending}
              submitLabel="更新"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <PriceList
              productId={productId}
              prices={prices}
              onArchive={onArchivePrice}
              isArchiving={isArchivingPrice}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
