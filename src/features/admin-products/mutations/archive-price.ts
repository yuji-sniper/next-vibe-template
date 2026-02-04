import { archivePriceAction } from "@/backend/modules/billing/internal/presentation/actions/archive-price/archive-price.action"
import { ServerError } from "@/utils/error/server-error"

export type ArchivePriceInput = {
  priceId: string
}

export const archivePriceMutation = async (input: ArchivePriceInput) => {
  const res = await archivePriceAction({ priceId: input.priceId })

  if (!res.ok) {
    throw new ServerError(
      res.error.code,
      res.error.status,
      res.error.message,
      res.error.details
    )
  }
}
