"use client"

import { useMutation } from "@tanstack/react-query"
import { getQueryClient } from "@/lib/react-query/query-client"
import { cancelNotificationMutation } from "../../mutations/cancel-notification"
import { adminNotificationsKey } from "../../queries/keys"

export const useCancelNotificationMutation = () => {
  return useMutation({
    mutationFn: cancelNotificationMutation,
    onSuccess: () => {
      getQueryClient().invalidateQueries({ queryKey: adminNotificationsKey })
    }
  })
}
