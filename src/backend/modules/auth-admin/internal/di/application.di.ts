import type { DependencyContainer } from "tsyringe"
import { FindAuthAdminUseCase } from "@/backend/modules/auth-admin/internal/application/queries/usecases/find-auth-admin/find-auth-admin.usecase"
import { FindAuthAdminUseCasePortToken } from "@/backend/modules/auth-admin/public/ports/find-auth-admin.usecase.port"

export function initApplicationDependency(container: DependencyContainer) {
  container.registerSingleton(
    FindAuthAdminUseCasePortToken,
    FindAuthAdminUseCase
  )
}
