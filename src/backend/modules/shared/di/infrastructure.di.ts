import type { DependencyContainer } from "tsyringe"
import { RequestContextPortToken } from "@/backend/modules/shared/application/ports/context/request-context.port"
import { TransactorToken } from "@/backend/modules/shared/application/ports/db/transactor.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { UuidV7GeneratorPortToken } from "@/backend/modules/shared/application/ports/uuid/uuid-v7-generator.port"
import { RequestContext } from "@/backend/modules/shared/infrastructure/context/request-context"
import { GetDb } from "@/backend/modules/shared/infrastructure/db/mysql/drizzle/get-db"
import { DbTransactor } from "@/backend/modules/shared/infrastructure/db/mysql/drizzle/transactor"
import { PinoLogger } from "@/backend/modules/shared/infrastructure/logger/pino-logger"
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

  // context
  container.registerSingleton(RequestContextPortToken, RequestContext)

  // logger
  container.registerSingleton(LoggerPortToken, PinoLogger)

  // db
  container.registerSingleton(GetDbPortToken, GetDb)
  container.registerSingleton(TransactorToken, DbTransactor)

  // uuid
  container.registerSingleton(UuidV7GeneratorPortToken, UuidV7Generator)
}
