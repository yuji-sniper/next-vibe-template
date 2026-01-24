import { resolveContainer } from "@/backend/bootstrap/container"
import {
  type FindAuthUserUseCasePort,
  FindAuthUserUseCasePortToken
} from "@/backend/modules/auth/application/queries/usecases/find-auth-user/find-auth-user.usecase.port"
import { AuthUserUnauthorizedError } from "@/backend/modules/auth/domain/auth-user/auth-user.errors"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { AUTH_ERROR_CODES } from "@/shared/errors/auth.errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

type GetAuthUserControllerResult = Result<{
  authUser: {
    id: string
    email: string
    name: string
  }
}>

export const handleGetAuthUser =
  async (): Promise<GetAuthUserControllerResult> => {
    const usecase = await resolveContainer<FindAuthUserUseCasePort>(
      FindAuthUserUseCasePortToken
    )

    try {
      const output = await usecase.handle()

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
