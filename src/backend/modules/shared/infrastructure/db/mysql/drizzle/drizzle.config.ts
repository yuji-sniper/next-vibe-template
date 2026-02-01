import { defineConfig } from "drizzle-kit"
import { env } from "@/env"

export default defineConfig({
  out: "./src/backend/modules/shared/infrastructure/db/mysql/drizzle/migrations",
  schema:
    "./src/backend/modules/shared/infrastructure/db/mysql/drizzle/schemas",
  dialect: "mysql",
  dbCredentials: {
    url: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME
  }
})
