import { inject, injectable } from "tsyringe"
import {
  AuthUserDeleteFailedError,
  AuthUserUnauthorizedError
} from "@/backend/modules/auth/public/errors/auth.errors"
import type { DeleteAuthUserUseCasePort } from "@/backend/modules/auth/public/ports/delete-auth-user.usecase.port"
import { DeleteAuthUserUseCasePortToken } from "@/backend/modules/auth/public/ports/delete-auth-user.usecase.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { AUTH_ERROR_CODES } from "@/shared/errors/auth.errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

export type DeleteAuthUserHandlerResult = Result<void>

export const DeleteAuthUserHandlerToken = Symbol("DeleteAuthUserHandler")

export interface DeleteAuthUserHandler {
  handle(): Promise<DeleteAuthUserHandlerResult>
}

@injectable()
export class DeleteAuthUserHandlerImpl implements DeleteAuthUserHandler {
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(DeleteAuthUserUseCasePortToken)
    private readonly deleteAuthUserUseCase: DeleteAuthUserUseCasePort
  ) {}

  async handle(): Promise<DeleteAuthUserHandlerResult> {
    try {
      await this.deleteAuthUserUseCase.handle()

      return {
        ok: true,
        data: undefined
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

      if (e instanceof AuthUserDeleteFailedError) {
        this.logger.error("Failed to delete user", {
          error: e instanceof Error ? e.message : String(e)
        })
        return {
          ok: false,
          error: {
            code: AUTH_ERROR_CODES.DELETE_FAILED,
            status: 500,
            message: "Failed to delete user"
          }
        }
      }

      this.logger.error("Unexpected error in DeleteAuthUserHandler", {
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
