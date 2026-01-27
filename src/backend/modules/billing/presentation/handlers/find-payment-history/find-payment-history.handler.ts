import { resolveContainer } from "@/backend/bootstrap/container"
import {
  type FindPaymentHistoryUseCasePort,
  FindPaymentHistoryUseCasePortToken
} from "@/backend/modules/billing/application/queries/usecases/find-payment-history/find-payment-history.usecase.port"
import { UnauthorizedError } from "@/backend/modules/shared/domain/errors/unauthorized.error"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { AUTH_ERROR_CODES } from "@/shared/errors/auth.errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

type PaymentHistoryItem = {
  id: string
  amount: number
  currency: string
  status: string
  createdAt: string
}

type FindPaymentHistoryHandlerResult = Result<{
  payments: PaymentHistoryItem[]
}>

export const handleFindPaymentHistory =
  async (): Promise<FindPaymentHistoryHandlerResult> => {
    const usecase = await resolveContainer<FindPaymentHistoryUseCasePort>(
      FindPaymentHistoryUseCasePortToken
    )

    try {
      const output = await usecase.handle()

      return {
        ok: true,
        data: {
          payments: output.payments.map((payment) => ({
            id: payment.id,
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status,
            createdAt: payment.createdAt.toISOString()
          }))
        }
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
