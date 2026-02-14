import { inject, injectable } from "tsyringe"
import type { GetAdminUserPort } from "@/backend/modules/notification/internal/application/ports/get-admin-user.port"
import { GetAdminUserPortToken } from "@/backend/modules/notification/internal/application/ports/get-admin-user.port"
import type { UpdateSchedulePort } from "@/backend/modules/notification/internal/application/ports/update-schedule.port"
import { UpdateSchedulePortToken } from "@/backend/modules/notification/internal/application/ports/update-schedule.port"
import type { NotificationRepository } from "@/backend/modules/notification/internal/domain/notification/notification.repository"
import { NotificationRepositoryToken } from "@/backend/modules/notification/internal/domain/notification/notification.repository"
import {
  NotificationNotFoundError,
  NotificationNotScheduledError
} from "@/backend/modules/notification/public/errors/notification.errors"
import type {
  UpdateNotificationUseCasePort,
  UpdateNotificationUseCasePortInput,
  UpdateNotificationUseCasePortOutput
} from "@/backend/modules/notification/public/ports/update-notification.usecase.port"
import type { Transactor } from "@/backend/modules/shared/application/ports/db/transactor.port"
import { TransactorToken } from "@/backend/modules/shared/application/ports/db/transactor.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { env } from "@/env"

@injectable()
export class UpdateNotificationUseCase
  implements UpdateNotificationUseCasePort
{
  constructor(
    @inject(GetAdminUserPortToken)
    private readonly getAdminUser: GetAdminUserPort,
    @inject(NotificationRepositoryToken)
    private readonly notificationRepository: NotificationRepository,
    @inject(UpdateSchedulePortToken)
    private readonly updateSchedule: UpdateSchedulePort,
    @inject(TransactorToken)
    private readonly transactor: Transactor,
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort
  ) {}

  async handle(
    input: UpdateNotificationUseCasePortInput
  ): Promise<UpdateNotificationUseCasePortOutput> {
    // 1. 管理者認証確認（トランザクション外で実行）
    await this.getAdminUser.handle()

    // 補償トランザクション用に情報を保存
    const compensationInfo: {
      schedulerUpdated: boolean
      originalSendAt: Date | null
      schedulerName: string | null
      notificationId: string | null
    } = {
      schedulerUpdated: false,
      originalSendAt: null,
      schedulerName: null,
      notificationId: null
    }

    try {
      // 2. トランザクション内で悲観的ロックを取得して処理
      return await this.transactor.execute(async () => {
        // 3. 悲観的ロック（SELECT FOR UPDATE）で通知を取得
        const notification =
          await this.notificationRepository.findByIdForUpdate(input.id)

        // 4. 存在しない場合はエラー
        if (!notification) {
          throw new NotificationNotFoundError(input.id)
        }

        // 5. SCHEDULED 以外の場合はエラー
        if (!notification.isScheduled()) {
          throw new NotificationNotScheduledError(input.id)
        }

        // 補償トランザクション用に情報を保存
        compensationInfo.originalSendAt = notification.sendAt
        compensationInfo.schedulerName = notification.schedulerName
        compensationInfo.notificationId = notification.id

        // 6. sendAt が変更された場合、スケジュールを更新
        if (
          input.sendAt !== undefined &&
          input.sendAt.getTime() !== notification.sendAt.getTime() &&
          notification.schedulerName
        ) {
          await this.updateSchedule.handle({
            scheduleName: notification.schedulerName,
            scheduleTime: input.sendAt,
            lambdaArn: env.AWS_LAMBDA_ARN_NOTIFICATION_FANOUT,
            payload: {
              notificationId: notification.id
            }
          })
          compensationInfo.schedulerUpdated = true
        }

        // 7. エンティティを更新
        if (input.title !== undefined) {
          notification.updateTitle(input.title)
        }
        if (input.subject !== undefined) {
          notification.updateSubject(input.subject)
        }
        if (input.bodyText !== undefined) {
          notification.updateBodyText(input.bodyText)
        }
        if (input.bodyHtml !== undefined) {
          notification.updateBodyHtml(input.bodyHtml)
        }
        if (input.sendAt !== undefined) {
          notification.updateSendAt(input.sendAt)
        }
        if (input.audienceType !== undefined) {
          notification.updateAudienceType(input.audienceType)
        }
        if (input.audiencePayload !== undefined) {
          notification.updateAudiencePayload(input.audiencePayload)
        }

        // 8. DB に保存
        await this.notificationRepository.save(notification)

        // 9. DTO形式で結果を返却
        return {
          notification: {
            id: notification.id,
            title: notification.title,
            subject: notification.subject,
            sendAt: notification.sendAt,
            audienceType: notification.audienceType,
            status: notification.status
          }
        }
      })
    } catch (error) {
      // 10. トランザクション失敗時、EventBridgeが更新されていた場合は補償トランザクションで元に戻す
      if (
        compensationInfo.schedulerUpdated &&
        compensationInfo.schedulerName &&
        compensationInfo.originalSendAt &&
        compensationInfo.notificationId
      ) {
        try {
          await this.updateSchedule.handle({
            scheduleName: compensationInfo.schedulerName,
            scheduleTime: compensationInfo.originalSendAt,
            lambdaArn: env.AWS_LAMBDA_ARN_NOTIFICATION_FANOUT,
            payload: {
              notificationId: compensationInfo.notificationId
            }
          })
        } catch (compensationError) {
          // 補償失敗はログに記録し、元のエラーを優先してスロー
          this.logger.error(
            "Failed to execute compensation transaction for EventBridge schedule",
            {
              notificationId: compensationInfo.notificationId,
              schedulerName: compensationInfo.schedulerName,
              originalSendAt: compensationInfo.originalSendAt.toISOString(),
              error:
                compensationError instanceof Error
                  ? compensationError.message
                  : String(compensationError)
            }
          )
        }
      }
      throw error
    }
  }
}
