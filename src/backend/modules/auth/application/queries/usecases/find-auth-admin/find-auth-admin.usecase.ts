import { injectable } from "tsyringe"
import type { GetAuthAdminPort } from "../../ports/get-auth-admin.port"
import type {
  FindAuthAdminUseCasePort,
  FindAuthAdminUseCasePortOutput
} from "./find-auth-admin.usecase.port"

@injectable()
export class FindAuthAdminUseCase implements FindAuthAdminUseCasePort {
  constructor(private readonly getAuthAdmin: GetAuthAdminPort) {}

  async handle(): Promise<FindAuthAdminUseCasePortOutput> {
    const output = await this.getAuthAdmin.handle()

    return {
      authAdmin: {
        id: output.authAdmin.id,
        email: output.authAdmin.email.value,
        name: output.authAdmin.name
      }
    }
  }
}
