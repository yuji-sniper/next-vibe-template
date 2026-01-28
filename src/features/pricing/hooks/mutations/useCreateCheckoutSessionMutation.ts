"use client"

import { useMutation } from "@tanstack/react-query"
import { createCheckoutSessionMutation } from "../../mutations/create-checkout-session"

export const useCreateCheckoutSessionMutation = () => {
  return useMutation({
    mutationFn: createCheckoutSessionMutation
  })
}
