"use client"

import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { NotificationPagination } from "@/features/admin-notifications/components/ui/NotificationPagination"
import {
  DELIVERIES_PER_PAGE,
  useGetDeliveriesQuery
} from "@/features/admin-notifications/hooks/queries/useGetDeliveriesQuery"
import {
  type DeliveryFilterStatus,
  DeliveryStatus
} from "@/features/admin-notifications/types/delivery"
import { DeliveryListTable } from "./delivery-list-table"
import { DeliverySummaryCard } from "./delivery-summary-card"

type DeliveryListProps = {
  notificationId: string
}

const deliveryFilterStatusMap: Record<string, DeliveryFilterStatus> = {
  all: "all",
  [String(DeliveryStatus.PENDING)]: DeliveryStatus.PENDING,
  [String(DeliveryStatus.SENDING)]: DeliveryStatus.SENDING,
  [String(DeliveryStatus.SENT)]: DeliveryStatus.SENT,
  [String(DeliveryStatus.FAILED)]: DeliveryStatus.FAILED,
  [String(DeliveryStatus.SUPPRESSED)]: DeliveryStatus.SUPPRESSED
}

export const DeliveryList = ({ notificationId }: DeliveryListProps) => {
  const [filterStatus, setFilterStatus] = useState<DeliveryFilterStatus>("all")
  const [page, setPage] = useState(1)

  const status = filterStatus === "all" ? undefined : filterStatus

  const { data, isLoading } = useGetDeliveriesQuery({
    notificationId,
    status,
    page
  })

  const totalPages = data
    ? Math.ceil(
        (filterStatus === "all"
          ? data.summary.total
          : data.deliveries.length === DELIVERIES_PER_PAGE
            ? page * DELIVERIES_PER_PAGE + 1
            : (page - 1) * DELIVERIES_PER_PAGE + data.deliveries.length) /
          DELIVERIES_PER_PAGE
      )
    : 1

  const handleFilterChange = (value: string) => {
    setFilterStatus(deliveryFilterStatusMap[value] ?? "all")
    setPage(1)
  }

  return (
    <div className="space-y-6">
      {data?.summary && <DeliverySummaryCard summary={data.summary} />}

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">配信一覧</h3>
        <Select
          value={filterStatus.toString()}
          onValueChange={handleFilterChange}
        >
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
        <DeliveryListTable
          deliveries={data?.deliveries ?? []}
          isLoading={isLoading}
        />
      </div>

      <NotificationPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  )
}
