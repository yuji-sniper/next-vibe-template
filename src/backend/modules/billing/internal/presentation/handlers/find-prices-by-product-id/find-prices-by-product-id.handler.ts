import { inject, injectable } from "tsyringe"
import { z } from "zod"
import type { FindPricesByProductIdUseCasePort } from "@/backend/modules/billing/public/ports/find-prices-by-product-id.usecase.port"
import { FindPricesByProductIdUseCasePortToken } from "@/backend/modules/billing/public/ports/find-prices-by-product-id.usecase.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { formatZodErrors } from "@/backend/modules/shared/presentation/handlers/utils/format-zod-errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

const findPricesByProductIdSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  activeOnly: z.boolean().optional()
})

export type FindPricesByProductIdHandlerInput = z.infer<
  typeof findPricesByProductIdSchema
>

export type FindPricesByProductIdHandlerResult = Result<{
  prices: {
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
  }[]
}>

export const FindPricesByProductIdHandlerToken = Symbol(
  "FindPricesByProductIdHandler"
)

export interface FindPricesByProductIdHandler {
  handle(
    input: FindPricesByProductIdHandlerInput
  ): Promise<FindPricesByProductIdHandlerResult>
}

@injectable()
export class FindPricesByProductIdHandlerImpl
  implements FindPricesByProductIdHandler
{
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(FindPricesByProductIdUseCasePortToken)
    private readonly findPricesByProductIdUseCase: FindPricesByProductIdUseCasePort
  ) {}

  async handle(
    input: FindPricesByProductIdHandlerInput
  ): Promise<FindPricesByProductIdHandlerResult> {
    const parsed = findPricesByProductIdSchema.safeParse(input)

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
      const output = await this.findPricesByProductIdUseCase.handle({
        productId: parsed.data.productId,
        activeOnly: parsed.data.activeOnly
      })

      return {
        ok: true,
        data: {
          prices: output.prices.map((price) => ({
            id: price.id,
            productId: price.productId,
            stripePriceId: price.stripePriceId,
            unitAmount: price.unitAmount,
            currency: price.currency,
            type: price.type,
            recurringInterval: price.recurringInterval,
            recurringIntervalCount: price.recurringIntervalCount,
            displayName: price.displayName,
            active: price.active,
            metadata: price.metadata,
            createdAt: price.createdAt.toISOString(),
            updatedAt: price.updatedAt.toISOString()
          }))
        }
      }
    } catch (e: unknown) {
      this.logger.error("Unexpected error in FindPricesByProductIdHandler", {
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
