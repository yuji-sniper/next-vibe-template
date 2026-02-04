import type { DependencyContainer } from "tsyringe"
import { DeliveryRepositoryToken } from "@/backend/modules/notification/internal/domain/delivery/delivery.repository"
import { NotificationRepositoryToken } from "@/backend/modules/notification/internal/domain/notification/notification.repository"
import { DeliveryDrizzleRepository } from "@/backend/modules/notification/internal/infrastructure/repositories/delivery.drizzle.repository"
import { NotificationDrizzleRepository } from "@/backend/modules/notification/internal/infrastructure/repositories/notification.drizzle.repository"

export function initInfrastructureDependency(container: DependencyContainer) {
  // Repositories
  container.registerSingleton(
    NotificationRepositoryToken,
    NotificationDrizzleRepository
  )
  container.registerSingleton(
    DeliveryRepositoryToken,
    DeliveryDrizzleRepository
  )
}
