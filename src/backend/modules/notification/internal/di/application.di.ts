import type { DependencyContainer } from "tsyringe"
import { CreateNotificationUseCase } from "@/backend/modules/notification/internal/application/commands/usecases/create-notification/create-notification.usecase"
import { CreateNotificationUseCasePortToken } from "@/backend/modules/notification/public/ports/create-notification.usecase.port"

export function initApplicationDependency(container: DependencyContainer) {
  container.registerSingleton(
    CreateNotificationUseCasePortToken,
    CreateNotificationUseCase
  )
}
