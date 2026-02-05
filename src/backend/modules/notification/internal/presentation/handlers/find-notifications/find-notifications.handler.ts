import { inject, injectable } from "tsyringe"
import { z } from "zod"
import { AuthAdminUnauthorizedError } from "@/backend/modules/auth-admin/public/errors/auth-admin.errors"
import { NotificationStatus } from "@/backend/modules/notification/internal/domain/notification/notification"
import type {
  FindNotificationsUseCasePort,
  NotificationListItemDto
} from "@/backend/modules/notification/public/ports/find-notifications.usecase.port"
import { FindNotificationsUseCasePortToken } from "@/backend/modules/notification/public/ports/find-notifications.usecase.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { formatZodErrors } from "@/backend/modules/shared/presentation/handlers/utils/format-zod-errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"
import { NOTIFICATION_ERROR_CODES } from "@/shared/errors/notification.errors"

const findNotificationsSchema = z.object({
  status: z.enum(NotificationStatus).optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0)
})

export type FindNotificationsHandlerInput = z.input<
  typeof findNotificationsSchema
>

export type FindNotificationsHandlerResult = Result<{
  notifications: NotificationListItemDto[]
  total: number
}>

export const FindNotificationsHandlerToken = Symbol("FindNotificationsHandler")

export interface FindNotificationsHandler {
  handle(
    input: FindNotificationsHandlerInput
  ): Promise<FindNotificationsHandlerResult>
}

@injectable()
export class FindNotificationsHandlerImpl implements FindNotificationsHandler {
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(FindNotificationsUseCasePortToken)
    private readonly findNotificationsUseCase: FindNotificationsUseCasePort
  ) {}

  async handle(
    input: FindNotificationsHandlerInput
  ): Promise<FindNotificationsHandlerResult> {
    const parsed = findNotificationsSchema.safeParse(input)

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
      const output = await this.findNotificationsUseCase.handle({
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

      this.logger.error("Failed to find notifications", {
        status: parsed.data.status,
        limit: parsed.data.limit,
        offset: parsed.data.offset,
        error: e instanceof Error ? e.message : String(e)
      })

      return {
        ok: false,
        error: {
          code: NOTIFICATION_ERROR_CODES.NOT_FOUND,
          status: 500,
          message: "Failed to find notifications"
        }
      }
    }
  }
}
