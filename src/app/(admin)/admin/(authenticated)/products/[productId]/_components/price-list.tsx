"use client"

import { ChevronDownIcon, ChevronRightIcon, PlusIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import type { Price } from "@/features/admin-products/types/price"
import { PriceRow } from "./price-row"

type PriceListProps = {
  productId: string
  prices: Price[]
  onArchive: (priceId: string) => void
  isArchiving: boolean
}

export const PriceList = ({
  productId,
  prices,
  onArchive,
  isArchiving
}: PriceListProps) => {
  const [isOpen, setIsOpen] = useState(true)

  const activePrices = prices.filter((p) => p.active)
  const archivedPrices = prices.filter((p) => !p.active)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="gap-2 p-0 hover:bg-transparent">
            {isOpen ? (
              <ChevronDownIcon className="size-4" />
            ) : (
              <ChevronRightIcon className="size-4" />
            )}
            <h3 className="text-lg font-semibold">
              価格一覧 ({prices.length})
            </h3>
          </Button>
        </CollapsibleTrigger>
        <Button asChild size="sm" variant="outline">
          <Link href={`/admin/products/${productId}/prices/new`}>
            <PlusIcon className="size-4" />
            価格を追加
          </Link>
        </Button>
      </div>

      <CollapsibleContent className="space-y-4">
        {prices.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            <p>価格が登録されていません</p>
            <p className="mt-2 text-sm">
              「価格を追加」ボタンから価格を登録してください
            </p>
          </div>
        ) : (
          <>
            {activePrices.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  有効な価格 ({activePrices.length})
                </h4>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>表示名</TableHead>
                        <TableHead>金額</TableHead>
                        <TableHead>タイプ</TableHead>
                        <TableHead>間隔</TableHead>
                        <TableHead>ステータス</TableHead>
                        <TableHead className="w-16">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activePrices.map((price) => (
                        <PriceRow
                          key={price.id}
                          price={price}
                          onArchive={onArchive}
                          isArchiving={isArchiving}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {archivedPrices.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  アーカイブ済み ({archivedPrices.length})
                </h4>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>表示名</TableHead>
                        <TableHead>金額</TableHead>
                        <TableHead>タイプ</TableHead>
                        <TableHead>間隔</TableHead>
                        <TableHead>ステータス</TableHead>
                        <TableHead className="w-16">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {archivedPrices.map((price) => (
                        <PriceRow
                          key={price.id}
                          price={price}
                          onArchive={onArchive}
                          isArchiving={isArchiving}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}
