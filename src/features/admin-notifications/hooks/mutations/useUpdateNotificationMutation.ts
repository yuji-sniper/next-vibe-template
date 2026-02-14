"use client"

import { useMutation } from "@tanstack/react-query"
import { getQueryClient } from "@/lib/react-query/query-client"
import {
  type UpdateNotificationInput,
  updateNotificationMutation
} from "../../mutations/update-notification"
import {
  adminNotificationDetailKey,
  adminNotificationsKey
} from "../../queries/keys"

export const useUpdateNotificationMutation = () => {
  return useMutation({
    mutationFn: (input: UpdateNotificationInput) =>
      updateNotificationMutation(input),
    onSuccess: (_, variables) => {
      const queryClient = getQueryClient()
      queryClient.invalidateQueries({ queryKey: adminNotificationsKey })
      queryClient.invalidateQueries({
        queryKey: adminNotificationDetailKey(variables.id)
      })
    }
  })
}
