import { inject, injectable } from "tsyringe"
import { AuthUserUnauthorizedError } from "@/backend/modules/auth/public/errors/auth.errors"
import { CustomerNotFoundError } from "@/backend/modules/billing/public/errors/customer.errors"
import {
  SubscriptionCancelFailedError,
  SubscriptionNotFoundError
} from "@/backend/modules/billing/public/errors/subscription.errors"
import type { CancelSubscriptionUseCasePort } from "@/backend/modules/billing/public/ports/cancel-subscription.usecase.port"
import { CancelSubscriptionUseCasePortToken } from "@/backend/modules/billing/public/ports/cancel-subscription.usecase.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { AUTH_ERROR_CODES } from "@/shared/errors/auth.errors"
import { BILLING_ERROR_CODES } from "@/shared/errors/billing.errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

export type CancelSubscriptionHandlerInput = {
  cancelAtPeriodEnd?: boolean
}

export type CancelSubscriptionHandlerResult = Result<{
  subscriptionId: string
  cancelAtPeriodEnd: boolean
  currentPeriodEnd: string | null
}>

export const CancelSubscriptionHandlerToken = Symbol(
  "CancelSubscriptionHandler"
)

export interface CancelSubscriptionHandler {
  handle(
    input?: CancelSubscriptionHandlerInput
  ): Promise<CancelSubscriptionHandlerResult>
}

@injectable()
export class CancelSubscriptionHandlerImpl
  implements CancelSubscriptionHandler
{
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(CancelSubscriptionUseCasePortToken)
    private readonly cancelSubscriptionUseCase: CancelSubscriptionUseCasePort
  ) {}

  async handle(
    input?: CancelSubscriptionHandlerInput
  ): Promise<CancelSubscriptionHandlerResult> {
    try {
      const output = await this.cancelSubscriptionUseCase.handle({
        cancelAtPeriodEnd: input?.cancelAtPeriodEnd
      })

      return {
        ok: true,
        data: {
          subscriptionId: output.subscriptionId,
          cancelAtPeriodEnd: output.cancelAtPeriodEnd,
          currentPeriodEnd: output.currentPeriodEnd?.toISOString() ?? null
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

      if (e instanceof SubscriptionCancelFailedError) {
        this.logger.error("Failed to cancel subscription", {
          error: e instanceof Error ? e.message : String(e)
        })
        return {
          ok: false,
          error: {
            code: BILLING_ERROR_CODES.SUBSCRIPTION_CANCEL_FAILED,
            status: 500,
            message: "Failed to cancel subscription"
          }
        }
      }

      this.logger.error("Unexpected error in CancelSubscriptionHandler", {
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
