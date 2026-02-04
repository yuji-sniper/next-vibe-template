import type { DependencyContainer } from "tsyringe"
import {
  GetAuthAdminHandlerImpl,
  GetAuthAdminHandlerToken
} from "@/backend/modules/auth-admin/internal/presentation/handlers/get-auth-admin/get-auth-admin.handler"

export const initPresentationDependency = (container: DependencyContainer) => {
  container.registerSingleton(GetAuthAdminHandlerToken, GetAuthAdminHandlerImpl)
}
