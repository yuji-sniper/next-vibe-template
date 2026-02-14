import type { DependencyContainer } from "tsyringe"
import { GetAuthAdminPortToken } from "@/backend/modules/auth-admin/internal/application/queries/ports/get-auth-admin.port"
import { AdminRepositoryToken } from "@/backend/modules/auth-admin/internal/domain/auth-admin/admin.repository"
import { GetAuthAdminBetterAuthAdapter } from "@/backend/modules/auth-admin/internal/infrastructure/auth/better-auth/get-auth-admin.better-auth.adapter"
import { AdminMysqlDrizzleRepository } from "@/backend/modules/auth-admin/internal/infrastructure/db/mysql/drizzle/repositories/admin.mysql-drizzle.repository"

export function initInfrastructureDependency(container: DependencyContainer) {
  container.registerSingleton(
    GetAuthAdminPortToken,
    GetAuthAdminBetterAuthAdapter
  )
  container.registerSingleton(AdminRepositoryToken, AdminMysqlDrizzleRepository)
}
