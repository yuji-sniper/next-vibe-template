import type { DependencyContainer } from "tsyringe"
import { CreateSchedulePortToken } from "@/backend/modules/notification/internal/application/ports/create-schedule.port"
import { DeleteSchedulePortToken } from "@/backend/modules/notification/internal/application/ports/delete-schedule.port"
import { GetAdminUserPortToken } from "@/backend/modules/notification/internal/application/ports/get-admin-user.port"
import { UpdateSchedulePortToken } from "@/backend/modules/notification/internal/application/ports/update-schedule.port"
import { DeliveryRepositoryToken } from "@/backend/modules/notification/internal/domain/delivery/delivery.repository"
import { NotificationRepositoryToken } from "@/backend/modules/notification/internal/domain/notification/notification.repository"
import { DeliveryMysqlDrizzleRepository } from "@/backend/modules/notification/internal/infrastructure/db/mysql/drizzle/repositories/delivery.mysql-drizzle.repository"
import { NotificationMysqlDrizzleRepository } from "@/backend/modules/notification/internal/infrastructure/db/mysql/drizzle/repositories/notification.mysql-drizzle.repository"
import { CreateScheduleEventBridgeSchedulerAdapter } from "@/backend/modules/notification/internal/infrastructure/eventbridge-scheduler/create-schedule.eventbridge-scheduler.adapter"
import { DeleteScheduleEventBridgeSchedulerAdapter } from "@/backend/modules/notification/internal/infrastructure/eventbridge-scheduler/delete-schedule.eventbridge-scheduler.adapter"
import { UpdateScheduleEventBridgeSchedulerAdapter } from "@/backend/modules/notification/internal/infrastructure/eventbridge-scheduler/update-schedule.eventbridge-scheduler.adapter"
import { GetAdminUserAuthModuleAdapter } from "@/backend/modules/notification/internal/infrastructure/modules/auth/get-admin-user.auth-module.adapter"

export function initInfrastructureDependency(container: DependencyContainer) {
  // Repositories
  container.registerSingleton(
    NotificationRepositoryToken,
    NotificationMysqlDrizzleRepository
  )
  container.registerSingleton(
    DeliveryRepositoryToken,
    DeliveryMysqlDrizzleRepository
  )

  // External Module Adapters
  container.registerSingleton(
    GetAdminUserPortToken,
    GetAdminUserAuthModuleAdapter
  )

  // External Service Adapters
  container.registerSingleton(
    CreateSchedulePortToken,
    CreateScheduleEventBridgeSchedulerAdapter
  )
  container.registerSingleton(
    DeleteSchedulePortToken,
    DeleteScheduleEventBridgeSchedulerAdapter
  )
  container.registerSingleton(
    UpdateSchedulePortToken,
    UpdateScheduleEventBridgeSchedulerAdapter
  )
}
