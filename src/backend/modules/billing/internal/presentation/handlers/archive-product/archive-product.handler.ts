import { inject, injectable } from "tsyringe"
import { z } from "zod"
import { AuthAdminUnauthorizedError } from "@/backend/modules/auth-admin/public/errors/auth-admin.errors"
import {
  ProductArchiveFailedError,
  ProductNotFoundError,
  ProductUpdateFailedError
} from "@/backend/modules/billing/public/errors/product.errors"
import type { ArchiveProductUseCasePort } from "@/backend/modules/billing/public/ports/archive-product.usecase.port"
import { ArchiveProductUseCasePortToken } from "@/backend/modules/billing/public/ports/archive-product.usecase.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { formatZodErrors } from "@/backend/modules/shared/presentation/handlers/utils/format-zod-errors"
import { AUTH_ADMIN_ERROR_CODES } from "@/shared/errors/auth-admin.errors"
import { BILLING_ERROR_CODES } from "@/shared/errors/billing.errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

const archiveProductSchema = z.object({
  productId: z.string().min(1, "Product ID is required")
})

export type ArchiveProductHandlerInput = z.infer<typeof archiveProductSchema>

export type ArchiveProductHandlerResult = Result<void>

export const ArchiveProductHandlerToken = Symbol("ArchiveProductHandler")

export interface ArchiveProductHandler {
  handle(
    input: ArchiveProductHandlerInput
  ): Promise<ArchiveProductHandlerResult>
}

@injectable()
export class ArchiveProductHandlerImpl implements ArchiveProductHandler {
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(ArchiveProductUseCasePortToken)
    private readonly archiveProductUseCase: ArchiveProductUseCasePort
  ) {}

  async handle(
    input: ArchiveProductHandlerInput
  ): Promise<ArchiveProductHandlerResult> {
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

    try {
      await this.archiveProductUseCase.handle({
        productId: parsed.data.productId
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
        this.logger.error("Failed to archive product", {
          productId: parsed.data.productId,
          error: e instanceof Error ? e.message : String(e)
        })
        return {
          ok: false,
          error: {
            code: BILLING_ERROR_CODES.PRODUCT_ARCHIVE_FAILED,
            status: 500,
            message: "Failed to archive product"
          }
        }
      }

      this.logger.error("Unexpected error in ArchiveProductHandler", {
        productId: parsed.data.productId,
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
