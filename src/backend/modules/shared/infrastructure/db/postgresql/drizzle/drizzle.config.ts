import { defineConfig } from "drizzle-kit"
import { env } from "@/env"

export default defineConfig({
  out: "./src/backend/infrastructure/db/postgresql/drizzle/migrations",
  schema: "./src/backend/infrastructure/db/postgresql/drizzle/schemas",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL
  }
})
