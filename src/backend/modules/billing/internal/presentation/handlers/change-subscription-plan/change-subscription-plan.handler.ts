import { inject, injectable } from "tsyringe"
import { AuthUserUnauthorizedError } from "@/backend/modules/auth/public/errors/auth.errors"
import { CustomerNotFoundError } from "@/backend/modules/billing/public/errors/customer.errors"
import { PriceNotFoundError } from "@/backend/modules/billing/public/errors/price.errors"
import {
  SubscriptionNotFoundError,
  SubscriptionUpdateFailedError
} from "@/backend/modules/billing/public/errors/subscription.errors"
import type { ChangeSubscriptionPlanUseCasePort } from "@/backend/modules/billing/public/ports/change-subscription-plan.usecase.port"
import { ChangeSubscriptionPlanUseCasePortToken } from "@/backend/modules/billing/public/ports/change-subscription-plan.usecase.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { AUTH_ERROR_CODES } from "@/shared/errors/auth.errors"
import { BILLING_ERROR_CODES } from "@/shared/errors/billing.errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

export type ChangeSubscriptionPlanHandlerInput = {
  newPriceId: string
}

export type ChangeSubscriptionPlanHandlerResult = Result<{
  subscriptionId: string
  stripePriceId: string
}>

export const ChangeSubscriptionPlanHandlerToken = Symbol(
  "ChangeSubscriptionPlanHandler"
)

export interface ChangeSubscriptionPlanHandler {
  handle(
    input: ChangeSubscriptionPlanHandlerInput
  ): Promise<ChangeSubscriptionPlanHandlerResult>
}

@injectable()
export class ChangeSubscriptionPlanHandlerImpl
  implements ChangeSubscriptionPlanHandler
{
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(ChangeSubscriptionPlanUseCasePortToken)
    private readonly changeSubscriptionPlanUseCase: ChangeSubscriptionPlanUseCasePort
  ) {}

  async handle(
    input: ChangeSubscriptionPlanHandlerInput
  ): Promise<ChangeSubscriptionPlanHandlerResult> {
    try {
      const output = await this.changeSubscriptionPlanUseCase.handle({
        newPriceId: input.newPriceId
      })

      return {
        ok: true,
        data: {
          subscriptionId: output.subscriptionId,
          stripePriceId: output.stripePriceId
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

      if (e instanceof CustomerNotFoundError) {
        return {
          ok: false,
          error: {
            code: BILLING_ERROR_CODES.CUSTOMER_NOT_FOUND,
            status: 404,
            message: "Customer not found"
          }
        }
      }

      if (e instanceof SubscriptionNotFoundError) {
        return {
          ok: false,
          error: {
            code: BILLING_ERROR_CODES.SUBSCRIPTION_NOT_FOUND,
            status: 404,
            message: "Subscription not found"
          }
        }
      }

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

      if (e instanceof SubscriptionUpdateFailedError) {
        this.logger.error("Failed to update subscription plan", {
          newPriceId: input.newPriceId,
          error: e instanceof Error ? e.message : String(e)
        })
        return {
          ok: false,
          error: {
            code: BILLING_ERROR_CODES.SUBSCRIPTION_UPDATE_FAILED,
            status: 500,
            message: "Failed to update subscription plan"
          }
        }
      }

      this.logger.error("Unexpected error in ChangeSubscriptionPlanHandler", {
        newPriceId: input.newPriceId,
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
