"use client"

import { useMutation } from "@tanstack/react-query"
import { getQueryClient } from "@/lib/react-query/query-client"
import { createProductMutation } from "../../mutations/create-product"
import { adminProductsKey } from "../../queries/keys"

export const useCreateProductMutation = () => {
  return useMutation({
    mutationFn: createProductMutation,
    onSuccess: () => {
      getQueryClient().invalidateQueries({ queryKey: adminProductsKey })
    }
  })
}
