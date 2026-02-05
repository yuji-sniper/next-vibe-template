import type { DependencyContainer } from "tsyringe"
import { CancelNotificationUseCase } from "@/backend/modules/notification/internal/application/commands/usecases/cancel-notification/cancel-notification.usecase"
import { CreateNotificationUseCase } from "@/backend/modules/notification/internal/application/commands/usecases/create-notification/create-notification.usecase"
import { UpdateNotificationUseCase } from "@/backend/modules/notification/internal/application/commands/usecases/update-notification/update-notification.usecase"
import { FindDeliveriesUseCase } from "@/backend/modules/notification/internal/application/queries/usecases/find-deliveries/find-deliveries.usecase"
import { FindNotificationByIdUseCase } from "@/backend/modules/notification/internal/application/queries/usecases/find-notification-by-id/find-notification-by-id.usecase"
import { FindNotificationsUseCase } from "@/backend/modules/notification/internal/application/queries/usecases/find-notifications/find-notifications.usecase"
import { CancelNotificationUseCasePortToken } from "@/backend/modules/notification/public/ports/cancel-notification.usecase.port"
import { CreateNotificationUseCasePortToken } from "@/backend/modules/notification/public/ports/create-notification.usecase.port"
import { FindDeliveriesUseCasePortToken } from "@/backend/modules/notification/public/ports/find-deliveries.usecase.port"
import { FindNotificationByIdUseCasePortToken } from "@/backend/modules/notification/public/ports/find-notification-by-id.usecase.port"
import { FindNotificationsUseCasePortToken } from "@/backend/modules/notification/public/ports/find-notifications.usecase.port"
import { UpdateNotificationUseCasePortToken } from "@/backend/modules/notification/public/ports/update-notification.usecase.port"

export function initApplicationDependency(container: DependencyContainer) {
  container.registerSingleton(
    CreateNotificationUseCasePortToken,
    CreateNotificationUseCase
  )
  container.registerSingleton(
    UpdateNotificationUseCasePortToken,
    UpdateNotificationUseCase
  )
  container.registerSingleton(
    CancelNotificationUseCasePortToken,
    CancelNotificationUseCase
  )
  container.registerSingleton(
    FindNotificationsUseCasePortToken,
    FindNotificationsUseCase
  )
  container.registerSingleton(
    FindNotificationByIdUseCasePortToken,
    FindNotificationByIdUseCase
  )
  container.registerSingleton(
    FindDeliveriesUseCasePortToken,
    FindDeliveriesUseCase
  )
}
