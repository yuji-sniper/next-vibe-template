"use client"

import { ArchiveIcon, PencilIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type ProductActionsProps = {
  productId: string
  isActive: boolean
  onArchive: () => void
}

export const ProductActions = ({
  productId,
  isActive,
  onArchive
}: ProductActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon-sm" asChild>
        <Link href={`/admin/products/${productId}`}>
          <PencilIcon className="size-4" />
          <span className="sr-only">編集</span>
        </Link>
      </Button>
      {isActive && (
        <Button variant="ghost" size="icon-sm" onClick={onArchive}>
          <ArchiveIcon className="size-4" />
          <span className="sr-only">アーカイブ</span>
        </Button>
      )}
    </div>
  )
}
