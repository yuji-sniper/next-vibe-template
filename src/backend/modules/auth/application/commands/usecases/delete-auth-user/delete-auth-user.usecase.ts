import { inject, injectable } from "tsyringe"
import type { GetAuthUserPort } from "@/backend/modules/auth/application/queries/ports/get-auth-user.port"
import { GetAuthUserPortToken } from "@/backend/modules/auth/application/queries/ports/get-auth-user.port"
import { AuthUserDeleteFailedError } from "@/backend/modules/auth/domain/auth-user/auth-user.errors"
import type { UserRepository } from "@/backend/modules/auth/domain/auth-user/user.repository"
import { UserRepositoryToken } from "@/backend/modules/auth/domain/auth-user/user.repository"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { DeleteAuthUserUseCasePort } from "./delete-auth-user.usecase.port"

@injectable()
export class DeleteAuthUserUseCase implements DeleteAuthUserUseCasePort {
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(GetAuthUserPortToken)
    private readonly getAuthUser: GetAuthUserPort,
    @inject(UserRepositoryToken)
    private readonly userRepository: UserRepository
  ) {}

  async handle(): Promise<void> {
    this.logger.info("Deleting auth user started")

    const { authUser } = await this.getAuthUser.handle()

    this.logger.info("Deleting user from repository", { userId: authUser.id })
    const deleted = await this.userRepository.delete(authUser.id)

    if (!deleted) {
      throw new AuthUserDeleteFailedError()
    }

    this.logger.info("Auth user deleted successfully", { userId: authUser.id })
  }
}
