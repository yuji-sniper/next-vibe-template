import type { DependencyContainer } from "tsyringe"
import { DeleteAuthUserUseCase } from "@/backend/modules/auth/internal/application/commands/usecases/delete-auth-user.usecase"
import { FindAuthUserUseCase } from "@/backend/modules/auth/internal/application/queries/usecases/find-auth-user.usecase"
import { DeleteAuthUserUseCasePortToken } from "@/backend/modules/auth/public/ports/delete-auth-user.usecase.port"
import { FindAuthUserUseCasePortToken } from "@/backend/modules/auth/public/ports/find-auth-user.usecase.port"

export function initApplicationDependency(container: DependencyContainer) {
  container.registerSingleton(FindAuthUserUseCasePortToken, FindAuthUserUseCase)
  container.registerSingleton(
    DeleteAuthUserUseCasePortToken,
    DeleteAuthUserUseCase
  )
}
