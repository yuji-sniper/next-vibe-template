import { createProductAction } from "@/backend/modules/billing/internal/presentation/actions/create-product/create-product.action"
import { ServerError } from "@/utils/error/server-error"
import type { ProductFormValues } from "../types/product-form"

export const createProductMutation = async (input: ProductFormValues) => {
  const res = await createProductAction(input)

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
