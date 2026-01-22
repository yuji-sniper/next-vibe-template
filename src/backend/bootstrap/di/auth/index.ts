import type { DependencyContainer } from "tsyringe"
import { initAuthApplicationDependency } from "./application.di"
import { initAuthInfrastructureDependency } from "./infrastructure.di"

export function initAuthDependency(container: DependencyContainer) {
  // infrastructure
  initAuthInfrastructureDependency(container)
  // application
  initAuthApplicationDependency(container)
}
