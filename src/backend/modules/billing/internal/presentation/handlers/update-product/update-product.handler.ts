import { inject, injectable } from "tsyringe"
import { z } from "zod"
import { AuthAdminUnauthorizedError } from "@/backend/modules/auth-admin/public/errors/auth-admin.errors"
import {
  ProductNotFoundError,
  ProductUpdateFailedError
} from "@/backend/modules/billing/public/errors/product.errors"
import type { UpdateProductUseCasePort } from "@/backend/modules/billing/public/ports/update-product.usecase.port"
import { UpdateProductUseCasePortToken } from "@/backend/modules/billing/public/ports/update-product.usecase.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { formatZodErrors } from "@/backend/modules/shared/presentation/handlers/utils/format-zod-errors"
import { AUTH_ADMIN_ERROR_CODES } from "@/shared/errors/auth-admin.errors"
import { BILLING_ERROR_CODES } from "@/shared/errors/billing.errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

const updateProductSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  active: z.boolean().optional(),
  features: z.array(z.string()).optional(),
  displayOrder: z.number().int().min(0).optional(),
  metadata: z.record(z.string(), z.string()).optional()
})

export type UpdateProductHandlerInput = z.infer<typeof updateProductSchema>

export type UpdateProductHandlerResult = Result<{
  product: {
    id: string
    stripeProductId: string | null
    name: string
    description: string | null
    active: boolean
    features: string[] | null
    displayOrder: number
    metadata: Record<string, string> | null
    createdAt: Date
    updatedAt: Date
  }
}>

export const UpdateProductHandlerToken = Symbol("UpdateProductHandler")

export interface UpdateProductHandler {
  handle(input: UpdateProductHandlerInput): Promise<UpdateProductHandlerResult>
}

@injectable()
export class UpdateProductHandlerImpl implements UpdateProductHandler {
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(UpdateProductUseCasePortToken)
    private readonly updateProductUseCase: UpdateProductUseCasePort
  ) {}

  async handle(
    input: UpdateProductHandlerInput
  ): Promise<UpdateProductHandlerResult> {
    const parsed = updateProductSchema.safeParse(input)

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
      const output = await this.updateProductUseCase.handle({
        productId: parsed.data.productId,
        name: parsed.data.name,
        description: parsed.data.description,
        active: parsed.data.active,
        features: parsed.data.features,
        displayOrder: parsed.data.displayOrder,
        metadata: parsed.data.metadata
      })

      return {
        ok: true,
        data: {
          product: {
            id: output.product.id,
            stripeProductId: output.product.stripeProductId,
            name: output.product.name,
            description: output.product.description,
            active: output.product.active,
            features: output.product.features,
            displayOrder: output.product.displayOrder,
            metadata: output.product.metadata,
            createdAt: output.product.createdAt,
            updatedAt: output.product.updatedAt
          }
        }
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

      if (e instanceof ProductUpdateFailedError) {
        this.logger.error("Failed to update product", {
          productId: parsed.data.productId,
          error: e instanceof Error ? e.message : String(e)
        })
        return {
          ok: false,
          error: {
            code: BILLING_ERROR_CODES.PRODUCT_UPDATE_FAILED,
            status: 500,
            message: "Failed to update product"
          }
        }
      }

      this.logger.error("Unexpected error in UpdateProductHandler", {
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
