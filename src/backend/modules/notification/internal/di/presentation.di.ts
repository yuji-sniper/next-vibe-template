import type { DependencyContainer } from "tsyringe"
import {
  CreateNotificationHandlerImpl,
  CreateNotificationHandlerToken
} from "@/backend/modules/notification/internal/presentation/handlers/create-notification/create-notification.handler"

export const initPresentationDependency = (container: DependencyContainer) => {
  container.registerSingleton(
    CreateNotificationHandlerToken,
    CreateNotificationHandlerImpl
  )
}
