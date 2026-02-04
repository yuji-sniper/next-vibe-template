import type { DependencyContainer } from "tsyringe"
import { initApplicationDependency } from "./application.di"
import { initInfrastructureDependency } from "./infrastructure.di"
import { initPresentationDependency } from "./presentation.di"

export const initAuthAdminDependency = (container: DependencyContainer) => {
  // infrastructure
  initInfrastructureDependency(container)
  // application
  initApplicationDependency(container)
  // presentation
  initPresentationDependency(container)
}
