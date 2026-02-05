import { inject, injectable } from "tsyringe"
import { z } from "zod"
import { AuthAdminUnauthorizedError } from "@/backend/modules/auth-admin/public/errors/auth-admin.errors"
import { NotificationNotFoundError } from "@/backend/modules/notification/public/errors/notification.errors"
import type {
  FindNotificationByIdUseCasePort,
  NotificationDetailDto
} from "@/backend/modules/notification/public/ports/find-notification-by-id.usecase.port"
import { FindNotificationByIdUseCasePortToken } from "@/backend/modules/notification/public/ports/find-notification-by-id.usecase.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { formatZodErrors } from "@/backend/modules/shared/presentation/handlers/utils/format-zod-errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"
import { NOTIFICATION_ERROR_CODES } from "@/shared/errors/notification.errors"

const findNotificationByIdSchema = z.object({
  id: z.string().min(1)
})

export type FindNotificationByIdHandlerInput = z.input<
  typeof findNotificationByIdSchema
>

export type FindNotificationByIdHandlerResult = Result<{
  notification: NotificationDetailDto
}>

export const FindNotificationByIdHandlerToken = Symbol(
  "FindNotificationByIdHandler"
)

export interface FindNotificationByIdHandler {
  handle(
    input: FindNotificationByIdHandlerInput
  ): Promise<FindNotificationByIdHandlerResult>
}

@injectable()
export class FindNotificationByIdHandlerImpl
  implements FindNotificationByIdHandler
{
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(FindNotificationByIdUseCasePortToken)
    private readonly findNotificationByIdUseCase: FindNotificationByIdUseCasePort
  ) {}

  async handle(
    input: FindNotificationByIdHandlerInput
  ): Promise<FindNotificationByIdHandlerResult> {
    // 1. バリデーション
    const parsed = findNotificationByIdSchema.safeParse(input)

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
      // 2. UseCase実行
      const output = await this.findNotificationByIdUseCase.handle({
        id: parsed.data.id
      })

      return {
        ok: true,
        data: output
      }
    } catch (e: unknown) {
      // 3. Domain Error を Result 型に変換
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

      // 4. 予期しないエラーはログ出力
      this.logger.error("Failed to find notification by id", {
        id: parsed.data.id,
        error: e instanceof Error ? e.message : String(e)
      })

      return {
        ok: false,
        error: {
          code: COMMON_ERROR_CODES.INTERNAL_SERVER_ERROR,
          status: 500,
          message: "Failed to find notification"
        }
      }
    }
  }
}
