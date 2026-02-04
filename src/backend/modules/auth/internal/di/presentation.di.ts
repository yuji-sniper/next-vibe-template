import type { DependencyContainer } from "tsyringe"
import {
  DeleteAuthUserHandlerImpl,
  DeleteAuthUserHandlerToken
} from "@/backend/modules/auth/internal/presentation/handlers/delete-auth-user/delete-auth-user.handler"
import {
  GetAuthUserHandlerImpl,
  GetAuthUserHandlerToken
} from "@/backend/modules/auth/internal/presentation/handlers/get-auth-user/get-auth-user.handler"

export const initPresentationDependency = (container: DependencyContainer) => {
  container.registerSingleton(GetAuthUserHandlerToken, GetAuthUserHandlerImpl)
  container.registerSingleton(
    DeleteAuthUserHandlerToken,
    DeleteAuthUserHandlerImpl
  )
}
