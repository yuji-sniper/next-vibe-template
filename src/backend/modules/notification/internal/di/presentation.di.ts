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
  FindDeliveriesHandlerImpl,
  FindDeliveriesHandlerToken
} from "@/backend/modules/notification/internal/presentation/handlers/find-deliveries/find-deliveries.handler"
import {
  FindNotificationByIdHandlerImpl,
  FindNotificationByIdHandlerToken
} from "@/backend/modules/notification/internal/presentation/handlers/find-notification-by-id/find-notification-by-id.handler"
import {
  FindNotificationsHandlerImpl,
  FindNotificationsHandlerToken
} from "@/backend/modules/notification/internal/presentation/handlers/find-notifications/find-notifications.handler"
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
  container.registerSingleton(
    FindNotificationsHandlerToken,
    FindNotificationsHandlerImpl
  )
  container.registerSingleton(
    FindNotificationByIdHandlerToken,
    FindNotificationByIdHandlerImpl
  )
  container.registerSingleton(
    FindDeliveriesHandlerToken,
    FindDeliveriesHandlerImpl
  )
}
