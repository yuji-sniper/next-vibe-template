"use client"

import { useMutation } from "@tanstack/react-query"
import { getQueryClient } from "@/lib/react-query/query-client"
import { createPriceMutation } from "../../mutations/create-price"
import { adminProductDetailKey } from "../../queries/keys"

type UseCreatePriceMutationProps = {
  productId: string
}

export const useCreatePriceMutation = ({
  productId
}: UseCreatePriceMutationProps) => {
  return useMutation({
    mutationFn: createPriceMutation,
    onSuccess: () => {
      getQueryClient().invalidateQueries({
        queryKey: adminProductDetailKey(productId)
      })
    }
  })
}
