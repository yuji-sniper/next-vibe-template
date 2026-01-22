import { headers } from "next/headers"
import { AuthUserUnauthorizedError } from "@/backend/modules/auth/domain/auth-user/auth-user.errors"
import type {
  GetAuthUserPort,
  GetAuthUserPortOutput
} from "../../../application/queries/ports/get-auth-user.port"
import { AuthUser } from "../../../domain/auth-user/auth-user"
import { auth } from "./auth"

export class GetAuthUserBetterAuthAdapter implements GetAuthUserPort {
  async handle(): Promise<GetAuthUserPortOutput> {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session) {
      throw new AuthUserUnauthorizedError()
    }

    return {
      authUser: AuthUser.create({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name
      })
    }
  }
}
