"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useCreatePriceMutation } from "@/features/admin-products/hooks/mutations/useCreatePriceMutation"
import { useGetProductByIdQuery } from "@/features/admin-products/hooks/queries/useGetProductByIdQuery"
import type { PriceFormValues } from "@/features/admin-products/types/price-form"
import { PriceCreatePresentational } from "./presentational"

type PriceCreateContainerProps = {
  productId: string
}

export const PriceCreateContainer = ({
  productId
}: PriceCreateContainerProps) => {
  const router = useRouter()
  const { data, isLoading } = useGetProductByIdQuery({ productId })
  const createMutation = useCreatePriceMutation({ productId })

  const handleSubmit = async (values: PriceFormValues) => {
    try {
      await createMutation.mutateAsync({
        productId,
        ...values
      })

      toast.success("価格を作成しました")
      router.push(`/products/${productId}`)
    } catch {
      toast.error("価格の作成に失敗しました")
    }
  }

  const handleCancel = () => {
    router.push(`/products/${productId}`)
  }

  const product = data?.product

  return (
    <PriceCreatePresentational
      productName={product?.name ?? ""}
      stripeProductId={product?.stripeProductId ?? null}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isPending={createMutation.isPending}
    />
  )
}
