import { inject, injectable } from "tsyringe"
import { AuthUserUnauthorizedError } from "@/backend/modules/auth/public/errors/auth.errors"
import type { FindAuthUserUseCasePort } from "@/backend/modules/auth/public/ports/find-auth-user.usecase.port"
import { FindAuthUserUseCasePortToken } from "@/backend/modules/auth/public/ports/find-auth-user.usecase.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { AUTH_ERROR_CODES } from "@/shared/errors/auth.errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

export type GetAuthUserHandlerResult = Result<{
  authUser: {
    id: string
    email: string
    name: string
    image?: string
  }
}>

export const GetAuthUserHandlerToken = Symbol("GetAuthUserHandler")

export interface GetAuthUserHandler {
  handle(): Promise<GetAuthUserHandlerResult>
}

@injectable()
export class GetAuthUserHandlerImpl implements GetAuthUserHandler {
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(FindAuthUserUseCasePortToken)
    private readonly findAuthUserUseCase: FindAuthUserUseCasePort
  ) {}

  async handle(): Promise<GetAuthUserHandlerResult> {
    try {
      const output = await this.findAuthUserUseCase.handle()

      return {
        ok: true,
        data: output
      }
    } catch (e: unknown) {
      if (e instanceof AuthUserUnauthorizedError) {
        return {
          ok: false,
          error: {
            code: AUTH_ERROR_CODES.UNAUTHORIZED,
            status: 401,
            message: "Unauthorized"
          }
        }
      }

      this.logger.error("Unexpected error in GetAuthUserHandler", {
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
