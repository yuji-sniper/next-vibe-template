import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  type UpdateProductInput,
  updateProductMutation
} from "../../mutations/update-product"
import { adminProductDetailKey, adminProductsKey } from "../../queries/keys"

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateProductInput) => updateProductMutation(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminProductsKey })
      queryClient.invalidateQueries({
        queryKey: adminProductDetailKey(variables.productId)
      })
    }
  })
}
