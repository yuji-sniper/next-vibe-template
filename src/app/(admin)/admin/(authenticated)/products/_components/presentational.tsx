"use client"

import { PlusIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArchiveProductDialog } from "@/features/admin-products/components/ui/ArchiveProductDialog"
import { ProductFilter } from "@/features/admin-products/components/ui/ProductFilter"
import { ProductTable } from "@/features/admin-products/components/ui/ProductTable"
import type {
  Product,
  ProductFilterStatus
} from "@/features/admin-products/types/product"

type ProductsPresentationalProps = {
  products: Product[]
  isLoading: boolean
  filterStatus: ProductFilterStatus
  onFilterChange: (status: ProductFilterStatus) => void
  onArchive: (productId: string, productName: string) => void
  archiveDialogOpen: boolean
  archiveDialogProductName: string
  isArchiving: boolean
  onArchiveDialogOpenChange: (open: boolean) => void
  onArchiveConfirm: () => void
}

export const ProductsPresentational = ({
  products,
  isLoading,
  filterStatus,
  onFilterChange,
  onArchive,
  archiveDialogOpen,
  archiveDialogProductName,
  isArchiving,
  onArchiveDialogOpenChange,
  onArchiveConfirm
}: ProductsPresentationalProps) => {
  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">商品管理</h1>
        <Button asChild>
          <Link href="/products/new">
            <PlusIcon className="size-4" />
            新規作成
          </Link>
        </Button>
      </div>

      <div className="mb-4">
        <ProductFilter value={filterStatus} onChange={onFilterChange} />
      </div>

      <div className="rounded-md border">
        <ProductTable
          products={products}
          isLoading={isLoading}
          onArchive={onArchive}
        />
      </div>

      <ArchiveProductDialog
        open={archiveDialogOpen}
        onOpenChange={onArchiveDialogOpenChange}
        productName={archiveDialogProductName}
        isArchiving={isArchiving}
        onConfirm={onArchiveConfirm}
      />
    </div>
  )
}
