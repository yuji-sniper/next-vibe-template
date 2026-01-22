import type { ExtractTablesWithRelations } from "drizzle-orm"
import type { PgTransaction } from "drizzle-orm/pg-core"
import type { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js"
import { inject, injectable } from "tsyringe"
import { AlsContext } from "../../../../shared/infrastructure/node"
import { type Db, db } from "./client"
import type * as schema from "./schemas"
import { PG_DRIZZLE_TRANSACTION_KEY } from "./transactor"

type DbTransaction = PgTransaction<
  PostgresJsQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>

@injectable()
export class GetDb {
  constructor(
    @inject(AlsContext)
    private readonly alsContext: AlsContext
  ) {}

  handle(): Db | DbTransaction {
    const tx = this.alsContext.get<DbTransaction>(PG_DRIZZLE_TRANSACTION_KEY)
    if (tx) {
      return tx
    }

    return db
  }
}
