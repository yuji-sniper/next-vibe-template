import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { oneTap } from "better-auth/plugins"
import { db } from "@/backend/bootstrap/db/client"
import { env } from "@/env"

export type Session = Awaited<ReturnType<typeof auth.api.getSession>>

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "mysql"
  }),
  baseURL: env.NEXT_PUBLIC_ORIGIN_ADMIN,
  trustedOrigins: [env.NEXT_PUBLIC_ORIGIN_ADMIN],
  advanced: {
    cookies: {
      session_token: {
        name: "admin_session_token"
      }
    }
  },
  socialProviders: {
    google: {
      clientId: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID_ADMIN,
      clientSecret: env.GOOGLE_CLIENT_SECRET_ADMIN
    }
  },
  plugins: [oneTap()],
  user: {
    modelName: "admins"
  },
  session: {
    modelName: "admin_sessions"
  },
  account: {
    modelName: "admin_accounts"
  },
  verification: {
    modelName: "admin_verifications"
  },
  databaseHooks: {
    user: {
      create: {
        before: async () => {
          // 事前登録方式: 新規ユーザー作成を拒否
          // 事前にadminsテーブルにメールアドレスを登録しておく必要がある
          // 登録済みのメールでログインすると、既存レコードにOAuthアカウントがリンクされる
          // 未登録のメールでログインすると、ここで拒否される
          throw new Error(
            "管理者として登録されていません。管理者にお問い合わせください。"
          )
        }
      }
    }
  }
})
