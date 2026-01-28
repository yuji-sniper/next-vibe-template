import { useQuery } from "@tanstack/react-query"
import { getProductByIdQuery } from "../../queries/get-product-by-id"
import { adminProductDetailKey } from "../../queries/keys"

type UseGetProductByIdQueryOptions = {
  productId: string
}

export const useGetProductByIdQuery = ({
  productId
}: UseGetProductByIdQueryOptions) => {
  return useQuery({
    queryKey: adminProductDetailKey(productId),
    queryFn: () => getProductByIdQuery({ productId }),
    enabled: !!productId
  })
}
