import { inject, injectable } from "tsyringe"
import { z } from "zod"
import { AuthAdminUnauthorizedError } from "@/backend/modules/auth-admin/public/errors/auth-admin.errors"
import {
  NotificationAlreadyCancelledError,
  NotificationAlreadyCompletedError,
  NotificationNotFoundError
} from "@/backend/modules/notification/public/errors/notification.errors"
import type { CancelNotificationUseCasePort } from "@/backend/modules/notification/public/ports/cancel-notification.usecase.port"
import { CancelNotificationUseCasePortToken } from "@/backend/modules/notification/public/ports/cancel-notification.usecase.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { formatZodErrors } from "@/backend/modules/shared/presentation/handlers/utils/format-zod-errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"
import { NOTIFICATION_ERROR_CODES } from "@/shared/errors/notification.errors"

const cancelNotificationSchema = z.object({
  id: z.string().min(1, "IDは必須です")
})

export type CancelNotificationHandlerInput = z.input<
  typeof cancelNotificationSchema
>

export type CancelNotificationHandlerResult = Result<{
  notification: {
    id: string
    title: string
    status: number
  }
}>

export const CancelNotificationHandlerToken = Symbol(
  "CancelNotificationHandler"
)

export interface CancelNotificationHandler {
  handle(
    input: CancelNotificationHandlerInput
  ): Promise<CancelNotificationHandlerResult>
}

@injectable()
export class CancelNotificationHandlerImpl
  implements CancelNotificationHandler
{
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(CancelNotificationUseCasePortToken)
    private readonly cancelNotificationUseCase: CancelNotificationUseCasePort
  ) {}

  async handle(
    input: CancelNotificationHandlerInput
  ): Promise<CancelNotificationHandlerResult> {
    const parsed = cancelNotificationSchema.safeParse(input)

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
      const output = await this.cancelNotificationUseCase.handle({
        id: parsed.data.id
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

      if (e instanceof NotificationNotFoundError) {
        return {
          ok: false,
          error: {
            code: NOTIFICATION_ERROR_CODES.NOT_FOUND,
            status: 404,
            message: "Notification not found"
          }
        }
      }

      if (e instanceof NotificationAlreadyCancelledError) {
        return {
          ok: false,
          error: {
            code: NOTIFICATION_ERROR_CODES.ALREADY_CANCELLED,
            status: 400,
            message: "Notification is already cancelled"
          }
        }
      }

      if (e instanceof NotificationAlreadyCompletedError) {
        return {
          ok: false,
          error: {
            code: NOTIFICATION_ERROR_CODES.ALREADY_COMPLETED,
            status: 400,
            message: "Notification is already completed"
          }
        }
      }

      this.logger.error("Failed to cancel notification", {
        id: parsed.data.id,
        error: e instanceof Error ? e.message : String(e)
      })

      return {
        ok: false,
        error: {
          code: NOTIFICATION_ERROR_CODES.CANCEL_FAILED,
          status: 500,
          message: "Failed to cancel notification"
        }
      }
    }
  }
}
