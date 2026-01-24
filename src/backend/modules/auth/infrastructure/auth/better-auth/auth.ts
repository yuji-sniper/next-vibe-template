import "server-only"

import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { oneTap } from "better-auth/plugins"
import { db } from "@/backend/modules/shared/infrastructure/db/postgresql/drizzle/client"
import { env } from "@/env"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg"
  }),
  baseURL: env.NEXT_PUBLIC_ORIGIN,
  socialProviders: {
    google: {
      clientId: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    }
  },
  plugins: [oneTap()],
  user: {
    modelName: "users",
    additionalFields: {
      storageKey: {
        type: "string"
      },
      tokenBalance: {
        type: "number",
        default: 0
      }
    }
  },
  session: {
    modelName: "sessions"
  },
  account: {
    modelName: "accounts"
  },
  verification: {
    modelName: "verifications"
  }
})
