import { resolveContainer } from "@/backend/bootstrap/container"
import {
  type FindProductsUseCasePort,
  FindProductsUseCasePortToken
} from "@/backend/modules/billing/application/queries/usecases/find-products/find-products.usecase.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

type FindProductsHandlerInput = {
  activeOnly?: boolean
  includePrices?: boolean
}

type FindProductsHandlerResult = Result<{
  products: {
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

export const handleFindProducts = async (
  input: FindProductsHandlerInput
): Promise<FindProductsHandlerResult> => {
  const usecase = await resolveContainer<FindProductsUseCasePort>(
    FindProductsUseCasePortToken
  )

  try {
    const output = await usecase.handle({
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
          createdAt: product.createdAt.toISOString(),
          updatedAt: product.updatedAt.toISOString(),
          prices: product.prices
        }))
      }
    }
  } catch (e: unknown) {
    console.error(e)

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
