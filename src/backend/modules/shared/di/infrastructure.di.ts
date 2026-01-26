import type { DependencyContainer } from "tsyringe"
import { UuidV7GeneratorPortToken } from "@/backend/modules/shared/application/ports/uuid/uuid-v7-generator.port"
import { GetDb } from "@/backend/modules/shared/infrastructure/db/postgresql/drizzle/get-db"
import { DbTransactor } from "@/backend/modules/shared/infrastructure/db/postgresql/drizzle/transactor"
import { AlsContext } from "@/backend/modules/shared/infrastructure/node/als/als-context"
import { UuidV7Generator } from "@/backend/modules/shared/infrastructure/uuid/uuid-v7-generator"

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

  // uuid
  container.registerSingleton(UuidV7GeneratorPortToken, UuidV7Generator)
}
