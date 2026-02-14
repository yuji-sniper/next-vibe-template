"use client"

import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import type { NotificationListItem } from "../../../types/notification"
import { NotificationEmptyState } from "../NotificationEmptyState"
import { NotificationRow } from "../NotificationRow"

type NotificationTableProps = {
  notifications: NotificationListItem[]
  isLoading: boolean
  onCancel: (id: string, title: string) => void
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
            <Skeleton className="h-5 w-32" />
          </td>
          <td className="p-2">
            <Skeleton className="h-5 w-20" />
          </td>
          <td className="p-2">
            <Skeleton className="h-5 w-20" />
          </td>
          <td className="p-2">
            <Skeleton className="h-8 w-16" />
          </td>
        </TableRow>
      ))}
    </>
  )
}

export const NotificationTable = ({
  notifications,
  isLoading,
  onCancel
}: NotificationTableProps) => {
  if (!isLoading && notifications.length === 0) {
    return <NotificationEmptyState />
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>タイトル</TableHead>
          <TableHead>件名</TableHead>
          <TableHead>送信日時</TableHead>
          <TableHead>対象</TableHead>
          <TableHead>ステータス</TableHead>
          <TableHead>操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          notifications.map((notification) => (
            <NotificationRow
              key={notification.id}
              notification={notification}
              onCancel={onCancel}
            />
          ))
        )}
      </TableBody>
    </Table>
  )
}
