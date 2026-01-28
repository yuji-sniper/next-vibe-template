"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useCreateProductMutation } from "@/features/admin-products/hooks/mutations/useCreateProductMutation"
import type { ProductFormValues } from "@/features/admin-products/types/product-form"
import { ProductCreatePresentational } from "./presentational"

export const ProductCreateContainer = () => {
  const router = useRouter()
  const createMutation = useCreateProductMutation()

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      const features = values.features?.filter((f) => f.trim() !== "") ?? []

      await createMutation.mutateAsync({
        name: values.name,
        description: values.description || undefined,
        features: features.length > 0 ? features : undefined,
        displayOrder: values.displayOrder ?? 0
      })

      toast.success("商品を作成しました")
      router.push("/products")
    } catch {
      toast.error("商品の作成に失敗しました")
    }
  }

  const handleCancel = () => {
    router.push("/products")
  }

  return (
    <ProductCreatePresentational
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isPending={createMutation.isPending}
    />
  )
}
