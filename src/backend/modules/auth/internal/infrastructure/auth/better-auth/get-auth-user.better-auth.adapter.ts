import { headers } from "next/headers"
import type {
  GetAuthUserPort,
  GetAuthUserPortOutput
} from "@/backend/modules/auth/internal/application/ports/get-auth-user.port"
import { AuthUser } from "@/backend/modules/auth/internal/domain/auth-user/auth-user"
import { auth } from "./auth"

export class GetAuthUserBetterAuthAdapter implements GetAuthUserPort {
  async handle(): Promise<GetAuthUserPortOutput> {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session) {
      return {
        authUser: null
      }
    }

    return {
      authUser: AuthUser.reconstruct({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image ?? undefined
      })
    }
  }
}
