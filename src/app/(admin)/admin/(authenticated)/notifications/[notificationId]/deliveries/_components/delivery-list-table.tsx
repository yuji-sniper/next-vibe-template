"use client"

import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { DeliveryStatusBadge } from "@/features/admin-notifications/components/ui/DeliveryStatusBadge"
import type { DeliveryListItem } from "@/features/admin-notifications/types/delivery"

type DeliveryListTableProps = {
  deliveries: DeliveryListItem[]
  isLoading: boolean
}

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  })
}

const TableSkeleton = () => {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: スケルトン行のためindex使用を許可
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-5 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-40" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-8" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-28" />
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

export const DeliveryListTable = ({
  deliveries,
  isLoading
}: DeliveryListTableProps) => {
  if (!isLoading && deliveries.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
        配信結果はありません
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ユーザーID</TableHead>
          <TableHead>メールアドレス</TableHead>
          <TableHead>ステータス</TableHead>
          <TableHead>試行回数</TableHead>
          <TableHead>エラー</TableHead>
          <TableHead>送信日時</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          deliveries.map((delivery) => (
            <TableRow key={delivery.id}>
              <TableCell className="font-mono text-xs">
                {delivery.userId}
              </TableCell>
              <TableCell className="text-sm">{delivery.email}</TableCell>
              <TableCell>
                <DeliveryStatusBadge status={delivery.status} />
              </TableCell>
              <TableCell className="text-center">
                {delivery.attemptCount}
              </TableCell>
              <TableCell>
                {delivery.lastError ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="block max-w-[200px] truncate text-sm text-red-600">
                          {delivery.lastError}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p className="text-sm">{delivery.lastError}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-sm">
                {delivery.sentAt ? formatDateTime(delivery.sentAt) : "-"}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
