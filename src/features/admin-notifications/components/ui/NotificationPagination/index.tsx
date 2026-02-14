"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

type NotificationPaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const NotificationPagination = ({
  page,
  totalPages,
  onPageChange
}: NotificationPaginationProps) => {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-4 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        <ChevronLeftIcon className="size-4" />
        前へ
      </Button>
      <span className="text-sm text-muted-foreground">
        {page} / {totalPages} ページ
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        次へ
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  )
}
