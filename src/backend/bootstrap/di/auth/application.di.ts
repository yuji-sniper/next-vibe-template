import type { DependencyContainer } from "tsyringe"
import { FindAuthUserUseCasePortToken } from "@/backend/modules/auth/application"
import { FindAuthUserUseCase } from "@/backend/modules/auth/application/queries/usecases/find-auth-user/find-auth-user.usecase"

export function initAuthApplicationDependency(container: DependencyContainer) {
  container.register(FindAuthUserUseCasePortToken, FindAuthUserUseCase)
}
