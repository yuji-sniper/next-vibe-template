"use client"

import { useMutation } from "@tanstack/react-query"
import { createSubscriptionCheckoutSessionMutation } from "../../mutations/create-subscription-checkout-session"

export const useCreateSubscriptionCheckoutSessionMutation = () => {
  return useMutation({
    mutationFn: createSubscriptionCheckoutSessionMutation
  })
}
