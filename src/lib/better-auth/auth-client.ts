import "client-only"

import { oneTapClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import { env } from "@/env"

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_ORIGIN,
  plugins: [
    oneTapClient({
      clientId: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      cancelOnTapOutside: false,
      context: "signin",
      promptOptions: {
        // FedCMはローカル開発環境では動作しないため、本番環境のみ有効化
        // NEXT_PUBLIC_ORIGINがhttpsで始まる場合のみFedCMを有効化
        fedCM: true
      }
    })
  ]
})
