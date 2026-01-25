import type { DependencyContainer } from "tsyringe"
import { GetAuthUserPortToken } from "@/backend/modules/auth/application/queries/ports/get-auth-user.port"
import { UserRepositoryToken } from "@/backend/modules/auth/domain/auth-user/user.repository"
import { GetAuthUserBetterAuthAdapter } from "@/backend/modules/auth/infrastructure/auth/better-auth/get-auth-user.better-auth.adapter"
import { UserDrizzleRepository } from "@/backend/modules/auth/infrastructure/repositories/user.drizzle.repository"

export function initInfrastructureDependency(container: DependencyContainer) {
  container.registerSingleton(
    GetAuthUserPortToken,
    GetAuthUserBetterAuthAdapter
  )
  container.registerSingleton(UserRepositoryToken, UserDrizzleRepository)
}
