import "reflect-metadata"
import { container, type DependencyContainer } from "tsyringe"
import { initAuthDependency } from "./auth"
import { initSharedDependency } from "./shared"

let initialized = false

export async function getContainer(): Promise<DependencyContainer> {
  if (!initialized) {
    // shared
    initSharedDependency(container)

    // auth
    initAuthDependency(container)

    initialized = true
  }

  return container
}
