import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  type ArchivePriceInput,
  archivePriceMutation
} from "../../mutations/archive-price"
import { adminProductDetailKey } from "../../queries/keys"

type UseArchivePriceMutationOptions = {
  productId: string
}

export const useArchivePriceMutation = ({
  productId
}: UseArchivePriceMutationOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: ArchivePriceInput) => archivePriceMutation(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminProductDetailKey(productId)
      })
    }
  })
}
