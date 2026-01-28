import { useMutation } from "@tanstack/react-query"
import { getQueryClient } from "@/lib/react-query/query-client"
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
  return useMutation({
    mutationFn: (input: ArchivePriceInput) => archivePriceMutation(input),
    onSuccess: () => {
      getQueryClient().invalidateQueries({
        queryKey: adminProductDetailKey(productId)
      })
    }
  })
}
