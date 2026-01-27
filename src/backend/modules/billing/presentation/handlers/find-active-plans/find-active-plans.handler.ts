import { resolveContainer } from "@/backend/bootstrap/container"
import {
  type FindActivePlansUseCasePort,
  FindActivePlansUseCasePortToken
} from "@/backend/modules/billing/application/queries/usecases/find-active-plans/find-active-plans.usecase.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

type FindActivePlansHandlerResult = Result<{
  plans: {
    product: {
      id: string
      name: string
      description: string | null
      features: string[] | null
      displayOrder: number
    }
    prices: {
      id: string
      stripePriceId: string
      unitAmount: number
      currency: string
      type: "one_time" | "recurring"
      recurringInterval: string | null
      displayName: string | null
    }[]
  }[]
}>

export const handleFindActivePlans =
  async (): Promise<FindActivePlansHandlerResult> => {
    const usecase = await resolveContainer<FindActivePlansUseCasePort>(
      FindActivePlansUseCasePortToken
    )

    try {
      const output = await usecase.handle()

      return {
        ok: true,
        data: {
          plans: output.plans
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
