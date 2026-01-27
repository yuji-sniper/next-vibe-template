import { resolveContainer } from "@/backend/bootstrap/container"
import {
  type CreateSubscriptionCheckoutSessionUseCasePort,
  CreateSubscriptionCheckoutSessionUseCasePortToken
} from "@/backend/modules/billing/application/commands/usecases/create-subscription-checkout-session/create-subscription-checkout-session.usecase.port"
import { CustomerCreateFailedError } from "@/backend/modules/billing/domain/customer/customer.errors"
import { SubscriptionCheckoutSessionFailedError } from "@/backend/modules/billing/domain/subscription/subscription.errors"
import { UnauthorizedError } from "@/backend/modules/shared/domain/errors/unauthorized.error"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { AUTH_ERROR_CODES } from "@/shared/errors/auth.errors"
import { BILLING_ERROR_CODES } from "@/shared/errors/billing.errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

type CreateSubscriptionCheckoutSessionHandlerInput = {
  priceId: string
  successUrl: string
  cancelUrl: string
}

type CreateSubscriptionCheckoutSessionHandlerResult = Result<{
  sessionUrl: string
}>

export const handleCreateSubscriptionCheckoutSession = async (
  input: CreateSubscriptionCheckoutSessionHandlerInput
): Promise<CreateSubscriptionCheckoutSessionHandlerResult> => {
  const usecase =
    await resolveContainer<CreateSubscriptionCheckoutSessionUseCasePort>(
      CreateSubscriptionCheckoutSessionUseCasePortToken
    )

  try {
    const output = await usecase.handle({
      priceId: input.priceId,
      successUrl: input.successUrl,
      cancelUrl: input.cancelUrl
    })

    return {
      ok: true,
      data: { sessionUrl: output.sessionUrl }
    }
  } catch (e: unknown) {
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

    if (e instanceof CustomerCreateFailedError) {
      return {
        ok: false,
        error: {
          code: BILLING_ERROR_CODES.CUSTOMER_CREATE_FAILED,
          status: 500,
          message: "Failed to create customer"
        }
      }
    }

    if (e instanceof SubscriptionCheckoutSessionFailedError) {
      return {
        ok: false,
        error: {
          code: BILLING_ERROR_CODES.SUBSCRIPTION_CHECKOUT_SESSION_FAILED,
          status: 500,
          message: "Failed to create subscription checkout session"
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
