import { archiveProductAction } from "@/backend/modules/billing/internal/presentation/actions/archive-product/archive-product.action"
import { ServerError } from "@/utils/error/server-error"

export type ArchiveProductMutationParams = {
  productId: string
}

export const archiveProductMutation = async ({
  productId
}: ArchiveProductMutationParams): Promise<void> => {
  const res = await archiveProductAction({ productId })

  if (!res.ok) {
    throw new ServerError(
      res.error.code,
      res.error.status,
      res.error.message,
      res.error.details
    )
  }
}
