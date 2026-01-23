import { inject, injectable } from "tsyringe"
import type { GetAuthUserPort } from "../../ports/get-auth-user.port"
import { GetAuthUserPortToken } from "../../ports/get-auth-user.port"
import type {
  FindAuthUserUseCasePort,
  FindAuthUserUseCasePortOutput
} from "./find-auth-user.usecase.port"

@injectable()
export class FindAuthUserUseCase implements FindAuthUserUseCasePort {
  constructor(
    @inject(GetAuthUserPortToken) private readonly getAuthUser: GetAuthUserPort
  ) {}

  async handle(): Promise<FindAuthUserUseCasePortOutput> {
    const output = await this.getAuthUser.handle()

    return {
      authUser: {
        id: output.authUser.id,
        email: output.authUser.email.value,
        name: output.authUser.name
      }
    }
  }
}
