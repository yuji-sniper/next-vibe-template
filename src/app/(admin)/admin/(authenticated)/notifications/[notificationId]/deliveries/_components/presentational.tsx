"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { NotificationPagination } from "@/features/admin-notifications/components/ui/NotificationPagination"
import type {
  DeliveryFilterStatus,
  DeliveryListItem,
  DeliverySummary
} from "@/features/admin-notifications/types/delivery"
import { DeliveryStatus } from "@/features/admin-notifications/types/delivery"
import { DeliveryListTable } from "./delivery-list-table"
import { DeliverySummaryCard } from "./delivery-summary-card"

type DeliveriesPresentationalProps = {
  deliveries: DeliveryListItem[]
  summary: DeliverySummary | null
  isLoading: boolean
  filterStatus: DeliveryFilterStatus
  page: number
  totalPages: number
  onFilterChange: (value: string) => void
  onPageChange: (page: number) => void
}

export const DeliveriesPresentational = ({
  deliveries,
  summary,
  isLoading,
  filterStatus,
  page,
  totalPages,
  onFilterChange,
  onPageChange
}: DeliveriesPresentationalProps) => {
  return (
    <div className="space-y-6">
      {summary && <DeliverySummaryCard summary={summary} />}

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">配信一覧</h3>
        <Select value={filterStatus.toString()} onValueChange={onFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="ステータス" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value={DeliveryStatus.PENDING.toString()}>
              保留
            </SelectItem>
            <SelectItem value={DeliveryStatus.SENDING.toString()}>
              送信中
            </SelectItem>
            <SelectItem value={DeliveryStatus.SENT.toString()}>
              送信済み
            </SelectItem>
            <SelectItem value={DeliveryStatus.FAILED.toString()}>
              失敗
            </SelectItem>
            <SelectItem value={DeliveryStatus.SUPPRESSED.toString()}>
              抑制
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <DeliveryListTable deliveries={deliveries} isLoading={isLoading} />
      </div>

      <NotificationPagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  )
}
