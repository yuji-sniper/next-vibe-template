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
      additionalOptions: {
        use_fedcm_for_prompt: false
      },
      promptOptions: {
        fedCM: false
      }
    })
  ]
})
