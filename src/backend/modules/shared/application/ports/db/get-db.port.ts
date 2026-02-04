import type { ExtractTablesWithRelations } from "drizzle-orm"
import type { MySqlTransaction } from "drizzle-orm/mysql-core"
import type {
  MySql2PreparedQueryHKT,
  MySql2QueryResultHKT
} from "drizzle-orm/mysql2"
import type { Db } from "@/backend/bootstrap/db/client"
import type * as schema from "@/backend/bootstrap/db/schemas"

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
