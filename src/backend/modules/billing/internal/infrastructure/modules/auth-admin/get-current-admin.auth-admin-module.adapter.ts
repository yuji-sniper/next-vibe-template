import { inject, injectable } from "tsyringe"
import {
  type FindAuthAdminUseCasePort,
  FindAuthAdminUseCasePortToken
} from "@/backend/modules/auth-admin/public/ports/find-auth-admin.usecase.port"
import type {
  GetCurrentAdminPort,
  GetCurrentAdminPortOutput
} from "../../../application/ports/get-current-admin.port"

@injectable()
export class GetCurrentAdminAuthAdminModuleAdapter
  implements GetCurrentAdminPort
{
  constructor(
    @inject(FindAuthAdminUseCasePortToken)
    private readonly findAuthAdminUseCase: FindAuthAdminUseCasePort
  ) {}

  async handle(): Promise<GetCurrentAdminPortOutput> {
    const { authAdmin } = await this.findAuthAdminUseCase.handle()

    return {
      adminId: authAdmin.id
    }
  }
}
