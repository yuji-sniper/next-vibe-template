import "reflect-metadata"
import { container, type InjectionToken } from "tsyringe"
import { initAuthDependency } from "../modules/auth/di"
import { initAuthAdminDependency } from "../modules/auth-admin/di"
import { initBillingDependency } from "../modules/billing/di"
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
    // billing
    initBillingDependency(container)

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
