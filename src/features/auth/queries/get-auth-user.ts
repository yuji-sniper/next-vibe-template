import { getAuthUserAction } from "@/backend"
import { ServerError } from "@/utils/error"
import type { AuthUser } from "../types/auth-user"

export type GetAuthUserQuery = () => Promise<{
  authUser: AuthUser
}>

export const getAuthUserQuery: GetAuthUserQuery = async () => {
  const res = await getAuthUserAction()

  if (!res.ok) {
    throw new ServerError(
      res.error.code,
      res.error.status,
      res.error.message,
      res.error.details
    )
  }

  return res.data
}
