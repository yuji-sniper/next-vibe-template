import { resolveContainer } from "@/backend/bootstrap/container"
import {
  type DeleteAuthUserUseCasePort,
  DeleteAuthUserUseCasePortToken
} from "@/backend/modules/auth/application/commands/usecases/delete-auth-user/delete-auth-user.usecase.port"
import {
  AuthUserDeleteFailedError,
  AuthUserUnauthorizedError
} from "@/backend/modules/auth/domain/auth-user/auth-user.errors"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { AUTH_ERROR_CODES } from "@/shared/errors/auth.errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

type DeleteAuthUserHandlerResult = Result<void>

export const handleDeleteAuthUser =
  async (): Promise<DeleteAuthUserHandlerResult> => {
    const usecase = await resolveContainer<DeleteAuthUserUseCasePort>(
      DeleteAuthUserUseCasePortToken
    )

    try {
      await usecase.handle()

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
        return {
          ok: false,
          error: {
            code: AUTH_ERROR_CODES.DELETE_FAILED,
            status: 500,
            message: "Failed to delete user"
          }
        }
      }

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
