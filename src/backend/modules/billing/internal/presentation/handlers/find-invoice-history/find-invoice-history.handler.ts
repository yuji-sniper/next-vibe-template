import { inject, injectable } from "tsyringe"
import { AuthUserUnauthorizedError } from "@/backend/modules/auth/public/errors/auth.errors"
import type { FindInvoiceHistoryUseCasePort } from "@/backend/modules/billing/public/ports/find-invoice-history.usecase.port"
import { FindInvoiceHistoryUseCasePortToken } from "@/backend/modules/billing/public/ports/find-invoice-history.usecase.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { AUTH_ERROR_CODES } from "@/shared/errors/auth.errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

type InvoiceHistoryItem = {
  id: string
  amount: number
  currency: string
  status: string
  paidAt: string | null
  createdAt: string
}

export type FindInvoiceHistoryHandlerResult = Result<{
  invoices: InvoiceHistoryItem[]
}>

export const FindInvoiceHistoryHandlerToken = Symbol(
  "FindInvoiceHistoryHandler"
)

export interface FindInvoiceHistoryHandler {
  handle(): Promise<FindInvoiceHistoryHandlerResult>
}

@injectable()
export class FindInvoiceHistoryHandlerImpl
  implements FindInvoiceHistoryHandler
{
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(FindInvoiceHistoryUseCasePortToken)
    private readonly findInvoiceHistoryUseCase: FindInvoiceHistoryUseCasePort
  ) {}

  async handle(): Promise<FindInvoiceHistoryHandlerResult> {
    try {
      const output = await this.findInvoiceHistoryUseCase.handle()

      return {
        ok: true,
        data: {
          invoices: output.invoices.map((invoice) => ({
            id: invoice.id,
            amount: invoice.amount,
            currency: invoice.currency,
            status: invoice.status,
            paidAt: invoice.paidAt?.toISOString() ?? null,
            createdAt: invoice.createdAt.toISOString()
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

      this.logger.error("Unexpected error in FindInvoiceHistoryHandler", {
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
