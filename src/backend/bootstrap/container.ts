import "reflect-metadata"
import { container, type InjectionToken } from "tsyringe"
import { initAuthDependency } from "../modules/auth/internal/di"
import { initAuthAdminDependency } from "../modules/auth-admin/internal/di"
import { initSharedDependency } from "../modules/shared/di"

let initialized = false

const getContainer = () => {
  if (!initialized) {
    // shared
    initSharedDependency(container)
    // auth
    initAuthDependency(container)
    // auth-admin
    initAuthAdminDependency(container)

    initialized = true
  }
  return container
}

export const resolveContainer = async <T>(
  token: InjectionToken<T>
): Promise<T> => {
  const container = getContainer()

  return container.resolve(token)
}
