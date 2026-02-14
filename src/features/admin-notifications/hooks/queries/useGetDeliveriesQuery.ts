"use client"

import { useQuery } from "@tanstack/react-query"
import { getDeliveriesQuery } from "../../queries/get-deliveries"
import { adminDeliveriesWithFilterKey } from "../../queries/keys"
import type { DeliveryStatus } from "../../types/delivery"

export const DELIVERIES_PER_PAGE = 50

export const useGetDeliveriesQuery = ({
  notificationId,
  status,
  page
}: {
  notificationId: string
  status?: DeliveryStatus
  page: number
}) => {
  return useQuery({
    queryKey: adminDeliveriesWithFilterKey({ notificationId, status, page }),
    queryFn: () =>
      getDeliveriesQuery({
        notificationId,
        status,
        limit: DELIVERIES_PER_PAGE,
        offset: (page - 1) * DELIVERIES_PER_PAGE
      })
  })
}
