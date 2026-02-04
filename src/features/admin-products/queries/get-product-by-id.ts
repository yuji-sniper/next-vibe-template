import { findProductByIdAction } from "@/backend/modules/billing/internal/presentation/actions/find-product-by-id/find-product-by-id.action"
import { ServerError } from "@/utils/error/server-error"
import type { ProductDetail } from "../types/product-detail"

type GetProductByIdInput = {
  productId: string
}

type GetProductByIdResult = {
  product: ProductDetail
}

export const getProductByIdQuery = async (
  input: GetProductByIdInput
): Promise<GetProductByIdResult> => {
  const res = await findProductByIdAction({ productId: input.productId })

  if (!res.ok) {
    throw new ServerError(
      res.error.code,
      res.error.status,
      res.error.message,
      res.error.details
    )
  }

  const product: ProductDetail = {
    id: res.data.product.id,
    stripeProductId: res.data.product.stripeProductId,
    name: res.data.product.name,
    description: res.data.product.description,
    active: res.data.product.active,
    displayOrder: res.data.product.displayOrder,
    features: res.data.product.features,
    metadata: res.data.product.metadata,
    createdAt: res.data.product.createdAt,
    updatedAt: res.data.product.updatedAt,
    prices: res.data.product.prices.map((p) => ({
      id: p.id,
      productId: p.productId,
      stripePriceId: p.stripePriceId,
      unitAmount: p.unitAmount,
      currency: p.currency,
      type: p.type,
      recurringInterval: p.recurringInterval,
      recurringIntervalCount: p.recurringIntervalCount,
      displayName: p.displayName,
      active: p.active,
      metadata: p.metadata,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt
    }))
  }

  return { product }
}
