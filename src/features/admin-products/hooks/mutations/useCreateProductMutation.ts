"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProductMutation } from "../../mutations/create-product"
import { adminProductsKey } from "../../queries/keys"

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProductMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminProductsKey })
    }
  })
}
