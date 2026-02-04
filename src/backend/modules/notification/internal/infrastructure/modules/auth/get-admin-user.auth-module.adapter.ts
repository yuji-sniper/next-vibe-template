import { inject, injectable } from "tsyringe"
import { AuthAdminUnauthorizedError } from "@/backend/modules/auth-admin/public/errors/auth-admin.errors"
import type { FindAuthAdminUseCasePort } from "@/backend/modules/auth-admin/public/ports/find-auth-admin.usecase.port"
import { FindAuthAdminUseCasePortToken } from "@/backend/modules/auth-admin/public/ports/find-auth-admin.usecase.port"
import type {
  GetAdminUserPort,
  GetAdminUserPortOutput
} from "@/backend/modules/notification/internal/application/ports/get-admin-user.port"

@injectable()
export class GetAdminUserAuthModuleAdapter implements GetAdminUserPort {
  constructor(
    @inject(FindAuthAdminUseCasePortToken)
    private readonly findAuthAdmin: FindAuthAdminUseCasePort
  ) {}

  async handle(): Promise<GetAdminUserPortOutput> {
    try {
      const { authAdmin } = await this.findAuthAdmin.handle()

      return {
        adminUserId: authAdmin.id,
        email: authAdmin.email
      }
    } catch (error) {
      if (error instanceof AuthAdminUnauthorizedError) {
        throw error
      }
      throw new AuthAdminUnauthorizedError()
    }
  }
}
