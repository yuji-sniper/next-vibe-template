import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { oneTap } from "better-auth/plugins"
import { db } from "@/backend/bootstrap/db/client"
import { env } from "@/env"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "mysql"
  }),
  baseURL: env.NEXT_PUBLIC_ORIGIN,
  trustedOrigins: [env.NEXT_PUBLIC_ORIGIN],
  socialProviders: {
    google: {
      clientId: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    }
  },
  plugins: [oneTap()],
  user: {
    modelName: "users",
    additionalFields: {}
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
