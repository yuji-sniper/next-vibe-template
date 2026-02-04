import { inject, injectable } from "tsyringe"
import type {
  FindActivePlansUseCaseInput,
  FindActivePlansUseCasePort
} from "@/backend/modules/billing/public/ports/find-active-plans.usecase.port"
import { FindActivePlansUseCasePortToken } from "@/backend/modules/billing/public/ports/find-active-plans.usecase.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

export type FindActivePlansHandlerResult = Result<{
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

export const FindActivePlansHandlerToken = Symbol("FindActivePlansHandler")

export interface FindActivePlansHandler {
  handle(
    input?: FindActivePlansUseCaseInput
  ): Promise<FindActivePlansHandlerResult>
}

@injectable()
export class FindActivePlansHandlerImpl implements FindActivePlansHandler {
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(FindActivePlansUseCasePortToken)
    private readonly findActivePlansUseCase: FindActivePlansUseCasePort
  ) {}

  async handle(
    input?: FindActivePlansUseCaseInput
  ): Promise<FindActivePlansHandlerResult> {
    try {
      const output = await this.findActivePlansUseCase.handle(input)

      return {
        ok: true,
        data: {
          plans: output.plans
        }
      }
    } catch (e: unknown) {
      this.logger.error("Unexpected error in FindActivePlansHandler", {
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
