"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useArchivePriceMutation } from "@/features/admin-products/hooks/mutations/useArchivePriceMutation"
import { useUpdateProductMutation } from "@/features/admin-products/hooks/mutations/useUpdateProductMutation"
import { useGetProductByIdQuery } from "@/features/admin-products/hooks/queries/useGetProductByIdQuery"
import type { ProductFormValues } from "@/features/admin-products/types/product-form"
import { ProductEditPresentational } from "./presentational"

type ProductEditContainerProps = {
  productId: string
}

export const ProductEditContainer = ({
  productId
}: ProductEditContainerProps) => {
  const router = useRouter()
  const { data, isLoading } = useGetProductByIdQuery({ productId })
  const updateMutation = useUpdateProductMutation()
  const archivePriceMutation = useArchivePriceMutation({ productId })

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      const features = values.features?.filter((f) => f.trim() !== "") ?? []

      await updateMutation.mutateAsync({
        productId,
        name: values.name,
        description: values.description || undefined,
        features: features.length > 0 ? features : undefined,
        displayOrder: values.displayOrder ?? 0,
        active: values.active
      })

      toast.success("商品を更新しました")
    } catch {
      toast.error("商品の更新に失敗しました")
    }
  }

  const handleCancel = () => {
    router.push("/products")
  }

  const handleArchivePrice = async (priceId: string) => {
    try {
      await archivePriceMutation.mutateAsync({ priceId })
      toast.success("価格をアーカイブしました")
    } catch {
      toast.error("価格のアーカイブに失敗しました")
    }
  }

  const product = data?.product
  const defaultValues: Partial<ProductFormValues> = product
    ? {
        name: product.name,
        description: product.description ?? "",
        features: product.features ?? [],
        displayOrder: product.displayOrder,
        active: product.active
      }
    : {}

  return (
    <ProductEditPresentational
      productId={productId}
      productName={product?.name ?? ""}
      stripeProductId={product?.stripeProductId ?? null}
      isLoading={isLoading}
      defaultValues={defaultValues}
      prices={product?.prices ?? []}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      onArchivePrice={handleArchivePrice}
      isPending={updateMutation.isPending}
      isArchivingPrice={archivePriceMutation.isPending}
    />
  )
}
