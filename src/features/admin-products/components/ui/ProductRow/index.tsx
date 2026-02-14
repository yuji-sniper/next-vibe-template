"use client"

import { Badge } from "@/components/ui/badge"
import { TableCell, TableRow } from "@/components/ui/table"
import type { Product } from "../../../types/product"
import { ProductActions } from "../ProductActions"

type ProductRowProps = {
  product: Product
  onArchive: (productId: string, productName: string) => void
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })
}

const truncateText = (text: string | null, maxLength: number = 50) => {
  if (!text) return "-"
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

export const ProductRow = ({ product, onArchive }: ProductRowProps) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell className="max-w-[200px]">
        <span className="text-muted-foreground">
          {truncateText(product.description)}
        </span>
      </TableCell>
      <TableCell>
        {product.stripeProductId ? (
          <Badge variant="default">連携済み</Badge>
        ) : (
          <Badge variant="outline">未連携</Badge>
        )}
      </TableCell>
      <TableCell>
        {product.active ? (
          <Badge variant="outline">アクティブ</Badge>
        ) : (
          <Badge variant="secondary">アーカイブ済み</Badge>
        )}
      </TableCell>
      <TableCell className="text-center">{product.displayOrder}</TableCell>
      <TableCell className="text-center">{product.priceCount}</TableCell>
      <TableCell>{formatDate(product.createdAt)}</TableCell>
      <TableCell>
        <ProductActions
          productId={product.id}
          isActive={product.active}
          onArchive={() => onArchive(product.id, product.name)}
        />
      </TableCell>
    </TableRow>
  )
}
