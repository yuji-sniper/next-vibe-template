import type { DependencyContainer } from "tsyringe"
import { TransactorToken } from "@/backend/modules/shared/application/ports/db/transactor.port"
import { UuidV7GeneratorPortToken } from "@/backend/modules/shared/application/ports/uuid/uuid-v7-generator.port"
import { GetDb } from "@/backend/modules/shared/infrastructure/db/postgresql/drizzle/get-db"
import { DbTransactor } from "@/backend/modules/shared/infrastructure/db/postgresql/drizzle/transactor"
import { AlsContext } from "@/backend/modules/shared/infrastructure/node/als/als-context"
import { UuidV7Generator } from "@/backend/modules/shared/infrastructure/uuid/uuid-v7-generator"
import { GetDbPortToken } from "../application/ports/db/get-db.port"

export const initInfrastructureDependency = (
  container: DependencyContainer
) => {
  // node
  container.registerInstance(
    AlsContext,
    new AlsContext(new AsyncLocalStorage())
  )

  // db
  container.registerSingleton(GetDbPortToken, GetDb)
  container.registerSingleton(TransactorToken, DbTransactor)

  // uuid
  container.registerSingleton(UuidV7GeneratorPortToken, UuidV7Generator)
}
