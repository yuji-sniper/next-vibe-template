"use client"

import { ArchiveIcon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import type { Price } from "@/features/admin-products/types/price"

type PriceRowProps = {
  price: Price
  onArchive: (priceId: string) => void
  isArchiving: boolean
}

const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: currency.toUpperCase()
  }).format(amount)
}

const getIntervalLabel = (interval: string | null): string => {
  switch (interval) {
    case "month":
      return "月"
    case "year":
      return "年"
    default:
      return "-"
  }
}

export const PriceRow = ({ price, onArchive, isArchiving }: PriceRowProps) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{price.displayName || "-"}</TableCell>
      <TableCell>{formatCurrency(price.unitAmount, price.currency)}</TableCell>
      <TableCell>
        <Badge variant={price.type === "recurring" ? "default" : "secondary"}>
          {price.type === "recurring" ? "定期" : "一回"}
        </Badge>
      </TableCell>
      <TableCell>{getIntervalLabel(price.recurringInterval)}</TableCell>
      <TableCell>
        <Badge variant={price.active ? "default" : "outline"}>
          {price.active ? "有効" : "アーカイブ"}
        </Badge>
      </TableCell>
      <TableCell>
        {price.active && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" disabled={isArchiving}>
                <ArchiveIcon className="size-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>価格をアーカイブしますか？</AlertDialogTitle>
                <AlertDialogDescription>
                  この操作により価格は非アクティブになります。アーカイブした価格は新規購入で使用できなくなりますが、既存のサブスクリプションには影響しません。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onArchive(price.id)}
                  disabled={isArchiving}
                >
                  {isArchiving ? "処理中..." : "アーカイブ"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </TableCell>
    </TableRow>
  )
}
