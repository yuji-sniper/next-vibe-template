import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import type { Metadata } from "next"
import { getProductsQuery } from "@/features/admin-products/queries/get-products"
import { adminProductsWithFilterKey } from "@/features/admin-products/queries/keys"
import { getQueryClient } from "@/lib/react-query/query-client"
import { ProductsContainer } from "./_components/container"

export const metadata: Metadata = {
  title: "商品管理",
  description: "商品管理ページです。"
}

export default function ProductsPage() {
  const queryClient = getQueryClient()

  queryClient.prefetchQuery({
    queryKey: adminProductsWithFilterKey(),
    queryFn: () => getProductsQuery({})
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsContainer />
    </HydrationBoundary>
  )
}
