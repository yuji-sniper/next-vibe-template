import type { DependencyContainer } from "tsyringe"
import { initInfrastructureDependency } from "./infrastructure.di"

export const initSharedDependency = (container: DependencyContainer) => {
  // infrastructure
  initInfrastructureDependency(container)
}
