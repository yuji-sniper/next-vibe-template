import type { DependencyContainer } from "tsyringe"
import { AlsContext, DbTransactor, GetDb } from "@/backend/modules/shared"

export const initInfrastructureDependency = (
  container: DependencyContainer
) => {
  // node
  container.registerInstance(
    AlsContext,
    new AlsContext(new AsyncLocalStorage())
  )

  // db
  container.registerInstance(GetDb, new GetDb(container.resolve(AlsContext)))
  container.registerInstance(
    DbTransactor,
    new DbTransactor(container.resolve(AlsContext))
  )
}
