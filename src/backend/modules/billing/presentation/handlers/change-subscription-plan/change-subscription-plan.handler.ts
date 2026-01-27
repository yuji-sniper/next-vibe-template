import { resolveContainer } from "@/backend/bootstrap/container"
import {
  type ChangeSubscriptionPlanUseCasePort,
  ChangeSubscriptionPlanUseCasePortToken
} from "@/backend/modules/billing/application/commands/usecases/change-subscription-plan/change-subscription-plan.usecase.port"
import { CustomerNotFoundError } from "@/backend/modules/billing/domain/customer/customer.errors"
import {
  SubscriptionNotFoundError,
  SubscriptionUpdateFailedError
} from "@/backend/modules/billing/domain/subscription/subscription.errors"
import { UnauthorizedError } from "@/backend/modules/shared/domain/errors/unauthorized.error"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { AUTH_ERROR_CODES } from "@/shared/errors/auth.errors"
import { BILLING_ERROR_CODES } from "@/shared/errors/billing.errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

type ChangeSubscriptionPlanHandlerInput = {
  newPriceId: string
}

type ChangeSubscriptionPlanHandlerResult = Result<{
  subscriptionId: string
  stripePriceId: string
}>

export const handleChangeSubscriptionPlan = async (
  input: ChangeSubscriptionPlanHandlerInput
): Promise<ChangeSubscriptionPlanHandlerResult> => {
  const usecase = await resolveContainer<ChangeSubscriptionPlanUseCasePort>(
    ChangeSubscriptionPlanUseCasePortToken
  )

  try {
    const output = await usecase.handle({
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
    console.error(e)

    if (e instanceof UnauthorizedError) {
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

    if (e instanceof SubscriptionUpdateFailedError) {
      return {
        ok: false,
        error: {
          code: BILLING_ERROR_CODES.SUBSCRIPTION_UPDATE_FAILED,
          status: 500,
          message: "Failed to update subscription plan"
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
