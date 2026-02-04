import { defineConfig } from "drizzle-kit"
import { env } from "@/env"

const isRemoteHost =
  env.DATABASE_HOST !== "localhost" && env.DATABASE_HOST !== "127.0.0.1"

export default defineConfig({
  out: "./src/backend/libs/drizzle/migrations",
  schema:
    "./src/backend/modules/**/infrastructure/db/mysql/drizzle/schemas/*.ts",
  dialect: "mysql",
  dbCredentials: {
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
    ssl: isRemoteHost ? {} : undefined
  }
})
