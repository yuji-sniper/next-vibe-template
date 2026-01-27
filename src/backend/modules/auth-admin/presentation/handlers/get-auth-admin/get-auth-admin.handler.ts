import { resolveContainer } from "@/backend/bootstrap/container"
import {
  type FindAuthAdminUseCasePort,
  FindAuthAdminUseCasePortToken
} from "@/backend/modules/auth-admin/application/queries/usecases/find-auth-admin/find-auth-admin.usecase.port"
import { AuthAdminUnauthorizedError } from "@/backend/modules/auth-admin/domain/auth-admin/auth-admin.errors"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { AUTH_ADMIN_ERROR_CODES } from "@/shared/errors/auth-admin.errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

type GetAuthAdminControllerResult = Result<{
  authAdmin: {
    id: string
    email: string
    name: string
  }
}>

export const handleGetAuthAdmin =
  async (): Promise<GetAuthAdminControllerResult> => {
    const usecase = await resolveContainer<FindAuthAdminUseCasePort>(
      FindAuthAdminUseCasePortToken
    )

    try {
      const output = await usecase.handle()

      return {
        ok: true,
        data: output
      }
    } catch (e: unknown) {
      console.error(e)

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
