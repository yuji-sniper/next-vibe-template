"use client"

import { useState } from "react"
import {
  DELIVERIES_PER_PAGE,
  useGetDeliveriesQuery
} from "@/features/admin-notifications/hooks/queries/useGetDeliveriesQuery"
import {
  type DeliveryFilterStatus,
  DeliveryStatus
} from "@/features/admin-notifications/types/delivery"
import { DeliveriesPresentational } from "./presentational"

type DeliveriesContainerProps = {
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

export const DeliveriesContainer = ({
  notificationId
}: DeliveriesContainerProps) => {
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
    <DeliveriesPresentational
      deliveries={data?.deliveries ?? []}
      summary={data?.summary ?? null}
      isLoading={isLoading}
      filterStatus={filterStatus}
      page={page}
      totalPages={totalPages}
      onFilterChange={handleFilterChange}
      onPageChange={setPage}
    />
  )
}
