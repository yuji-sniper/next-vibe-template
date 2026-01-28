import { resolveContainer } from "@/backend/bootstrap/container"
import {
  type CreateCheckoutSessionUseCasePort,
  CreateCheckoutSessionUseCasePortToken
} from "@/backend/modules/billing/application/commands/usecases/create-checkout-session/create-checkout-session.usecase.port"
import { CheckoutSessionFailedError } from "@/backend/modules/billing/domain/checkout-session/checkout-session.errors"
import { CustomerCreateFailedError } from "@/backend/modules/billing/domain/customer/customer.errors"
import { PriceNotFoundError } from "@/backend/modules/billing/domain/price/price.errors"
import { UnauthorizedError } from "@/backend/modules/shared/domain/errors/unauthorized.error"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { AUTH_ERROR_CODES } from "@/shared/errors/auth.errors"
import { BILLING_ERROR_CODES } from "@/shared/errors/billing.errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

type CreateCheckoutSessionHandlerInput = {
  priceId: string
  successUrl: string
  cancelUrl: string
}

type CreateCheckoutSessionHandlerResult = Result<{
  sessionUrl: string
}>

export const handleCreateCheckoutSession = async (
  input: CreateCheckoutSessionHandlerInput
): Promise<CreateCheckoutSessionHandlerResult> => {
  const usecase = await resolveContainer<CreateCheckoutSessionUseCasePort>(
    CreateCheckoutSessionUseCasePortToken
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

    if (e instanceof CheckoutSessionFailedError) {
      return {
        ok: false,
        error: {
          code: BILLING_ERROR_CODES.CHECKOUT_SESSION_FAILED,
          status: 500,
          message: "Failed to create checkout session"
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
