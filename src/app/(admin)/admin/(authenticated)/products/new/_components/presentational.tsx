"use client"

import { ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ProductFormValues } from "@/features/admin-products/types/product-form"
import { ProductForm } from "../../_components/product-form"

type ProductCreatePresentationalProps = {
  onSubmit: (values: ProductFormValues) => void
  onCancel: () => void
  isPending: boolean
}

export const ProductCreatePresentational = ({
  onSubmit,
  onCancel,
  isPending
}: ProductCreatePresentationalProps) => {
  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={onCancel} className="gap-2">
          <ArrowLeftIcon className="size-4" />
          商品一覧に戻る
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>商品を作成</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm onSubmit={onSubmit} isPending={isPending} />
        </CardContent>
      </Card>
    </div>
  )
}
