"use client"

import { useMutation } from "@tanstack/react-query"
import { cancelSubscriptionMutation } from "../../mutations/cancel-subscription"

export const useCancelSubscriptionMutation = () => {
  return useMutation({
    mutationFn: cancelSubscriptionMutation
  })
}
