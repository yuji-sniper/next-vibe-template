import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getProductsQuery } from "@/features/admin-products/queries/get-products"
import { adminProductsWithFilterKey } from "@/features/admin-products/queries/keys"
import { getQueryClient } from "@/lib/react-query/query-client"

export default async function ProductsLayout({
  children
}: {
  children: React.ReactNode
}) {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: adminProductsWithFilterKey(undefined),
    queryFn: () => getProductsQuery({ activeOnly: undefined })
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  )
}
