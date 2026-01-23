import type { DependencyContainer } from "tsyringe"
import { initApplicationDependency } from "./application.di"
import { initInfrastructureDependency } from "./infrastructure.di"

export const initAuthDependency = (container: DependencyContainer) => {
  // infrastructure
  initInfrastructureDependency(container)
  // application
  initApplicationDependency(container)
}
