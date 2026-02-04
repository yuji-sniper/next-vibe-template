import { inject, injectable } from "tsyringe"
import type { CreateSchedulePort } from "@/backend/modules/notification/internal/application/commands/ports/create-schedule.port"
import { CreateSchedulePortToken } from "@/backend/modules/notification/internal/application/commands/ports/create-schedule.port"
import type { GetAdminUserPort } from "@/backend/modules/notification/internal/application/ports/get-admin-user.port"
import { GetAdminUserPortToken } from "@/backend/modules/notification/internal/application/ports/get-admin-user.port"
import { Notification } from "@/backend/modules/notification/internal/domain/notification/notification"
import type { NotificationRepository } from "@/backend/modules/notification/internal/domain/notification/notification.repository"
import { NotificationRepositoryToken } from "@/backend/modules/notification/internal/domain/notification/notification.repository"
import type {
  CreateNotificationUseCasePort,
  CreateNotificationUseCasePortInput,
  CreateNotificationUseCasePortOutput
} from "@/backend/modules/notification/public/ports/create-notification.usecase.port"
import type { UuidV7GeneratorPort } from "@/backend/modules/shared/application/ports/uuid/uuid-v7-generator.port"
import { UuidV7GeneratorPortToken } from "@/backend/modules/shared/application/ports/uuid/uuid-v7-generator.port"
import { env } from "@/env"

@injectable()
export class CreateNotificationUseCase
  implements CreateNotificationUseCasePort
{
  constructor(
    @inject(GetAdminUserPortToken)
    private readonly getAdminUser: GetAdminUserPort,
    @inject(NotificationRepositoryToken)
    private readonly notificationRepository: NotificationRepository,
    @inject(CreateSchedulePortToken)
    private readonly createSchedule: CreateSchedulePort,
    @inject(UuidV7GeneratorPortToken)
    private readonly uuidV7Generator: UuidV7GeneratorPort
  ) {}

  async handle(
    input: CreateNotificationUseCasePortInput
  ): Promise<CreateNotificationUseCasePortOutput> {
    // 1. 管理者認証確認
    await this.getAdminUser.handle()

    // 2. Notification エンティティを作成
    const notificationId = this.uuidV7Generator.generate()
    const notification = Notification.create({
      id: notificationId,
      title: input.title,
      subject: input.subject,
      bodyText: input.bodyText,
      bodyHtml: input.bodyHtml,
      sendAt: input.sendAt,
      audienceType: input.audienceType,
      audiencePayload: input.audiencePayload
    })

    // 3. NotificationRepository.save() で保存
    await this.notificationRepository.save(notification)

    // 4. スケジューラ名を生成
    const schedulerName = `notification-${notificationId}`

    // 5. CreateSchedulePort.handle() でEventBridge Scheduler登録
    await this.createSchedule.handle({
      scheduleName: schedulerName,
      scheduleTime: input.sendAt,
      lambdaArn: env.AWS_LAMBDA_ARN_NOTIFICATION_KICKOFF,
      payload: {
        notificationId: notificationId
      }
    })

    // 6. Notification.updateSchedulerName() でスケジューラ名を更新
    notification.updateSchedulerName(schedulerName)

    // 7. NotificationRepository.save() で再保存
    await this.notificationRepository.save(notification)

    // 8. DTO形式で結果を返却
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
  }
}
