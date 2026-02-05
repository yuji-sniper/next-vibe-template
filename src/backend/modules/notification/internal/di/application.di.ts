import type { DependencyContainer } from "tsyringe"
import { CreateNotificationUseCase } from "@/backend/modules/notification/internal/application/commands/usecases/create-notification/create-notification.usecase"
import { UpdateNotificationUseCase } from "@/backend/modules/notification/internal/application/commands/usecases/update-notification/update-notification.usecase"
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
}
