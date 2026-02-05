import { inject, injectable } from "tsyringe"
import type { NotificationRepository } from "@/backend/modules/notification/internal/domain/notification/notification.repository"
import { NotificationRepositoryToken } from "@/backend/modules/notification/internal/domain/notification/notification.repository"
import type {
  FindNotificationsUseCasePort,
  FindNotificationsUseCasePortInput,
  FindNotificationsUseCasePortOutput
} from "@/backend/modules/notification/public/ports/find-notifications.usecase.port"
import type { GetAdminUserPort } from "../../../ports/get-admin-user.port"
import { GetAdminUserPortToken } from "../../../ports/get-admin-user.port"

const DEFAULT_LIMIT = 20
const DEFAULT_OFFSET = 0

@injectable()
export class FindNotificationsUseCase implements FindNotificationsUseCasePort {
  constructor(
    @inject(GetAdminUserPortToken)
    private readonly getAdminUser: GetAdminUserPort,
    @inject(NotificationRepositoryToken)
    private readonly notificationRepository: NotificationRepository
  ) {}

  async handle(
    input: FindNotificationsUseCasePortInput
  ): Promise<FindNotificationsUseCasePortOutput> {
    // 1. 管理者認証確認
    await this.getAdminUser.handle()

    // 2. 通知一覧を取得
    const notifications = await this.notificationRepository.findAll({
      status: input.status,
      limit: input.limit ?? DEFAULT_LIMIT,
      offset: input.offset ?? DEFAULT_OFFSET
    })

    // 3. トータル件数を取得
    const total = await this.notificationRepository.count(input.status)

    // 4. DTO形式で返却
    return {
      notifications: notifications.map((notification) => ({
        id: notification.id,
        title: notification.title,
        subject: notification.subject,
        sendAt: notification.sendAt,
        audienceType: notification.audienceType,
        status: notification.status,
        createdAt: notification.createdAt
      })),
      total
    }
  }
}
