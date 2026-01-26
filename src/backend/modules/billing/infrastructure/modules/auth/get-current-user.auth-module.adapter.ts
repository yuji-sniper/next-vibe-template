import { inject, injectable } from "tsyringe"
import type { GetAuthUserPort } from "@/backend/modules/auth/application/queries/ports/get-auth-user.port"
import { GetAuthUserPortToken } from "@/backend/modules/auth/application/queries/ports/get-auth-user.port"
import type {
  GetCurrentUserPort,
  GetCurrentUserPortOutput
} from "../../../application/ports/get-current-user.port"

@injectable()
export class GetCurrentUserAuthModuleAdapter implements GetCurrentUserPort {
  constructor(
    @inject(GetAuthUserPortToken)
    private readonly getAuthUser: GetAuthUserPort
  ) {}

  async handle(): Promise<GetCurrentUserPortOutput> {
    const { authUser } = await this.getAuthUser.handle()

    return {
      userId: authUser.id,
      email: authUser.email.value
    }
  }
}
