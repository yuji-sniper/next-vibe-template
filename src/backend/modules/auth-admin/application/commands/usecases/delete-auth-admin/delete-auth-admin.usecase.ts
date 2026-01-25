import { inject, injectable } from "tsyringe"
import type { GetAuthAdminPort } from "@/backend/modules/auth-admin/application/queries/ports/get-auth-admin.port"
import { GetAuthAdminPortToken } from "@/backend/modules/auth-admin/application/queries/ports/get-auth-admin.port"
import type { AdminRepository } from "@/backend/modules/auth-admin/domain/auth-admin/admin.repository"
import { AdminRepositoryToken } from "@/backend/modules/auth-admin/domain/auth-admin/admin.repository"
import type { DeleteAuthAdminUseCasePort } from "./delete-auth-admin.usecase.port"

@injectable()
export class DeleteAuthAdminUseCase implements DeleteAuthAdminUseCasePort {
  constructor(
    @inject(GetAuthAdminPortToken)
    private readonly getAuthAdmin: GetAuthAdminPort,
    @inject(AdminRepositoryToken)
    private readonly adminRepository: AdminRepository
  ) {}

  async handle(): Promise<void> {
    const { authAdmin } = await this.getAuthAdmin.handle()
    await this.adminRepository.delete(authAdmin.id)
  }
}
