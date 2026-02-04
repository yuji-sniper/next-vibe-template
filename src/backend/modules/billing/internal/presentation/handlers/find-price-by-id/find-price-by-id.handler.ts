import { inject, injectable } from "tsyringe"
import { z } from "zod"
import { PriceNotFoundError } from "@/backend/modules/billing/public/errors/price.errors"
import type { FindPriceByIdUseCasePort } from "@/backend/modules/billing/public/ports/find-price-by-id.usecase.port"
import { FindPriceByIdUseCasePortToken } from "@/backend/modules/billing/public/ports/find-price-by-id.usecase.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { formatZodErrors } from "@/backend/modules/shared/presentation/handlers/utils/format-zod-errors"
import { BILLING_ERROR_CODES } from "@/shared/errors/billing.errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

const findPriceByIdSchema = z.object({
  priceId: z.string().min(1, "Price ID is required")
})

export type FindPriceByIdHandlerInput = z.infer<typeof findPriceByIdSchema>

export type FindPriceByIdHandlerResult = Result<{
  price: {
    id: string
    productId: string
    stripePriceId: string | null
    unitAmount: number
    currency: string
    type: "one_time" | "recurring"
    recurringInterval: string | null
    recurringIntervalCount: number
    displayName: string | null
    active: boolean
    metadata: Record<string, string> | null
    createdAt: string
    updatedAt: string
  }
}>

export const FindPriceByIdHandlerToken = Symbol("FindPriceByIdHandler")

export interface FindPriceByIdHandler {
  handle(input: FindPriceByIdHandlerInput): Promise<FindPriceByIdHandlerResult>
}

@injectable()
export class FindPriceByIdHandlerImpl implements FindPriceByIdHandler {
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(FindPriceByIdUseCasePortToken)
    private readonly findPriceByIdUseCase: FindPriceByIdUseCasePort
  ) {}

  async handle(
    input: FindPriceByIdHandlerInput
  ): Promise<FindPriceByIdHandlerResult> {
    const parsed = findPriceByIdSchema.safeParse(input)

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
      const output = await this.findPriceByIdUseCase.handle({
        priceId: parsed.data.priceId
      })

      return {
        ok: true,
        data: {
          price: {
            id: output.price.id,
            productId: output.price.productId,
            stripePriceId: output.price.stripePriceId,
            unitAmount: output.price.unitAmount,
            currency: output.price.currency,
            type: output.price.type,
            recurringInterval: output.price.recurringInterval,
            recurringIntervalCount: output.price.recurringIntervalCount,
            displayName: output.price.displayName,
            active: output.price.active,
            metadata: output.price.metadata,
            createdAt: output.price.createdAt.toISOString(),
            updatedAt: output.price.updatedAt.toISOString()
          }
        }
      }
    } catch (e: unknown) {
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

      this.logger.error("Unexpected error in FindPriceByIdHandler", {
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
