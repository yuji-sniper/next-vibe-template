"use client"

import { useQuery } from "@tanstack/react-query"
import { getProductsQuery } from "../../queries/get-products"
import { adminProductsWithFilterKey } from "../../queries/keys"

type UseGetProductsQueryParams = {
  activeOnly?: boolean
}

export const useGetProductsQuery = ({
  activeOnly
}: UseGetProductsQueryParams = {}) => {
  return useQuery({
    queryKey: adminProductsWithFilterKey(activeOnly),
    queryFn: () => getProductsQuery({ activeOnly })
  })
}
