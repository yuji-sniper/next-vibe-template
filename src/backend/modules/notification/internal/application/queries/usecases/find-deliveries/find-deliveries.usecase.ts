import { inject, injectable } from "tsyringe"
import { DeliveryStatus } from "@/backend/modules/notification/internal/domain/delivery/delivery"
import type { DeliveryRepository } from "@/backend/modules/notification/internal/domain/delivery/delivery.repository"
import { DeliveryRepositoryToken } from "@/backend/modules/notification/internal/domain/delivery/delivery.repository"
import type {
  DeliverySummaryDto,
  FindDeliveriesUseCasePort,
  FindDeliveriesUseCasePortInput,
  FindDeliveriesUseCasePortOutput
} from "@/backend/modules/notification/public/ports/find-deliveries.usecase.port"
import type { GetAdminUserPort } from "../../../ports/get-admin-user.port"
import { GetAdminUserPortToken } from "../../../ports/get-admin-user.port"

const DEFAULT_LIMIT = 50
const DEFAULT_OFFSET = 0

@injectable()
export class FindDeliveriesUseCase implements FindDeliveriesUseCasePort {
  constructor(
    @inject(GetAdminUserPortToken)
    private readonly getAdminUser: GetAdminUserPort,
    @inject(DeliveryRepositoryToken)
    private readonly deliveryRepository: DeliveryRepository
  ) {}

  async handle(
    input: FindDeliveriesUseCasePortInput
  ): Promise<FindDeliveriesUseCasePortOutput> {
    // 1. 管理者認証確認
    await this.getAdminUser.handle()

    // 2. 配信結果一覧を取得
    const deliveries = await this.deliveryRepository.findByNotificationId(
      input.notificationId,
      {
        status: input.status,
        limit: input.limit ?? DEFAULT_LIMIT,
        offset: input.offset ?? DEFAULT_OFFSET
      }
    )

    // 3. ステータス別件数を取得
    const statusCounts = await this.deliveryRepository.countByStatus(
      input.notificationId
    )

    // 4. サマリ情報を計算
    const summary = this.calculateSummary(statusCounts)

    // 5. DTO形式で返却
    return {
      deliveries: deliveries.map((delivery) => ({
        id: delivery.id ? Number(delivery.id) : 0,
        userId: delivery.userId,
        email: delivery.email,
        status: delivery.status,
        attemptCount: delivery.attemptCount,
        lastError: delivery.lastError,
        sesMessageId: delivery.sesMessageId,
        sentAt: delivery.sentAt,
        createdAt: delivery.createdAt
      })),
      summary
    }
  }

  private calculateSummary(
    statusCounts: Record<number, number>
  ): DeliverySummaryDto {
    const pending = statusCounts[DeliveryStatus.PENDING] ?? 0
    const sending =
      (statusCounts[DeliveryStatus.SENDING] ?? 0) +
      (statusCounts[DeliveryStatus.RETRYING] ?? 0)
    const sent = statusCounts[DeliveryStatus.SENT] ?? 0
    const failed =
      (statusCounts[DeliveryStatus.FAILED] ?? 0) +
      (statusCounts[DeliveryStatus.BOUNCED] ?? 0) +
      (statusCounts[DeliveryStatus.COMPLAINED] ?? 0)
    const suppressed =
      (statusCounts[DeliveryStatus.SUPPRESSED] ?? 0) +
      (statusCounts[DeliveryStatus.UNSUBSCRIBED] ?? 0)

    const total = pending + sending + sent + failed + suppressed

    return {
      total,
      pending,
      sending,
      sent,
      failed,
      suppressed
    }
  }
}
