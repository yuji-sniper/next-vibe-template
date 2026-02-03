import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProductByIdQuery } from "@/features/admin-products/queries/get-product-by-id"
import { adminProductDetailKey } from "@/features/admin-products/queries/keys"
import { getQueryClient } from "@/lib/react-query/query-client"
import { ProductEditContainer } from "./_components/container"

type Props = {
  params: Promise<{ productId: string }>
}

export const metadata: Metadata = {
  title: "商品編集",
  description: "商品編集ページです。"
}

export default async function ProductEditPage({ params }: Props) {
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
      <ProductEditContainer productId={productId} />
    </HydrationBoundary>
  )
}
