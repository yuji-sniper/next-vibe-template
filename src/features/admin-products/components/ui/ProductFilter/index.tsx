"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import type { ProductFilterStatus } from "../../../types/product"

type ProductFilterProps = {
  value: ProductFilterStatus
  onChange: (value: ProductFilterStatus) => void
}

export const ProductFilter = ({ value, onChange }: ProductFilterProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="ステータス" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">すべて</SelectItem>
        <SelectItem value="active">アクティブ</SelectItem>
        <SelectItem value="archived">アーカイブ済み</SelectItem>
      </SelectContent>
    </Select>
  )
}
