import { z } from "zod"
import { resolveContainer } from "@/backend/bootstrap/container"
import {
  type CreateProductUseCasePort,
  CreateProductUseCasePortToken
} from "@/backend/modules/billing/application/commands/usecases/create-product/create-product.usecase.port"
import { ProductCreateFailedError } from "@/backend/modules/billing/domain/product/product.errors"
import { UnauthorizedError } from "@/backend/modules/shared/domain/errors/unauthorized.error"
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

type CreateProductHandlerInput = z.infer<typeof createProductSchema>

type CreateProductHandlerResult = Result<{
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

export const handleCreateProduct = async (
  input: CreateProductHandlerInput
): Promise<CreateProductHandlerResult> => {
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

  const usecase = await resolveContainer<CreateProductUseCasePort>(
    CreateProductUseCasePortToken
  )

  try {
    const output = await usecase.handle({
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

    if (e instanceof ProductCreateFailedError) {
      return {
        ok: false,
        error: {
          code: BILLING_ERROR_CODES.PRODUCT_CREATE_FAILED,
          status: 500,
          message: "Failed to create product"
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
