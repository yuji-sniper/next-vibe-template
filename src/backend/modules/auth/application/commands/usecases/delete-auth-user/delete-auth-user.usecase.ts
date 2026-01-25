import { inject, injectable } from "tsyringe"
import type { GetAuthUserPort } from "@/backend/modules/auth/application/queries/ports/get-auth-user.port"
import { GetAuthUserPortToken } from "@/backend/modules/auth/application/queries/ports/get-auth-user.port"
import type { UserRepository } from "@/backend/modules/auth/domain/auth-user/user.repository"
import { UserRepositoryToken } from "@/backend/modules/auth/domain/auth-user/user.repository"
import type { DeleteAuthUserUseCasePort } from "./delete-auth-user.usecase.port"

@injectable()
export class DeleteAuthUserUseCase implements DeleteAuthUserUseCasePort {
  constructor(
    @inject(GetAuthUserPortToken)
    private readonly getAuthUser: GetAuthUserPort,
    @inject(UserRepositoryToken)
    private readonly userRepository: UserRepository
  ) {}

  async handle(): Promise<void> {
    const { authUser } = await this.getAuthUser.handle()
    await this.userRepository.delete(authUser.id)
  }
}
