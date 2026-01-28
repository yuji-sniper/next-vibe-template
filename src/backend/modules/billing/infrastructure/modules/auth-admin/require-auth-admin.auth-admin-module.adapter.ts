import { inject, injectable } from "tsyringe"
import type { GetAuthAdminPort } from "@/backend/modules/auth-admin/application/queries/ports/get-auth-admin.port"
import { GetAuthAdminPortToken } from "@/backend/modules/auth-admin/application/queries/ports/get-auth-admin.port"
import type {
  RequireAuthAdminPort,
  RequireAuthAdminPortOutput
} from "../../../application/ports/require-auth-admin.port"

@injectable()
export class RequireAuthAdminAuthAdminModuleAdapter
  implements RequireAuthAdminPort
{
  constructor(
    @inject(GetAuthAdminPortToken)
    private readonly getAuthAdmin: GetAuthAdminPort
  ) {}

  async handle(): Promise<RequireAuthAdminPortOutput> {
    const { authAdmin } = await this.getAuthAdmin.handle()

    return {
      adminId: authAdmin.id
    }
  }
}
