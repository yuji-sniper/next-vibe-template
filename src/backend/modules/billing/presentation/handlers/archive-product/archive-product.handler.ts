import { z } from "zod"
import { resolveContainer } from "@/backend/bootstrap/container"
import {
  type ArchiveProductUseCasePort,
  ArchiveProductUseCasePortToken
} from "@/backend/modules/billing/application/commands/usecases/archive-product/archive-product.usecase.port"
import {
  ProductArchiveFailedError,
  ProductNotFoundError,
  ProductUpdateFailedError
} from "@/backend/modules/billing/domain/product/product.errors"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { formatZodErrors } from "@/backend/modules/shared/presentation/handlers/utils/format-zod-errors"
import { BILLING_ERROR_CODES } from "@/shared/errors/billing.errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

const archiveProductSchema = z.object({
  productId: z.string().min(1, "Product ID is required")
})

type ArchiveProductHandlerInput = z.infer<typeof archiveProductSchema>

type ArchiveProductHandlerResult = Result<void>

export const handleArchiveProduct = async (
  input: ArchiveProductHandlerInput
): Promise<ArchiveProductHandlerResult> => {
  const parsed = archiveProductSchema.safeParse(input)

  if (!parsed.success) {
    return {
      ok: false,
      error: {
        code: COMMON_ERROR_CODES.VALIDATION_ERROR,
        status: 422,
        message: "Validation failed",
        fieldErrors: formatZodErrors(parsed.error)
      }
    }
  }

  const usecase = await resolveContainer<ArchiveProductUseCasePort>(
    ArchiveProductUseCasePortToken
  )

  try {
    await usecase.handle({
      productId: parsed.data.productId
    })

    return {
      ok: true,
      data: undefined
    }
  } catch (e: unknown) {
    if (e instanceof ProductNotFoundError) {
      return {
        ok: false,
        error: {
          code: BILLING_ERROR_CODES.PRODUCT_NOT_FOUND,
          status: 404,
          message: "Product not found"
        }
      }
    }

    if (
      e instanceof ProductArchiveFailedError ||
      e instanceof ProductUpdateFailedError
    ) {
      return {
        ok: false,
        error: {
          code: BILLING_ERROR_CODES.PRODUCT_ARCHIVE_FAILED,
          status: 500,
          message: "Failed to archive product"
        }
      }
    }

    return {
      ok: false,
      error: {
        code: COMMON_ERROR_CODES.INTERNAL_SERVER_ERROR,
        status: 500,
        message: "Internal server error"
      }
    }
  }
}
