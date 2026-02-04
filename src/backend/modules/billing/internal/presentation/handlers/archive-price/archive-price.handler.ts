import { inject, injectable } from "tsyringe"
import { z } from "zod"
import { AuthAdminUnauthorizedError } from "@/backend/modules/auth-admin/public/errors/auth-admin.errors"
import {
  PriceArchiveFailedError,
  PriceNotFoundError
} from "@/backend/modules/billing/public/errors/price.errors"
import type { ArchivePriceUseCasePort } from "@/backend/modules/billing/public/ports/archive-price.usecase.port"
import { ArchivePriceUseCasePortToken } from "@/backend/modules/billing/public/ports/archive-price.usecase.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { formatZodErrors } from "@/backend/modules/shared/presentation/handlers/utils/format-zod-errors"
import { AUTH_ADMIN_ERROR_CODES } from "@/shared/errors/auth-admin.errors"
import { BILLING_ERROR_CODES } from "@/shared/errors/billing.errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

const archivePriceSchema = z.object({
  priceId: z.string().min(1, "Price ID is required")
})

export type ArchivePriceHandlerInput = z.infer<typeof archivePriceSchema>

export type ArchivePriceHandlerResult = Result<void>

export const ArchivePriceHandlerToken = Symbol("ArchivePriceHandler")

export interface ArchivePriceHandler {
  handle(input: ArchivePriceHandlerInput): Promise<ArchivePriceHandlerResult>
}

@injectable()
export class ArchivePriceHandlerImpl implements ArchivePriceHandler {
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(ArchivePriceUseCasePortToken)
    private readonly archivePriceUseCase: ArchivePriceUseCasePort
  ) {}

  async handle(
    input: ArchivePriceHandlerInput
  ): Promise<ArchivePriceHandlerResult> {
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

    try {
      await this.archivePriceUseCase.handle({
        priceId: parsed.data.priceId
      })

      return {
        ok: true,
        data: undefined
      }
    } catch (e: unknown) {
      if (e instanceof AuthAdminUnauthorizedError) {
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
        this.logger.error("Failed to archive price", {
          priceId: parsed.data.priceId,
          error: e instanceof Error ? e.message : String(e)
        })
        return {
          ok: false,
          error: {
            code: BILLING_ERROR_CODES.PRICE_ARCHIVE_FAILED,
            status: 500,
            message: "Failed to archive price"
          }
        }
      }

      this.logger.error("Unexpected error in ArchivePriceHandler", {
        priceId: parsed.data.priceId,
        error: e instanceof Error ? e.message : String(e)
      })

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
}
