import { inject, injectable } from "tsyringe"
import type { DeleteSchedulePort } from "@/backend/modules/notification/internal/application/ports/delete-schedule.port"
import { DeleteSchedulePortToken } from "@/backend/modules/notification/internal/application/ports/delete-schedule.port"
import type { GetAdminUserPort } from "@/backend/modules/notification/internal/application/ports/get-admin-user.port"
import { GetAdminUserPortToken } from "@/backend/modules/notification/internal/application/ports/get-admin-user.port"
import type { NotificationRepository } from "@/backend/modules/notification/internal/domain/notification/notification.repository"
import { NotificationRepositoryToken } from "@/backend/modules/notification/internal/domain/notification/notification.repository"
import {
  NotificationAlreadyCancelledError,
  NotificationAlreadyCompletedError,
  NotificationNotFoundError
} from "@/backend/modules/notification/public/errors/notification.errors"
import type {
  CancelNotificationUseCasePort,
  CancelNotificationUseCasePortInput,
  CancelNotificationUseCasePortOutput
} from "@/backend/modules/notification/public/ports/cancel-notification.usecase.port"
import type { Transactor } from "@/backend/modules/shared/application/ports/db/transactor.port"
import { TransactorToken } from "@/backend/modules/shared/application/ports/db/transactor.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"

@injectable()
export class CancelNotificationUseCase
  implements CancelNotificationUseCasePort
{
  constructor(
    @inject(GetAdminUserPortToken)
    private readonly getAdminUser: GetAdminUserPort,
    @inject(NotificationRepositoryToken)
    private readonly notificationRepository: NotificationRepository,
    @inject(DeleteSchedulePortToken)
    private readonly deleteSchedule: DeleteSchedulePort,
    @inject(TransactorToken)
    private readonly transactor: Transactor,
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort
  ) {}

  async handle(
    input: CancelNotificationUseCasePortInput
  ): Promise<CancelNotificationUseCasePortOutput> {
    // 1. 管理者認証確認（トランザクション外で実行）
    await this.getAdminUser.handle()

    // スケジュール名を保存（トランザクション後に削除するため）
    const compensationInfo: {
      schedulerName: string | null
    } = {
      schedulerName: null
    }

    // 2. トランザクション内で悲観的ロックを取得して処理（DB先行パターン）
    const result = await this.transactor.execute(async () => {
      // 3. 悲観的ロック（SELECT FOR UPDATE）で通知を取得
      const notification = await this.notificationRepository.findByIdForUpdate(
        input.id
      )

      // 4. 存在しない場合はエラー
      if (!notification) {
        throw new NotificationNotFoundError(input.id)
      }

      // 5. ステータスチェック
      if (notification.isCancelled()) {
        throw new NotificationAlreadyCancelledError(input.id)
      }

      if (notification.isCompleted()) {
        throw new NotificationAlreadyCompletedError(input.id)
      }

      // スケジュール名を保存
      compensationInfo.schedulerName = notification.schedulerName

      // 6. ステータスを CANCELLED に変更
      notification.cancel()

      // 7. DB に保存
      await this.notificationRepository.save(notification)

      // 8. DTO形式で結果を返却
      return {
        notification: {
          id: notification.id,
          title: notification.title,
          status: notification.status
        }
      }
    })

    // 9. トランザクション終了後、スケジュールを削除（エラーは握りつぶす）
    if (compensationInfo.schedulerName) {
      try {
        await this.deleteSchedule.handle({
          scheduleName: compensationInfo.schedulerName
        })
      } catch (error) {
        // EventBridge削除失敗はログに記録し、例外はスローしない
        // DB上は CANCELLED なので、スケジュールが発火してもLambdaで処理されない（べき等性）
        this.logger.error(
          "Failed to delete EventBridge schedule, but notification is already cancelled",
          {
            notificationId: input.id,
            schedulerName: compensationInfo.schedulerName,
            error: error instanceof Error ? error.message : String(error)
          }
        )
      }
    }

    return result
  }
}
