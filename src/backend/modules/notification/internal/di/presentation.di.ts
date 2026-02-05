import type { DependencyContainer } from "tsyringe"
import {
  CreateNotificationHandlerImpl,
  CreateNotificationHandlerToken
} from "@/backend/modules/notification/internal/presentation/handlers/create-notification/create-notification.handler"
import {
  UpdateNotificationHandlerImpl,
  UpdateNotificationHandlerToken
} from "@/backend/modules/notification/internal/presentation/handlers/update-notification/update-notification.handler"

export const initPresentationDependency = (container: DependencyContainer) => {
  container.registerSingleton(
    CreateNotificationHandlerToken,
    CreateNotificationHandlerImpl
  )
  container.registerSingleton(
    UpdateNotificationHandlerToken,
    UpdateNotificationHandlerImpl
  )
}
