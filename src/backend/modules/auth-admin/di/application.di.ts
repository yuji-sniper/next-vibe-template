import type { DependencyContainer } from "tsyringe"
import { DeleteAuthAdminUseCase } from "@/backend/modules/auth-admin/application/commands/usecases/delete-auth-admin/delete-auth-admin.usecase"
import { DeleteAuthAdminUseCasePortToken } from "@/backend/modules/auth-admin/application/commands/usecases/delete-auth-admin/delete-auth-admin.usecase.port"
import { FindAuthAdminUseCase } from "@/backend/modules/auth-admin/application/queries/usecases/find-auth-admin/find-auth-admin.usecase"
import { FindAuthAdminUseCasePortToken } from "@/backend/modules/auth-admin/application/queries/usecases/find-auth-admin/find-auth-admin.usecase.port"

export function initApplicationDependency(container: DependencyContainer) {
  container.registerSingleton(
    FindAuthAdminUseCasePortToken,
    FindAuthAdminUseCase
  )
  container.registerSingleton(
    DeleteAuthAdminUseCasePortToken,
    DeleteAuthAdminUseCase
  )
}
