import { inject, injectable } from "tsyringe"
import { z } from "zod"
import { AuthAdminUnauthorizedError } from "@/backend/modules/auth-admin/public/errors/auth-admin.errors"
import { AudienceType } from "@/backend/modules/notification/internal/domain/notification/notification"
import {
  NotificationNotFoundError,
  NotificationNotScheduledError
} from "@/backend/modules/notification/public/errors/notification.errors"
import type { UpdateNotificationUseCasePort } from "@/backend/modules/notification/public/ports/update-notification.usecase.port"
import { UpdateNotificationUseCasePortToken } from "@/backend/modules/notification/public/ports/update-notification.usecase.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { formatZodErrors } from "@/backend/modules/shared/presentation/handlers/utils/format-zod-errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"
import { NOTIFICATION_ERROR_CODES } from "@/shared/errors/notification.errors"

const updateNotificationSchema = z.object({
  id: z.string().min(1, "IDは必須です"),
  title: z
    .string()
    .min(1, "タイトルは必須です")
    .max(255, "タイトルは255文字以内で入力してください")
    .optional(),
  subject: z.string().min(1, "件名は必須です").optional(),
  bodyText: z.string().min(1, "本文は必須です").optional(),
  bodyHtml: z.string().nullable().optional(),
  sendAt: z
    .string()
    .or(z.date())
    .transform((val) => (typeof val === "string" ? new Date(val) : val))
    .refine(
      (date) => date > new Date(),
      "送信日時は未来の日時を指定してください"
    )
    .optional(),
  audienceType: z
    .enum(AudienceType, {
      error: "無効な対象タイプです"
    })
    .optional(),
  audiencePayload: z.record(z.string(), z.unknown()).optional()
})

export type UpdateNotificationHandlerInput = z.input<
  typeof updateNotificationSchema
>

export type UpdateNotificationHandlerResult = Result<{
  notification: {
    id: string
    title: string
    subject: string
    sendAt: Date
    audienceType: number
    status: number
  }
}>

export const UpdateNotificationHandlerToken = Symbol(
  "UpdateNotificationHandler"
)

export interface UpdateNotificationHandler {
  handle(
    input: UpdateNotificationHandlerInput
  ): Promise<UpdateNotificationHandlerResult>
}

@injectable()
export class UpdateNotificationHandlerImpl
  implements UpdateNotificationHandler
{
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(UpdateNotificationUseCasePortToken)
    private readonly updateNotificationUseCase: UpdateNotificationUseCasePort
  ) {}

  async handle(
    input: UpdateNotificationHandlerInput
  ): Promise<UpdateNotificationHandlerResult> {
    const parsed = updateNotificationSchema.safeParse(input)

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
      const output = await this.updateNotificationUseCase.handle({
        id: parsed.data.id,
        title: parsed.data.title,
        subject: parsed.data.subject,
        bodyText: parsed.data.bodyText,
        bodyHtml: parsed.data.bodyHtml,
        sendAt: parsed.data.sendAt,
        audienceType: parsed.data.audienceType,
        audiencePayload: parsed.data.audiencePayload
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

      if (e instanceof NotificationNotScheduledError) {
        return {
          ok: false,
          error: {
            code: NOTIFICATION_ERROR_CODES.NOT_SCHEDULED,
            status: 400,
            message: "Notification is not in scheduled status"
          }
        }
      }

      this.logger.error("Failed to update notification", {
        id: parsed.data.id,
        error: e instanceof Error ? e.message : String(e)
      })

      return {
        ok: false,
        error: {
          code: NOTIFICATION_ERROR_CODES.UPDATE_FAILED,
          status: 500,
          message: "Failed to update notification"
        }
      }
    }
  }
}
