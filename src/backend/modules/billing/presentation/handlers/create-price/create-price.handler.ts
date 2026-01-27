import { z } from "zod"
import { resolveContainer } from "@/backend/bootstrap/container"
import {
  type CreatePriceUseCasePort,
  CreatePriceUseCasePortToken
} from "@/backend/modules/billing/application/commands/usecases/create-price/create-price.usecase.port"
import type {
  PriceType,
  RecurringInterval
} from "@/backend/modules/billing/domain/price/price"
import { PriceCreateFailedError } from "@/backend/modules/billing/domain/price/price.errors"
import {
  ProductNotFoundError,
  ProductNotSyncedError
} from "@/backend/modules/billing/domain/product/product.errors"
import { UnauthorizedError } from "@/backend/modules/shared/domain/errors/unauthorized.error"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { formatZodErrors } from "@/backend/modules/shared/presentation/handlers/utils/format-zod-errors"
import { AUTH_ADMIN_ERROR_CODES } from "@/shared/errors/auth-admin.errors"
import { BILLING_ERROR_CODES } from "@/shared/errors/billing.errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

const createPriceSchema = z
  .object({
    productId: z.string().min(1, "Product ID is required"),
    unitAmount: z.number().int().min(0, "Unit amount must be non-negative"),
    currency: z.string().min(1).max(3).optional(),
    type: z.enum(["one_time", "recurring"]),
    recurringInterval: z.enum(["month", "year"]).optional(),
    recurringIntervalCount: z.number().int().min(1).max(12).optional(),
    displayName: z.string().max(255).optional(),
    metadata: z.record(z.string(), z.string()).optional()
  })
  .refine(
    (data) => {
      // recurring の場合は recurringInterval が必須
      if (data.type === "recurring" && !data.recurringInterval) {
        return false
      }
      return true
    },
    {
      message: "Recurring interval is required for recurring prices",
      path: ["recurringInterval"]
    }
  )

type CreatePriceHandlerInput = z.infer<typeof createPriceSchema>

type CreatePriceHandlerResult = Result<{
  price: {
    id: string
    productId: string
    stripePriceId: string | null
    currency: string
    unitAmount: number
    type: PriceType
    recurringInterval: RecurringInterval | null
    recurringIntervalCount: number
    active: boolean
    displayName: string | null
    metadata: Record<string, string> | null
    createdAt: Date
    updatedAt: Date
  }
}>

export const handleCreatePrice = async (
  input: CreatePriceHandlerInput
): Promise<CreatePriceHandlerResult> => {
  const parsed = createPriceSchema.safeParse(input)

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

  const usecase = await resolveContainer<CreatePriceUseCasePort>(
    CreatePriceUseCasePortToken
  )

  try {
    const output = await usecase.handle({
      productId: parsed.data.productId,
      unitAmount: parsed.data.unitAmount,
      currency: parsed.data.currency,
      type: parsed.data.type,
      recurringInterval: parsed.data.recurringInterval,
      recurringIntervalCount: parsed.data.recurringIntervalCount,
      displayName: parsed.data.displayName,
      metadata: parsed.data.metadata
    })

    return {
      ok: true,
      data: {
        price: output.price
      }
    }
  } catch (e: unknown) {
    console.error(e)

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

    if (e instanceof ProductNotSyncedError) {
      return {
        ok: false,
        error: {
          code: BILLING_ERROR_CODES.PRODUCT_NOT_SYNCED,
          status: 400,
          message: "Product is not synced with Stripe"
        }
      }
    }

    if (e instanceof PriceCreateFailedError) {
      return {
        ok: false,
        error: {
          code: BILLING_ERROR_CODES.PRICE_CREATE_FAILED,
          status: 500,
          message: "Failed to create price"
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
