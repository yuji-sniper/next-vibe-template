import { redirect } from "next/navigation"
import { getAuthUserAction } from "@/backend"
import { ServerError } from "@/utils/error"
import type { AuthUser } from "../types/auth-user"

export type GetAuthUserQuery = (params: {
  redirectIfUnauthorized?: boolean
}) => Promise<{
  authUser: AuthUser
}>

export const getAuthUserQuery: GetAuthUserQuery = async ({
  redirectIfUnauthorized = false
}) => {
  const res = await getAuthUserAction()

  if (!res.ok) {
    if (redirectIfUnauthorized) {
      redirect("/sign-in")
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
