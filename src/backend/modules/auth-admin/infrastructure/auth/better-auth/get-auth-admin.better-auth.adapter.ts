import { headers } from "next/headers"
import type {
  GetAuthAdminPort,
  GetAuthAdminPortOutput
} from "../../../application/queries/ports/get-auth-admin.port"
import { AuthAdmin } from "../../../domain/auth-admin/auth-admin"
import { AuthAdminUnauthorizedError } from "../../../domain/auth-admin/auth-admin.errors"
import { authAdmin } from "./auth-admin"

export class GetAuthAdminBetterAuthAdapter implements GetAuthAdminPort {
  async handle(): Promise<GetAuthAdminPortOutput> {
    const session = await authAdmin.api.getSession({
      headers: await headers()
    })

    if (!session) {
      throw new AuthAdminUnauthorizedError()
    }

    return {
      authAdmin: AuthAdmin.reconstruct({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name
      })
    }
  }
}
