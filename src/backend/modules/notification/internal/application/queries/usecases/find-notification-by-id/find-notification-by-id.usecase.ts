import { inject, injectable } from "tsyringe"
import type { NotificationRepository } from "@/backend/modules/notification/internal/domain/notification/notification.repository"
import { NotificationRepositoryToken } from "@/backend/modules/notification/internal/domain/notification/notification.repository"
import { NotificationNotFoundError } from "@/backend/modules/notification/public/errors/notification.errors"
import type {
  FindNotificationByIdUseCasePort,
  FindNotificationByIdUseCasePortInput,
  FindNotificationByIdUseCasePortOutput
} from "@/backend/modules/notification/public/ports/find-notification-by-id.usecase.port"
import type { GetAdminUserPort } from "../../../ports/get-admin-user.port"
import { GetAdminUserPortToken } from "../../../ports/get-admin-user.port"

@injectable()
export class FindNotificationByIdUseCase
  implements FindNotificationByIdUseCasePort
{
  constructor(
    @inject(GetAdminUserPortToken)
    private readonly getAdminUser: GetAdminUserPort,
    @inject(NotificationRepositoryToken)
    private readonly notificationRepository: NotificationRepository
  ) {}

  async handle(
    input: FindNotificationByIdUseCasePortInput
  ): Promise<FindNotificationByIdUseCasePortOutput> {
    // 1. 管理者認証確認
    await this.getAdminUser.handle()

    // 2. 通知を取得
    const notification = await this.notificationRepository.findById(input.id)

    // 3. 存在しない場合はエラー
    if (!notification) {
      throw new NotificationNotFoundError(input.id)
    }

    // 4. DTO形式で返却
    return {
      notification: {
        id: notification.id,
        title: notification.title,
        subject: notification.subject,
        bodyText: notification.bodyText,
        bodyHtml: notification.bodyHtml,
        sendAt: notification.sendAt,
        audienceType: notification.audienceType,
        audiencePayload: notification.audiencePayload,
        status: notification.status,
        schedulerName: notification.schedulerName,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt
      }
    }
  }
}
