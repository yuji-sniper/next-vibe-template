import { inject, injectable } from "tsyringe"
import type { GetAuthUserPort } from "@/backend/modules/auth/internal/application/ports/get-auth-user.port"
import { GetAuthUserPortToken } from "@/backend/modules/auth/internal/application/ports/get-auth-user.port"
import { AuthUserUnauthorizedError } from "@/backend/modules/auth/public/errors/auth.errors"
import type {
  FindAuthUserUseCasePort,
  FindAuthUserUseCasePortOutput
} from "@/backend/modules/auth/public/ports/find-auth-user.usecase.port"

@injectable()
export class FindAuthUserUseCase implements FindAuthUserUseCasePort {
  constructor(
    @inject(GetAuthUserPortToken) private readonly getAuthUser: GetAuthUserPort
  ) {}

  async handle(): Promise<FindAuthUserUseCasePortOutput> {
    const output = await this.getAuthUser.handle()

    if (!output.authUser) {
      throw new AuthUserUnauthorizedError()
    }

    return {
      authUser: {
        id: output.authUser.id,
        email: output.authUser.email.value,
        name: output.authUser.name,
        image: output.authUser.image
      }
    }
  }
}
