import { createPriceAction } from "@/backend/modules/billing/internal/presentation/actions/create-price/create-price.action"
import { ServerError } from "@/utils/error/server-error"
import type { PriceFormValues } from "../types/price-form"

export type CreatePriceInput = PriceFormValues & {
  productId: string
}

export const createPriceMutation = async (input: CreatePriceInput) => {
  const res = await createPriceAction({
    productId: input.productId,
    unitAmount: input.unitAmount,
    currency: input.currency,
    type: input.type,
    recurringInterval: input.recurringInterval,
    recurringIntervalCount: input.recurringIntervalCount,
    displayName: input.displayName || undefined
  })

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
