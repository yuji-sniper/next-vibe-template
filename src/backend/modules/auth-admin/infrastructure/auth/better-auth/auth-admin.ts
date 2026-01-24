import "server-only"

import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { oneTap } from "better-auth/plugins"
import { db } from "@/backend/modules/shared/infrastructure/db/postgresql/drizzle/client"
import { env } from "@/env"

export type Session = Awaited<ReturnType<typeof authAdmin.api.getSession>>

export const authAdmin = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg"
  }),
  baseURL: env.NEXT_PUBLIC_ORIGIN_ADMIN,
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
    modelName: "admins",
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
