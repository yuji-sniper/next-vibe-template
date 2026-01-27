import { z } from "zod"
import { resolveContainer } from "@/backend/bootstrap/container"
import {
  type ArchivePriceUseCasePort,
  ArchivePriceUseCasePortToken
} from "@/backend/modules/billing/application/commands/usecases/archive-price/archive-price.usecase.port"
import {
  PriceArchiveFailedError,
  PriceNotFoundError
} from "@/backend/modules/billing/domain/price/price.errors"
import { UnauthorizedError } from "@/backend/modules/shared/domain/errors/unauthorized.error"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { formatZodErrors } from "@/backend/modules/shared/presentation/handlers/utils/format-zod-errors"
import { AUTH_ADMIN_ERROR_CODES } from "@/shared/errors/auth-admin.errors"
import { BILLING_ERROR_CODES } from "@/shared/errors/billing.errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

const archivePriceSchema = z.object({
  priceId: z.string().min(1, "Price ID is required")
})

type ArchivePriceHandlerInput = z.infer<typeof archivePriceSchema>

type ArchivePriceHandlerResult = Result<void>

export const handleArchivePrice = async (
  input: ArchivePriceHandlerInput
): Promise<ArchivePriceHandlerResult> => {
  const parsed = archivePriceSchema.safeParse(input)

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

  const usecase = await resolveContainer<ArchivePriceUseCasePort>(
    ArchivePriceUseCasePortToken
  )

  try {
    await usecase.handle({
      priceId: parsed.data.priceId
    })

    return {
      ok: true,
      data: undefined
    }
  } catch (e: unknown) {
    if (e instanceof UnauthorizedError) {
      return {
        ok: false,
        error: {
          code: AUTH_ADMIN_ERROR_CODES.UNAUTHORIZED,
          status: 401,
          message: "Unauthorized"
        }
      }
    }

    if (e instanceof PriceNotFoundError) {
      return {
        ok: false,
        error: {
          code: BILLING_ERROR_CODES.PRICE_NOT_FOUND,
          status: 404,
          message: "Price not found"
        }
      }
    }

    if (e instanceof PriceArchiveFailedError) {
      return {
        ok: false,
        error: {
          code: BILLING_ERROR_CODES.PRICE_ARCHIVE_FAILED,
          status: 500,
          message: "Failed to archive price"
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
