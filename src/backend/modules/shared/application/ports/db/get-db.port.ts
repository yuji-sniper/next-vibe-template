import type { ExtractTablesWithRelations } from "drizzle-orm"
import type { PgTransaction } from "drizzle-orm/pg-core"
import type { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js"
import type { Db } from "../../../infrastructure/db/postgresql/drizzle/client"
import type * as schema from "../../../infrastructure/db/postgresql/drizzle/schemas"

export type DbTransaction = PgTransaction<
  PostgresJsQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>

export interface GetDbPort {
  handle(): Db | DbTransaction
}

export const GetDbPortToken = Symbol("GetDbPort")
