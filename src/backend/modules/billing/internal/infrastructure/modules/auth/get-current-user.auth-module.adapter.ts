import { inject, injectable } from "tsyringe"
import type { FindAuthUserUseCasePort } from "@/backend/modules/auth/public/ports/find-auth-user.usecase.port"
import { FindAuthUserUseCasePortToken } from "@/backend/modules/auth/public/ports/find-auth-user.usecase.port"
import type {
  GetCurrentUserPort,
  GetCurrentUserPortOutput
} from "../../../application/ports/get-current-user.port"

@injectable()
export class GetCurrentUserAuthModuleAdapter implements GetCurrentUserPort {
  constructor(
    @inject(FindAuthUserUseCasePortToken)
    private readonly findAuthUser: FindAuthUserUseCasePort
  ) {}

  async handle(): Promise<GetCurrentUserPortOutput> {
    const { authUser } = await this.findAuthUser.handle()

    return {
      userId: authUser.id,
      email: authUser.email
    }
  }
}
