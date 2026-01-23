import { getAuthAdminAction } from "@/backend"
import { ServerError } from "@/utils/error"
import type { AuthAdmin } from "../types/auth-admin"

export type GetAuthAdminQuery = () => Promise<{
  authAdmin: AuthAdmin
}>

export const getAuthAdminQuery: GetAuthAdminQuery = async () => {
  const res = await getAuthAdminAction()

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
