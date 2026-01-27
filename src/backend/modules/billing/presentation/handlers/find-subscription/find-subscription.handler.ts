import { resolveContainer } from "@/backend/bootstrap/container"
import {
  type FindSubscriptionUseCasePort,
  FindSubscriptionUseCasePortToken
} from "@/backend/modules/billing/application/queries/usecases/find-subscription/find-subscription.usecase.port"
import type { SubscriptionStatus } from "@/backend/modules/billing/domain/subscription/subscription"
import { UnauthorizedError } from "@/backend/modules/shared/domain/errors/unauthorized.error"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { AUTH_ERROR_CODES } from "@/shared/errors/auth.errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

type FindSubscriptionHandlerResult = Result<{
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
      }
    | undefined
}>

export const handleFindSubscription =
  async (): Promise<FindSubscriptionHandlerResult> => {
    const usecase = await resolveContainer<FindSubscriptionUseCasePort>(
      FindSubscriptionUseCasePortToken
    )

    try {
      const output = await usecase.handle()

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
                updatedAt: output.subscription.updatedAt.toISOString()
              }
            : undefined
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
