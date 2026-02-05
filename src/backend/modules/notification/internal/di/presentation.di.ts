import type { DependencyContainer } from "tsyringe"
import {
  CancelNotificationHandlerImpl,
  CancelNotificationHandlerToken
} from "@/backend/modules/notification/internal/presentation/handlers/cancel-notification/cancel-notification.handler"
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
  container.registerSingleton(
    CancelNotificationHandlerToken,
    CancelNotificationHandlerImpl
  )
}
