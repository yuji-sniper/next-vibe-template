import { updateProductAction } from "@/backend/modules/billing/internal/presentation/actions/update-product/update-product.action"
import { ServerError } from "@/utils/error/server-error"

export type UpdateProductInput = {
  productId: string
  name?: string
  description?: string
  active?: boolean
  features?: string[]
  displayOrder?: number
  metadata?: Record<string, string>
}

export const updateProductMutation = async (input: UpdateProductInput) => {
  const res = await updateProductAction(input)

  if (!res.ok) {
    throw new ServerError(
      res.error.code,
      res.error.status,
      res.error.message,
      res.error.details
    )
  }

  return res.data
}
