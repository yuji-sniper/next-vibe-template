import type { DependencyContainer } from "tsyringe"
import { CancelNotificationUseCase } from "@/backend/modules/notification/internal/application/commands/usecases/cancel-notification/cancel-notification.usecase"
import { CreateNotificationUseCase } from "@/backend/modules/notification/internal/application/commands/usecases/create-notification/create-notification.usecase"
import { UpdateNotificationUseCase } from "@/backend/modules/notification/internal/application/commands/usecases/update-notification/update-notification.usecase"
import { CancelNotificationUseCasePortToken } from "@/backend/modules/notification/public/ports/cancel-notification.usecase.port"
import { CreateNotificationUseCasePortToken } from "@/backend/modules/notification/public/ports/create-notification.usecase.port"
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
}
