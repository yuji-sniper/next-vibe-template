import { redirect } from "next/navigation"
import { getAuthAdminAction } from "@/backend"
import { ServerError } from "@/utils/error"
import type { AuthAdmin } from "../types/auth-admin"

export type GetAuthAdminQuery = (params: {
  redirectIfUnauthorized?: boolean
}) => Promise<{
  authAdmin: AuthAdmin
}>

export const getAuthAdminQuery: GetAuthAdminQuery = async ({
  redirectIfUnauthorized = false
}) => {
  const res = await getAuthAdminAction()

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
