import type { DependencyContainer } from "tsyringe"
import { initSharedInfrastructureDependency } from "./infrastructure.di"

export const initSharedDependency = (container: DependencyContainer) => {
  // infrastructure
  initSharedInfrastructureDependency(container)

  // presentation

  // application

  // domain
}
