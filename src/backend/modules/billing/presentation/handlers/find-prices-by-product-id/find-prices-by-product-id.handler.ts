import { z } from "zod"
import { resolveContainer } from "@/backend/bootstrap/container"
import {
  type FindPricesByProductIdUseCasePort,
  FindPricesByProductIdUseCasePortToken
} from "@/backend/modules/billing/application/queries/usecases/find-prices-by-product-id/find-prices-by-product-id.usecase.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { formatZodErrors } from "@/backend/modules/shared/presentation/handlers/utils/format-zod-errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

// Zod スキーマ定義
const findPricesByProductIdSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  activeOnly: z.boolean().optional()
})

type FindPricesByProductIdHandlerInput = z.infer<
  typeof findPricesByProductIdSchema
>

type FindPricesByProductIdHandlerResult = Result<{
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

export const handleFindPricesByProductId = async (
  input: FindPricesByProductIdHandlerInput
): Promise<FindPricesByProductIdHandlerResult> => {
  // 1. バリデーション
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

  // 2. UseCase 実行
  const usecase = await resolveContainer<FindPricesByProductIdUseCasePort>(
    FindPricesByProductIdUseCasePortToken
  )

  try {
    const output = await usecase.handle({
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
