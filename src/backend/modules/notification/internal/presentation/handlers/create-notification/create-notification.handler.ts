import { inject, injectable } from "tsyringe"
import { z } from "zod"
import { AuthAdminUnauthorizedError } from "@/backend/modules/auth-admin/public/errors/auth-admin.errors"
import { AudienceType } from "@/backend/modules/notification/internal/domain/notification/notification"
import type { CreateNotificationUseCasePort } from "@/backend/modules/notification/public/ports/create-notification.usecase.port"
import { CreateNotificationUseCasePortToken } from "@/backend/modules/notification/public/ports/create-notification.usecase.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { formatZodErrors } from "@/backend/modules/shared/presentation/handlers/utils/format-zod-errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"
import { NOTIFICATION_ERROR_CODES } from "@/shared/errors/notification.errors"

const createNotificationSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルは必須です")
    .max(255, "タイトルは255文字以内で入力してください"),
  subject: z.string().min(1, "件名は必須です"),
  bodyText: z.string().min(1, "本文は必須です"),
  bodyHtml: z.string().optional(),
  sendAt: z
    .string()
    .or(z.date())
    .transform((val) => (typeof val === "string" ? new Date(val) : val))
    .refine(
      (date) => date > new Date(),
      "送信日時は未来の日時を指定してください"
    ),
  audienceType: z.enum(AudienceType, {
    error: "無効な対象タイプです"
  }),
  audiencePayload: z.record(z.string(), z.unknown()).optional()
})

export type CreateNotificationHandlerInput = z.input<
  typeof createNotificationSchema
>

export type CreateNotificationHandlerResult = Result<{
  notification: {
    id: string
    title: string
    subject: string
    sendAt: Date
    audienceType: number
    status: number
  }
}>

export const CreateNotificationHandlerToken = Symbol(
  "CreateNotificationHandler"
)

export interface CreateNotificationHandler {
  handle(
    input: CreateNotificationHandlerInput
  ): Promise<CreateNotificationHandlerResult>
}

@injectable()
export class CreateNotificationHandlerImpl
  implements CreateNotificationHandler
{
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(CreateNotificationUseCasePortToken)
    private readonly createNotificationUseCase: CreateNotificationUseCasePort
  ) {}

  async handle(
    input: CreateNotificationHandlerInput
  ): Promise<CreateNotificationHandlerResult> {
    const parsed = createNotificationSchema.safeParse(input)

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
      const output = await this.createNotificationUseCase.handle({
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

      this.logger.error("Failed to create notification", {
        title: parsed.data.title,
        sendAt: parsed.data.sendAt.toISOString(),
        audienceType: parsed.data.audienceType,
        error: e instanceof Error ? e.message : String(e)
      })

      return {
        ok: false,
        error: {
          code: NOTIFICATION_ERROR_CODES.CREATE_FAILED,
          status: 500,
          message: "Failed to create notification"
        }
      }
    }
  }
}
