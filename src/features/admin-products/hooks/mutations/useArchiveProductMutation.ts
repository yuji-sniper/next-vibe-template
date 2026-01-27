"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { archiveProductMutation } from "../../mutations/archive-product"
import { adminProductsKey } from "../../queries/keys"

export const useArchiveProductMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: archiveProductMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminProductsKey })
    }
  })
}
