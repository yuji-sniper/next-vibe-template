import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getProductsQuery } from "@/features/admin-products/queries/get-products"
import { adminProductsWithFilterKey } from "@/features/admin-products/queries/keys"
import { getQueryClient } from "@/lib/react-query/query-client"
import { ProductsContainer } from "./_components/container"

export default function ProductsPage() {
  const queryClient = getQueryClient()

  queryClient.prefetchQuery({
    queryKey: adminProductsWithFilterKey(),
    queryFn: () => getProductsQuery({ activeOnly: false })
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsContainer />
    </HydrationBoundary>
  )
}
