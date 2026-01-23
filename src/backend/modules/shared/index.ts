// application
export {
  type Transactor,
  TransactorToken
} from "./application/ports/db/transactor.port"
// di
export { initSharedDependency } from "./di"
// domain
export { Email } from "./domain/value-objects/email.vo"
// infrastructure
export { db } from "./infrastructure/db/postgresql/drizzle/client"
export { GetDb } from "./infrastructure/db/postgresql/drizzle/get-db"
export { DbTransactor } from "./infrastructure/db/postgresql/drizzle/transactor"
export { AlsContext } from "./infrastructure/node/als/als-context"
// presentation
export type { ActionResponse } from "./presentation/actions/types/action-response"
export type { Result } from "./presentation/handlers/types/result"
