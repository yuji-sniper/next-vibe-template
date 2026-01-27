"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useArchiveProductMutation } from "@/features/admin-products/hooks/mutations/useArchiveProductMutation"
import { useGetProductsQuery } from "@/features/admin-products/hooks/queries/useGetProductsQuery"
import type { ProductFilterStatus } from "@/features/admin-products/types/product"
import { ProductsPresentational } from "./presentational"

export const ProductsContainer = () => {
  const [filterStatus, setFilterStatus] = useState<ProductFilterStatus>("all")
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string
    name: string
  } | null>(null)

  const activeOnly =
    filterStatus === "all" ? undefined : filterStatus === "active"

  const { data, isLoading } = useGetProductsQuery({ activeOnly })

  const archiveMutation = useArchiveProductMutation()

  const handleArchiveClick = (productId: string, productName: string) => {
    setSelectedProduct({ id: productId, name: productName })
    setArchiveDialogOpen(true)
  }

  const handleArchiveConfirm = async () => {
    if (!selectedProduct) return

    try {
      await archiveMutation.mutateAsync({ productId: selectedProduct.id })
      toast.success("商品をアーカイブしました")
      setArchiveDialogOpen(false)
      setSelectedProduct(null)
    } catch {
      toast.error("アーカイブに失敗しました")
    }
  }

  const handleArchiveDialogOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedProduct(null)
    }
    setArchiveDialogOpen(open)
  }

  // フィルタに応じて商品をフィルタリング（archived フィルタの場合）
  const filteredProducts =
    filterStatus === "archived"
      ? (data?.products ?? []).filter((p) => !p.active)
      : (data?.products ?? [])

  return (
    <ProductsPresentational
      products={filteredProducts}
      isLoading={isLoading}
      filterStatus={filterStatus}
      onFilterChange={setFilterStatus}
      onArchive={handleArchiveClick}
      archiveDialogOpen={archiveDialogOpen}
      archiveDialogProductName={selectedProduct?.name ?? ""}
      isArchiving={archiveMutation.isPending}
      onArchiveDialogOpenChange={handleArchiveDialogOpenChange}
      onArchiveConfirm={handleArchiveConfirm}
    />
  )
}
