import { inject, injectable } from "tsyringe"
import { z } from "zod"
import { AuthAdminUnauthorizedError } from "@/backend/modules/auth-admin/public/errors/auth-admin.errors"
import { ProductCreateFailedError } from "@/backend/modules/billing/public/errors/product.errors"
import type { CreateProductUseCasePort } from "@/backend/modules/billing/public/ports/create-product.usecase.port"
import { CreateProductUseCasePortToken } from "@/backend/modules/billing/public/ports/create-product.usecase.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { formatZodErrors } from "@/backend/modules/shared/presentation/handlers/utils/format-zod-errors"
import { AUTH_ADMIN_ERROR_CODES } from "@/shared/errors/auth-admin.errors"
import { BILLING_ERROR_CODES } from "@/shared/errors/billing.errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

const createProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().max(1000).optional(),
  features: z.array(z.string()).optional(),
  displayOrder: z.number().int().min(0).optional(),
  metadata: z.record(z.string(), z.string()).optional()
})

export type CreateProductHandlerInput = z.infer<typeof createProductSchema>

export type CreateProductHandlerResult = Result<{
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

export const CreateProductHandlerToken = Symbol("CreateProductHandler")

export interface CreateProductHandler {
  handle(input: CreateProductHandlerInput): Promise<CreateProductHandlerResult>
}

@injectable()
export class CreateProductHandlerImpl implements CreateProductHandler {
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(CreateProductUseCasePortToken)
    private readonly createProductUseCase: CreateProductUseCasePort
  ) {}

  async handle(
    input: CreateProductHandlerInput
  ): Promise<CreateProductHandlerResult> {
    const parsed = createProductSchema.safeParse(input)

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
      const output = await this.createProductUseCase.handle({
        name: parsed.data.name,
        description: parsed.data.description,
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

      if (e instanceof ProductCreateFailedError) {
        this.logger.error("Failed to create product", {
          name: parsed.data.name,
          error: e instanceof Error ? e.message : String(e)
        })
        return {
          ok: false,
          error: {
            code: BILLING_ERROR_CODES.PRODUCT_CREATE_FAILED,
            status: 500,
            message: "Failed to create product"
          }
        }
      }

      this.logger.error("Unexpected error in CreateProductHandler", {
        name: parsed.data.name,
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
