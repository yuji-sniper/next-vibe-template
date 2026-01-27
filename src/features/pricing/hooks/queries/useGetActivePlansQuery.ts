"use client"

import { useQuery } from "@tanstack/react-query"
import { getActivePlansQuery } from "../../queries/get-active-plans"
import { activePlansKey } from "../../queries/keys"

export const useGetActivePlansQuery = () => {
  return useQuery({
    queryKey: activePlansKey,
    queryFn: getActivePlansQuery
  })
}
