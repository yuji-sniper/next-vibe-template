"use client"

import { useQuery } from "@tanstack/react-query"
import { getActivePlansQuery } from "../../queries/get-active-plans"
import { activePlansKey } from "../../queries/keys"
import type { PriceType } from "../../types/plan"

export const useGetActivePlansQuery = (priceType?: PriceType) => {
  return useQuery({
    queryKey: activePlansKey(priceType),
    queryFn: () => getActivePlansQuery(priceType)
  })
}
