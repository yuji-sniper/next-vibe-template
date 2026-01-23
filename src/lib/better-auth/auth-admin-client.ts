import "client-only"

import { oneTapClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import { env } from "@/env"

export const authAdminClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_ORIGIN_ADMIN,
  plugins: [
    // inferAdditionalFields<typeof authAdmin>(),
    oneTapClient({
      clientId: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID_ADMIN,
      cancelOnTapOutside: false,
      promptOptions: {
        fedCM: false
      }
    })
  ]
})
