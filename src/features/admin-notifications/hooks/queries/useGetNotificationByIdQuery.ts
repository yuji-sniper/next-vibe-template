"use client"

import { useQuery } from "@tanstack/react-query"
import { getNotificationByIdQuery } from "../../queries/get-notification-by-id"
import { adminNotificationDetailKey } from "../../queries/keys"

export const useGetNotificationByIdQuery = ({
  notificationId
}: {
  notificationId: string
}) => {
  return useQuery({
    queryKey: adminNotificationDetailKey(notificationId),
    queryFn: () => getNotificationByIdQuery({ id: notificationId })
  })
}
