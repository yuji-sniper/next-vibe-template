import { findProductsAction } from "@/backend/modules/billing/internal/presentation/actions/find-products/find-products.action"
import { ServerError } from "@/utils/error/server-error"
import type { Product } from "../types/product"

export type GetProductsQueryParams = {
  activeOnly?: boolean
}

export type GetProductsQueryResult = {
  products: Product[]
}

export const getProductsQuery = async ({
  activeOnly
}: GetProductsQueryParams = {}): Promise<GetProductsQueryResult> => {
  const res = await findProductsAction({
    activeOnly,
    includePrices: false
  })

  if (!res.ok) {
    throw new ServerError(
      res.error.code,
      res.error.status,
      res.error.message,
      res.error.details
    )
  }

  const products: Product[] = res.data.products

  return { products }
}
