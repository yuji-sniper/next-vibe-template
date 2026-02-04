import type { DependencyContainer } from "tsyringe"
import { initInfrastructureDependency } from "./infrastructure.di"

export const initNotificationDependency = (container: DependencyContainer) => {
  // infrastructure
  initInfrastructureDependency(container)
}
