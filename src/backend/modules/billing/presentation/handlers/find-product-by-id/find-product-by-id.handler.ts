import { z } from "zod"
import { resolveContainer } from "@/backend/bootstrap/container"
import type { FindProductByIdUseCasePort } from "@/backend/modules/billing/application/queries/usecases/find-product-by-id/find-product-by-id.usecase.port"
import { FindProductByIdUseCasePortToken } from "@/backend/modules/billing/application/queries/usecases/find-product-by-id/find-product-by-id.usecase.port"
import { ProductNotFoundError } from "@/backend/modules/billing/domain/product/product.errors"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { formatZodErrors } from "@/backend/modules/shared/presentation/handlers/utils/format-zod-errors"
import { BILLING_ERROR_CODES } from "@/shared/errors/billing.errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

// Zod スキーマ定義
const findProductByIdSchema = z.object({
  productId: z.string().min(1, "Product ID is required")
})

type FindProductByIdHandlerInput = z.infer<typeof findProductByIdSchema>

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

type FindProductByIdHandlerResult = Result<{
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

export const handleFindProductById = async (
  input: FindProductByIdHandlerInput
): Promise<FindProductByIdHandlerResult> => {
  // 1. バリデーション
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

  // 2. UseCase 実行
  const usecase = await resolveContainer<FindProductByIdUseCasePort>(
    FindProductByIdUseCasePortToken
  )

  try {
    const output = await usecase.handle({
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
    // 3. Domain Error を Result 型に変換
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
