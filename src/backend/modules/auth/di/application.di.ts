import type { DependencyContainer } from "tsyringe"
import { FindAuthUserUseCase } from "@/backend/modules/auth/application/queries/usecases/find-auth-user/find-auth-user.usecase"
import { FindAuthUserUseCasePortToken } from "@/backend/modules/auth/application/queries/usecases/find-auth-user/find-auth-user.usecase.port"

export function initApplicationDependency(container: DependencyContainer) {
  container.registerSingleton(FindAuthUserUseCasePortToken, FindAuthUserUseCase)
}
