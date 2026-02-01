import type { ExtractTablesWithRelations } from "drizzle-orm"
import type { MySqlTransaction } from "drizzle-orm/mysql-core"
import type {
  MySql2PreparedQueryHKT,
  MySql2QueryResultHKT
} from "drizzle-orm/mysql2"
import type { Db } from "../../../infrastructure/db/mysql/drizzle/client"
import type * as schema from "../../../infrastructure/db/mysql/drizzle/schemas"

export type DbTransaction = MySqlTransaction<
  MySql2QueryResultHKT,
  MySql2PreparedQueryHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>

export interface GetDbPort {
  handle(): Db | DbTransaction
}

export const GetDbPortToken = Symbol("GetDbPort")
