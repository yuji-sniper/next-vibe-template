import "client-only"

import { oneTapClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import { env } from "@/env"

export const authAdminClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_ORIGIN_ADMIN,
  plugins: [
    oneTapClient({
      clientId: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID_ADMIN,
      cancelOnTapOutside: false,
      additionalOptions: {
        use_fedcm_for_prompt: false
      },
      promptOptions: {
        fedCM: false
      }
    })
  ]
})
