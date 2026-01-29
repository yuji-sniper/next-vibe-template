"use client"

import { useMutation } from "@tanstack/react-query"
import { changeSubscriptionPlanMutation } from "../../mutations/change-subscription-plan"

export const useChangeSubscriptionPlanMutation = () => {
  return useMutation({
    mutationFn: changeSubscriptionPlanMutation
  })
}
