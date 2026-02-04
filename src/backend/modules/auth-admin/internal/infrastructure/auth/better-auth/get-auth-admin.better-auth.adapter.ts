import { headers } from "next/headers"
import type {
  GetAuthAdminPort,
  GetAuthAdminPortOutput
} from "@/backend/modules/auth-admin/internal/application/queries/ports/get-auth-admin.port"
import { AuthAdmin } from "@/backend/modules/auth-admin/internal/domain/auth-admin/auth-admin"
import { auth } from "./auth"

export class GetAuthAdminBetterAuthAdapter implements GetAuthAdminPort {
  async handle(): Promise<GetAuthAdminPortOutput> {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session) {
      return {
        authAdmin: null
      }
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
