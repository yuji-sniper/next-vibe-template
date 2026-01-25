import { resolveContainer } from "@/backend/bootstrap/container"
import {
  type DeleteAuthAdminUseCasePort,
  DeleteAuthAdminUseCasePortToken
} from "@/backend/modules/auth-admin/application/commands/usecases/delete-auth-admin/delete-auth-admin.usecase.port"
import {
  AuthAdminDeleteFailedError,
  AuthAdminUnauthorizedError
} from "@/backend/modules/auth-admin/domain/auth-admin/auth-admin.errors"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { AUTH_ADMIN_ERROR_CODES } from "@/shared/errors/auth-admin.errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

type DeleteAuthAdminHandlerResult = Result<void>

export const handleDeleteAuthAdmin =
  async (): Promise<DeleteAuthAdminHandlerResult> => {
    const usecase = await resolveContainer<DeleteAuthAdminUseCasePort>(
      DeleteAuthAdminUseCasePortToken
    )

    try {
      await usecase.handle()

      return {
        ok: true,
        data: undefined
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

      if (e instanceof AuthAdminDeleteFailedError) {
        return {
          ok: false,
          error: {
            code: AUTH_ADMIN_ERROR_CODES.DELETE_FAILED,
            status: 500,
            message: "Failed to delete admin"
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
