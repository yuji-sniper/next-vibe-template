import type { DependencyContainer } from "tsyringe"
import { GetAuthAdminPortToken } from "@/backend/modules/auth-admin/application/queries/ports/get-auth-admin.port"
import { AdminRepositoryToken } from "@/backend/modules/auth-admin/domain/auth-admin/admin.repository"
import { GetAuthAdminBetterAuthAdapter } from "@/backend/modules/auth-admin/infrastructure/auth/better-auth/get-auth-admin.better-auth.adapter"
import { AdminDrizzleRepository } from "@/backend/modules/auth-admin/infrastructure/repositories/admin.drizzle.repository"

export function initInfrastructureDependency(container: DependencyContainer) {
  container.registerSingleton(
    GetAuthAdminPortToken,
    GetAuthAdminBetterAuthAdapter
  )
  container.registerSingleton(AdminRepositoryToken, AdminDrizzleRepository)
}
