"use client"

import { useQuery } from "@tanstack/react-query"
import { getNotificationsQuery } from "../../queries/get-notifications"
import { adminNotificationsWithFilterKey } from "../../queries/keys"
import type { NotificationStatus } from "../../types/notification"

export const NOTIFICATIONS_PER_PAGE = 20

export const useGetNotificationsQuery = ({
  status,
  page
}: {
  status?: NotificationStatus
  page: number
}) => {
  return useQuery({
    queryKey: adminNotificationsWithFilterKey({ status, page }),
    queryFn: () =>
      getNotificationsQuery({
        status,
        limit: NOTIFICATIONS_PER_PAGE,
        offset: (page - 1) * NOTIFICATIONS_PER_PAGE
      })
  })
}
