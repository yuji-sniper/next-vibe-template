import { inject, injectable } from "tsyringe"
import type { FindProductsUseCasePort } from "@/backend/modules/billing/public/ports/find-products.usecase.port"
import { FindProductsUseCasePortToken } from "@/backend/modules/billing/public/ports/find-products.usecase.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

export type FindProductsHandlerInput = {
  activeOnly?: boolean
  includePrices?: boolean
}

export type FindProductsHandlerResult = Result<{
  products: {
    id: string
    stripeProductId: string | null
    name: string
    description: string | null
    active: boolean
    displayOrder: number
    features: string[] | null
    metadata: Record<string, string> | null
    priceCount: number
    createdAt: string
    updatedAt: string
    prices?: {
      id: string
      stripePriceId: string | null
      unitAmount: number
      currency: string
      type: "one_time" | "recurring"
      recurringInterval: string | null
      displayName: string | null
      active: boolean
    }[]
  }[]
}>

export const FindProductsHandlerToken = Symbol("FindProductsHandler")

export interface FindProductsHandler {
  handle(input: FindProductsHandlerInput): Promise<FindProductsHandlerResult>
}

@injectable()
export class FindProductsHandlerImpl implements FindProductsHandler {
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(FindProductsUseCasePortToken)
    private readonly findProductsUseCase: FindProductsUseCasePort
  ) {}

  async handle(
    input: FindProductsHandlerInput
  ): Promise<FindProductsHandlerResult> {
    try {
      const output = await this.findProductsUseCase.handle({
        activeOnly: input.activeOnly,
        includePrices: input.includePrices
      })

      return {
        ok: true,
        data: {
          products: output.products.map((product) => ({
            id: product.id,
            stripeProductId: product.stripeProductId,
            name: product.name,
            description: product.description,
            active: product.active,
            displayOrder: product.displayOrder,
            features: product.features,
            metadata: product.metadata,
            priceCount: product.priceCount,
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString(),
            prices: product.prices
          }))
        }
      }
    } catch (e: unknown) {
      this.logger.error("Unexpected error in FindProductsHandler", {
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
