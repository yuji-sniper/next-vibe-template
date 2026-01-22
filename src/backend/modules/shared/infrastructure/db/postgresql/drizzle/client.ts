"server-only"

import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { env } from "@/env"
import * as schema from "./schemas"

const databaseUrl = env.DATABASE_URL

export type Db = PostgresJsDatabase<typeof schema>

const client = postgres(databaseUrl, {
  prepare: false
})

export const db: Db = drizzle({ client, schema })
