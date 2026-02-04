import { inject, injectable } from "tsyringe"
import type { GetAuthAdminPort } from "@/backend/modules/auth-admin/internal/application/queries/ports/get-auth-admin.port"
import { GetAuthAdminPortToken } from "@/backend/modules/auth-admin/internal/application/queries/ports/get-auth-admin.port"
import { AuthAdminUnauthorizedError } from "@/backend/modules/auth-admin/public/errors/auth-admin.errors"
import type {
  FindAuthAdminUseCasePort,
  FindAuthAdminUseCasePortOutput
} from "@/backend/modules/auth-admin/public/ports/find-auth-admin.usecase.port"

@injectable()
export class FindAuthAdminUseCase implements FindAuthAdminUseCasePort {
  constructor(
    @inject(GetAuthAdminPortToken)
    private readonly getAuthAdmin: GetAuthAdminPort
  ) {}

  async handle(): Promise<FindAuthAdminUseCasePortOutput> {
    const { authAdmin } = await this.getAuthAdmin.handle()

    if (!authAdmin) {
      throw new AuthAdminUnauthorizedError()
    }

    return {
      authAdmin: {
        id: authAdmin.id,
        email: authAdmin.email.value,
        name: authAdmin.name
      }
    }
  }
}
