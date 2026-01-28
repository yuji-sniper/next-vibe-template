import { useMutation } from "@tanstack/react-query"
import { getQueryClient } from "@/lib/react-query/query-client"
import {
  type UpdateProductInput,
  updateProductMutation
} from "../../mutations/update-product"
import { adminProductDetailKey, adminProductsKey } from "../../queries/keys"

export const useUpdateProductMutation = () => {
  return useMutation({
    mutationFn: (input: UpdateProductInput) => updateProductMutation(input),
    onSuccess: (_, variables) => {
      const queryClient = getQueryClient()
      queryClient.invalidateQueries({ queryKey: adminProductsKey })
      queryClient.invalidateQueries({
        queryKey: adminProductDetailKey(variables.productId)
      })
    }
  })
}
