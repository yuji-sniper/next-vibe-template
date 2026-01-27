import { z } from "zod"
import { resolveContainer } from "@/backend/bootstrap/container"
import {
  type FindPriceByIdUseCasePort,
  FindPriceByIdUseCasePortToken
} from "@/backend/modules/billing/application/queries/usecases/find-price-by-id/find-price-by-id.usecase.port"
import { PriceNotFoundError } from "@/backend/modules/billing/domain/price/price.errors"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { formatZodErrors } from "@/backend/modules/shared/presentation/handlers/utils/format-zod-errors"
import { BILLING_ERROR_CODES } from "@/shared/errors/billing.errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

const findPriceByIdSchema = z.object({
  priceId: z.string().min(1, "Price ID is required")
})

type FindPriceByIdHandlerInput = z.infer<typeof findPriceByIdSchema>

type FindPriceByIdHandlerResult = Result<{
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

export const handleFindPriceById = async (
  input: FindPriceByIdHandlerInput
): Promise<FindPriceByIdHandlerResult> => {
  // 1. バリデーション
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

  // 2. UseCase 実行
  const usecase = await resolveContainer<FindPriceByIdUseCasePort>(
    FindPriceByIdUseCasePortToken
  )

  try {
    const output = await usecase.handle({
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
    console.error(e)

    // 3. Domain Error を Result 型に変換
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
