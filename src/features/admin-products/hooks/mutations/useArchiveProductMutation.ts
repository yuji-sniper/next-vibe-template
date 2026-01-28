"use client"

import { useMutation } from "@tanstack/react-query"
import { getQueryClient } from "@/lib/react-query/query-client"
import { archiveProductMutation } from "../../mutations/archive-product"
import { adminProductsKey } from "../../queries/keys"

export const useArchiveProductMutation = () => {
  return useMutation({
    mutationFn: archiveProductMutation,
    onSuccess: () => {
      getQueryClient().invalidateQueries({ queryKey: adminProductsKey })
    }
  })
}
