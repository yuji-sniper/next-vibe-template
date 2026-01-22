import type { DependencyContainer } from "tsyringe"
import { GetAuthUserPortToken } from "@/backend/modules/auth/application/queries/ports/get-auth-user.port"
import { GetAuthUserBetterAuthAdapter } from "@/backend/modules/auth/infrastructure/auth/better-auth/get-auth-user.better-auth.adapter"

export function initAuthInfrastructureDependency(
  container: DependencyContainer
) {
  container.registerSingleton(
    GetAuthUserPortToken,
    GetAuthUserBetterAuthAdapter
  )
}
