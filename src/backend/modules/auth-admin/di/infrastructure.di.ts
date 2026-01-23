import type { DependencyContainer } from "tsyringe"
import { GetAuthAdminPortToken } from "@/backend/modules/auth-admin/application/queries/ports/get-auth-admin.port"
import { GetAuthAdminBetterAuthAdapter } from "@/backend/modules/auth-admin/infrastructure/auth/better-auth/get-auth-admin.better-auth.adapter"

export function initInfrastructureDependency(container: DependencyContainer) {
  container.registerSingleton(
    GetAuthAdminPortToken,
    GetAuthAdminBetterAuthAdapter
  )
}
