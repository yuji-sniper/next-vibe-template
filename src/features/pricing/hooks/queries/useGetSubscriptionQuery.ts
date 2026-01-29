"use client"

import { useQuery } from "@tanstack/react-query"
import { getSubscriptionQuery } from "../../queries/get-subscription"
import { subscriptionKey } from "../../queries/keys"

export const useGetSubscriptionQuery = (includeProduct?: boolean) => {
  return useQuery({
    queryKey: subscriptionKey(includeProduct),
    queryFn: () => getSubscriptionQuery(includeProduct)
  })
}
