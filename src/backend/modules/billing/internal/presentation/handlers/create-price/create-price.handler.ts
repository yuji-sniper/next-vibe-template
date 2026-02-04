import { inject, injectable } from "tsyringe"
import { z } from "zod"
import { AuthAdminUnauthorizedError } from "@/backend/modules/auth-admin/public/errors/auth-admin.errors"
import type {
  PriceType,
  RecurringInterval
} from "@/backend/modules/billing/internal/domain/price/price"
import { PriceCreateFailedError } from "@/backend/modules/billing/public/errors/price.errors"
import {
  ProductNotFoundError,
  ProductNotSyncedError
} from "@/backend/modules/billing/public/errors/product.errors"
import type { CreatePriceUseCasePort } from "@/backend/modules/billing/public/ports/create-price.usecase.port"
import { CreatePriceUseCasePortToken } from "@/backend/modules/billing/public/ports/create-price.usecase.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
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

export type CreatePriceHandlerInput = z.infer<typeof createPriceSchema>

export type CreatePriceHandlerResult = Result<{
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

export const CreatePriceHandlerToken = Symbol("CreatePriceHandler")

export interface CreatePriceHandler {
  handle(input: CreatePriceHandlerInput): Promise<CreatePriceHandlerResult>
}

@injectable()
export class CreatePriceHandlerImpl implements CreatePriceHandler {
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(CreatePriceUseCasePortToken)
    private readonly createPriceUseCase: CreatePriceUseCasePort
  ) {}

  async handle(
    input: CreatePriceHandlerInput
  ): Promise<CreatePriceHandlerResult> {
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

    try {
      const output = await this.createPriceUseCase.handle({
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
        this.logger.error("Failed to create price", {
          productId: parsed.data.productId,
          error: e instanceof Error ? e.message : String(e)
        })
        return {
          ok: false,
          error: {
            code: BILLING_ERROR_CODES.PRICE_CREATE_FAILED,
            status: 500,
            message: "Failed to create price"
          }
        }
      }

      this.logger.error("Unexpected error in CreatePriceHandler", {
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
