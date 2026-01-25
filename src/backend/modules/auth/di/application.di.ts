import type { DependencyContainer } from "tsyringe"
import { DeleteAuthUserUseCase } from "@/backend/modules/auth/application/commands/usecases/delete-auth-user/delete-auth-user.usecase"
import { DeleteAuthUserUseCasePortToken } from "@/backend/modules/auth/application/commands/usecases/delete-auth-user/delete-auth-user.usecase.port"
import { FindAuthUserUseCase } from "@/backend/modules/auth/application/queries/usecases/find-auth-user/find-auth-user.usecase"
import { FindAuthUserUseCasePortToken } from "@/backend/modules/auth/application/queries/usecases/find-auth-user/find-auth-user.usecase.port"

export function initApplicationDependency(container: DependencyContainer) {
  container.registerSingleton(FindAuthUserUseCasePortToken, FindAuthUserUseCase)
  container.registerSingleton(
    DeleteAuthUserUseCasePortToken,
    DeleteAuthUserUseCase
  )
}
