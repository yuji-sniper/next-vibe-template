"use client"

import { PackageIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const ProductEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <PackageIcon className="size-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">商品がありません</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        新しい商品を作成してください。
      </p>
      <Button asChild>
        <Link href="/products/new">新規作成</Link>
      </Button>
    </div>
  )
}
