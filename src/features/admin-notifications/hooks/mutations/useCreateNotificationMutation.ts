"use client"

import { useMutation } from "@tanstack/react-query"
import { getQueryClient } from "@/lib/react-query/query-client"
import { createNotificationMutation } from "../../mutations/create-notification"
import { adminNotificationsKey } from "../../queries/keys"

export const useCreateNotificationMutation = () => {
  return useMutation({
    mutationFn: createNotificationMutation,
    onSuccess: () => {
      getQueryClient().invalidateQueries({ queryKey: adminNotificationsKey })
    }
  })
}
