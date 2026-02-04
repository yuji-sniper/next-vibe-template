import { inject, injectable } from "tsyringe"
import { AuthUserUnauthorizedError } from "@/backend/modules/auth/public/errors/auth.errors"
import type { FindPaymentHistoryUseCasePort } from "@/backend/modules/billing/public/ports/find-payment-history.usecase.port"
import { FindPaymentHistoryUseCasePortToken } from "@/backend/modules/billing/public/ports/find-payment-history.usecase.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
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

export type FindPaymentHistoryHandlerResult = Result<{
  payments: PaymentHistoryItem[]
}>

export const FindPaymentHistoryHandlerToken = Symbol(
  "FindPaymentHistoryHandler"
)

export interface FindPaymentHistoryHandler {
  handle(): Promise<FindPaymentHistoryHandlerResult>
}

@injectable()
export class FindPaymentHistoryHandlerImpl
  implements FindPaymentHistoryHandler
{
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(FindPaymentHistoryUseCasePortToken)
    private readonly findPaymentHistoryUseCase: FindPaymentHistoryUseCasePort
  ) {}

  async handle(): Promise<FindPaymentHistoryHandlerResult> {
    try {
      const output = await this.findPaymentHistoryUseCase.handle()

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

      this.logger.error("Unexpected error in FindPaymentHistoryHandler", {
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
