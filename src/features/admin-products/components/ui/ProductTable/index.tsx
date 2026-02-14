"use client"

import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import type { Product } from "../../../types/product"
import { ProductEmptyState } from "../ProductEmptyState"
import { ProductRow } from "../ProductRow"

type ProductTableProps = {
  products: Product[]
  isLoading: boolean
  onArchive: (productId: string, productName: string) => void
}

const TableSkeleton = () => {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: スケルトン表示用の固定要素のため順序変更なし
        <TableRow key={i}>
          <td className="p-2">
            <Skeleton className="h-5 w-32" />
          </td>
          <td className="p-2">
            <Skeleton className="h-5 w-48" />
          </td>
          <td className="p-2">
            <Skeleton className="h-5 w-16" />
          </td>
          <td className="p-2">
            <Skeleton className="h-5 w-20" />
          </td>
          <td className="p-2">
            <Skeleton className="mx-auto h-5 w-8" />
          </td>
          <td className="p-2">
            <Skeleton className="h-5 w-24" />
          </td>
          <td className="p-2">
            <Skeleton className="h-8 w-16" />
          </td>
        </TableRow>
      ))}
    </>
  )
}

export const ProductTable = ({
  products,
  isLoading,
  onArchive
}: ProductTableProps) => {
  if (!isLoading && products.length === 0) {
    return <ProductEmptyState />
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>商品名</TableHead>
          <TableHead>説明</TableHead>
          <TableHead>Stripe連携</TableHead>
          <TableHead>ステータス</TableHead>
          <TableHead className="text-center">表示順</TableHead>
          <TableHead className="text-center">価格数</TableHead>
          <TableHead>作成日</TableHead>
          <TableHead>操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              onArchive={onArchive}
            />
          ))
        )}
      </TableBody>
    </Table>
  )
}
