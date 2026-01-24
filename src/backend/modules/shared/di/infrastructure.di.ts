import type { DependencyContainer } from "tsyringe"
import { GetDb } from "@/backend/modules/shared/infrastructure/db/postgresql/drizzle/get-db"
import { DbTransactor } from "@/backend/modules/shared/infrastructure/db/postgresql/drizzle/transactor"
import { AlsContext } from "@/backend/modules/shared/infrastructure/node/als/als-context"

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
