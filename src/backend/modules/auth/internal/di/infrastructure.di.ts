import type { DependencyContainer } from "tsyringe"
import { GetAuthUserPortToken } from "@/backend/modules/auth/internal/application/ports/get-auth-user.port"
import { UserRepositoryToken } from "@/backend/modules/auth/internal/domain/auth-user/user.repository"
import { GetAuthUserBetterAuthAdapter } from "@/backend/modules/auth/internal/infrastructure/auth/better-auth/get-auth-user.better-auth.adapter"
import { UserMysqlDrizzleRepository } from "@/backend/modules/auth/internal/infrastructure/db/mysql/drizzle/repositories/user.mysql-drizzle.repository"

export function initInfrastructureDependency(container: DependencyContainer) {
  container.registerSingleton(
    GetAuthUserPortToken,
    GetAuthUserBetterAuthAdapter
  )
  container.registerSingleton(UserRepositoryToken, UserMysqlDrizzleRepository)
}
