import { getAuthUserAction } from "@/backend/modules/auth/internal/presentation/actions/get-auth-user/get-auth-user.action"
import { ServerError } from "@/utils/error/server-error"
import type { AuthUser } from "../types/auth-user"

export type GetAuthUserQuery = (params: { orError?: boolean }) => Promise<{
  authUser: AuthUser | undefined
}>

export const getAuthUserQuery: GetAuthUserQuery = async ({
  orError = true
}) => {
  const res = await getAuthUserAction()

  if (!res.ok) {
    if (!orError) {
      return {
        authUser: undefined
      }
    }

    throw new ServerError(
      res.error.code,
      res.error.status,
      res.error.message,
      res.error.details
    )
  }

  return res.data
}
