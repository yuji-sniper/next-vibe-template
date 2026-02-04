import { inject, injectable } from "tsyringe"
import { AuthUserUnauthorizedError } from "@/backend/modules/auth/public/errors/auth.errors"
import type { SubscriptionStatus } from "@/backend/modules/billing/internal/domain/subscription/subscription"
import type { FindSubscriptionUseCasePort } from "@/backend/modules/billing/public/ports/find-subscription.usecase.port"
import { FindSubscriptionUseCasePortToken } from "@/backend/modules/billing/public/ports/find-subscription.usecase.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { AUTH_ERROR_CODES } from "@/shared/errors/auth.errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

export type FindSubscriptionHandlerInput = {
  includeProduct?: boolean
}

export type FindSubscriptionHandlerResult = Result<{
  subscription:
    | {
        id: string
        customerId: string
        stripeSubscriptionId: string
        stripePriceId: string
        status: SubscriptionStatus
        currentPeriodStart: string | null
        currentPeriodEnd: string | null
        cancelAtPeriodEnd: boolean
        createdAt: string
        updatedAt: string
        product?: {
          id: string
          name: string
          description: string | null
          features: string[] | null
          price: {
            id: string
            stripePriceId: string | null
            unitAmount: number
            currency: string
            type: "one_time" | "recurring"
            recurringInterval: string | null
            displayName: string | null
          }
        }
      }
    | undefined
}>

export const FindSubscriptionHandlerToken = Symbol("FindSubscriptionHandler")

export interface FindSubscriptionHandler {
  handle(
    input?: FindSubscriptionHandlerInput
  ): Promise<FindSubscriptionHandlerResult>
}

@injectable()
export class FindSubscriptionHandlerImpl implements FindSubscriptionHandler {
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(FindSubscriptionUseCasePortToken)
    private readonly findSubscriptionUseCase: FindSubscriptionUseCasePort
  ) {}

  async handle(
    input?: FindSubscriptionHandlerInput
  ): Promise<FindSubscriptionHandlerResult> {
    try {
      const output = await this.findSubscriptionUseCase.handle(input)

      return {
        ok: true,
        data: {
          subscription: output.subscription
            ? {
                id: output.subscription.id,
                customerId: output.subscription.customerId,
                stripeSubscriptionId: output.subscription.stripeSubscriptionId,
                stripePriceId: output.subscription.stripePriceId,
                status: output.subscription.status,
                currentPeriodStart:
                  output.subscription.currentPeriodStart?.toISOString() ?? null,
                currentPeriodEnd:
                  output.subscription.currentPeriodEnd?.toISOString() ?? null,
                cancelAtPeriodEnd: output.subscription.cancelAtPeriodEnd,
                createdAt: output.subscription.createdAt.toISOString(),
                updatedAt: output.subscription.updatedAt.toISOString(),
                product: output.subscription.product
              }
            : undefined
        }
      }
    } catch (e: unknown) {
      if (e instanceof AuthUserUnauthorizedError) {
        return {
          ok: false,
          error: {
            code: AUTH_ERROR_CODES.UNAUTHORIZED,
            status: 401,
            message: "Unauthorized"
          }
        }
      }

      this.logger.error("Unexpected error in FindSubscriptionHandler", {
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
