import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { notFound } from "next/navigation"
import { getProductByIdQuery } from "@/features/admin-products/queries/get-product-by-id"
import { adminProductDetailKey } from "@/features/admin-products/queries/keys"
import { getQueryClient } from "@/lib/react-query/query-client"
import { PriceCreateContainer } from "./_components/container"

type Props = {
  params: Promise<{ productId: string }>
}

export default async function PriceCreatePage({ params }: Props) {
  const { productId } = await params
  const queryClient = getQueryClient()

  try {
    await queryClient.fetchQuery({
      queryKey: adminProductDetailKey(productId),
      queryFn: () => getProductByIdQuery({ productId })
    })
  } catch {
    notFound()
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PriceCreateContainer productId={productId} />
    </HydrationBoundary>
  )
}
