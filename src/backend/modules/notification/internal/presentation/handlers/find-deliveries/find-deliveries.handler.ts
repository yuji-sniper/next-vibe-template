import { inject, injectable } from "tsyringe"
import { z } from "zod"
import { AuthAdminUnauthorizedError } from "@/backend/modules/auth-admin/public/errors/auth-admin.errors"
import { DeliveryStatus } from "@/backend/modules/notification/internal/domain/delivery/delivery"
import type {
  DeliveryListItemDto,
  DeliverySummaryDto,
  FindDeliveriesUseCasePort
} from "@/backend/modules/notification/public/ports/find-deliveries.usecase.port"
import { FindDeliveriesUseCasePortToken } from "@/backend/modules/notification/public/ports/find-deliveries.usecase.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { formatZodErrors } from "@/backend/modules/shared/presentation/handlers/utils/format-zod-errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

const findDeliveriesSchema = z.object({
  notificationId: z.string().min(1),
  status: z.enum(DeliveryStatus).optional(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0)
})

export type FindDeliveriesHandlerInput = z.input<typeof findDeliveriesSchema>

export type FindDeliveriesHandlerResult = Result<{
  deliveries: DeliveryListItemDto[]
  summary: DeliverySummaryDto
}>

export const FindDeliveriesHandlerToken = Symbol("FindDeliveriesHandler")

export interface FindDeliveriesHandler {
  handle(
    input: FindDeliveriesHandlerInput
  ): Promise<FindDeliveriesHandlerResult>
}

@injectable()
export class FindDeliveriesHandlerImpl implements FindDeliveriesHandler {
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(FindDeliveriesUseCasePortToken)
    private readonly findDeliveriesUseCase: FindDeliveriesUseCasePort
  ) {}

  async handle(
    input: FindDeliveriesHandlerInput
  ): Promise<FindDeliveriesHandlerResult> {
    const parsed = findDeliveriesSchema.safeParse(input)

    if (!parsed.success) {
      return {
        ok: false,
        error: {
          code: COMMON_ERROR_CODES.VALIDATION_ERROR,
          status: 422,
          message: "Validation failed",
          fieldErrors: formatZodErrors(parsed.error)
        }
      }
    }

    try {
      const output = await this.findDeliveriesUseCase.handle({
        notificationId: parsed.data.notificationId,
        status: parsed.data.status,
        limit: parsed.data.limit,
        offset: parsed.data.offset
      })

      return {
        ok: true,
        data: output
      }
    } catch (e: unknown) {
      if (e instanceof AuthAdminUnauthorizedError) {
        return {
          ok: false,
          error: {
            code: COMMON_ERROR_CODES.UNAUTHORIZED,
            status: 401,
            message: "Unauthorized"
          }
        }
      }

      this.logger.error("Failed to find deliveries", {
        notificationId: parsed.data.notificationId,
        status: parsed.data.status,
        limit: parsed.data.limit,
        offset: parsed.data.offset,
        error: e instanceof Error ? e.message : String(e)
      })

      return {
        ok: false,
        error: {
          code: COMMON_ERROR_CODES.INTERNAL_SERVER_ERROR,
          status: 500,
          message: "Failed to find deliveries"
        }
      }
    }
  }
}
