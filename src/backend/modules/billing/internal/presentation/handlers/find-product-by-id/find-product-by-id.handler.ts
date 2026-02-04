import { inject, injectable } from "tsyringe"
import { z } from "zod"
import { ProductNotFoundError } from "@/backend/modules/billing/public/errors/product.errors"
import type { FindProductByIdUseCasePort } from "@/backend/modules/billing/public/ports/find-product-by-id.usecase.port"
import { FindProductByIdUseCasePortToken } from "@/backend/modules/billing/public/ports/find-product-by-id.usecase.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { formatZodErrors } from "@/backend/modules/shared/presentation/handlers/utils/format-zod-errors"
import { BILLING_ERROR_CODES } from "@/shared/errors/billing.errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

const findProductByIdSchema = z.object({
  productId: z.string().min(1, "Product ID is required")
})

export type FindProductByIdHandlerInput = z.infer<typeof findProductByIdSchema>

type PriceDetailResult = {
  id: string
  productId: string
  stripePriceId: string | null
  currency: string
  unitAmount: number
  recurringInterval: "month" | "year" | null
  recurringIntervalCount: number
  type: "one_time" | "recurring"
  active: boolean
  metadata: Record<string, string> | null
  displayName: string | null
  createdAt: string
  updatedAt: string
}

export type FindProductByIdHandlerResult = Result<{
  product: {
    id: string
    stripeProductId: string | null
    name: string
    description: string | null
    active: boolean
    displayOrder: number
    features: string[] | null
    metadata: Record<string, string> | null
    createdAt: string
    updatedAt: string
    prices: PriceDetailResult[]
  }
}>

export const FindProductByIdHandlerToken = Symbol("FindProductByIdHandler")

export interface FindProductByIdHandler {
  handle(
    input: FindProductByIdHandlerInput
  ): Promise<FindProductByIdHandlerResult>
}

@injectable()
export class FindProductByIdHandlerImpl implements FindProductByIdHandler {
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(FindProductByIdUseCasePortToken)
    private readonly findProductByIdUseCase: FindProductByIdUseCasePort
  ) {}

  async handle(
    input: FindProductByIdHandlerInput
  ): Promise<FindProductByIdHandlerResult> {
    const parsed = findProductByIdSchema.safeParse(input)

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
      const output = await this.findProductByIdUseCase.handle({
        productId: parsed.data.productId
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
            displayOrder: output.product.displayOrder,
            features: output.product.features,
            metadata: output.product.metadata,
            createdAt: output.product.createdAt.toISOString(),
            updatedAt: output.product.updatedAt.toISOString(),
            prices: output.product.prices.map((price) => ({
              id: price.id,
              productId: price.productId,
              stripePriceId: price.stripePriceId,
              currency: price.currency,
              unitAmount: price.unitAmount,
              recurringInterval: price.recurringInterval,
              recurringIntervalCount: price.recurringIntervalCount,
              type: price.type,
              active: price.active,
              metadata: price.metadata,
              displayName: price.displayName,
              createdAt: price.createdAt.toISOString(),
              updatedAt: price.updatedAt.toISOString()
            }))
          }
        }
      }
    } catch (e: unknown) {
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

      this.logger.error("Unexpected error in FindProductByIdHandler", {
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
