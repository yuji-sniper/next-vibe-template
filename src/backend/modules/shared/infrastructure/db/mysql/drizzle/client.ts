import { drizzle } from "drizzle-orm/mysql2"
import mysql from "mysql2/promise"
import { env } from "@/env"
import * as schema from "./schemas"

const connection = await mysql.createConnection({
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  user: env.DATABASE_USER,
  database:
    process.env.NODE_ENV === "test"
      ? env.DATABASE_NAME_TEST
      : env.DATABASE_NAME,
  password: env.DATABASE_PASSWORD
})

export const db = drizzle({ client: connection, schema, mode: "default" })

export type Db = typeof db
