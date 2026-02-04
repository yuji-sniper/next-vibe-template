import { inject, injectable } from "tsyringe"
import { AuthAdminUnauthorizedError } from "@/backend/modules/auth-admin/public/errors/auth-admin.errors"
import type { FindAuthAdminUseCasePort } from "@/backend/modules/auth-admin/public/ports/find-auth-admin.usecase.port"
import { FindAuthAdminUseCasePortToken } from "@/backend/modules/auth-admin/public/ports/find-auth-admin.usecase.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { AUTH_ADMIN_ERROR_CODES } from "@/shared/errors/auth-admin.errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

export type GetAuthAdminHandlerResult = Result<{
  authAdmin: {
    id: string
    email: string
    name: string
  }
}>

export const GetAuthAdminHandlerToken = Symbol("GetAuthAdminHandler")

export interface GetAuthAdminHandler {
  handle(): Promise<GetAuthAdminHandlerResult>
}

@injectable()
export class GetAuthAdminHandlerImpl implements GetAuthAdminHandler {
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(FindAuthAdminUseCasePortToken)
    private readonly findAuthAdminUseCase: FindAuthAdminUseCasePort
  ) {}

  async handle(): Promise<GetAuthAdminHandlerResult> {
    try {
      const output = await this.findAuthAdminUseCase.handle()

      return {
        ok: true,
        data: output
      }
    } catch (e: unknown) {
      if (e instanceof AuthAdminUnauthorizedError) {
        return {
          ok: false,
          error: {
            code: AUTH_ADMIN_ERROR_CODES.UNAUTHORIZED,
            status: 401,
            message: "Unauthorized"
          }
        }
      }

      this.logger.error("Unexpected error in GetAuthAdminHandler", {
        error: e instanceof Error ? e.message : String(e)
      })

      return {
        ok: false,
        error: {
          code: COMMON_ERROR_CODES.INTERNAL_SERVER_ERROR,
          status: 500,
          message: "Internal server error"
        }
      }
    }
  }
}
