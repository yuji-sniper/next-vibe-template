import { getAuthAdminAction } from "@/backend/modules/auth-admin/internal/presentation/actions/get-auth-admin/get-auth-admin.action"
import { ServerError } from "@/utils/error/server-error"
import type { AuthAdmin } from "../types/auth-admin"

export type GetAuthAdminQuery = (params: { orError?: boolean }) => Promise<{
  authAdmin: AuthAdmin | undefined
}>

export const getAuthAdminQuery: GetAuthAdminQuery = async ({
  orError = true
}) => {
  const res = await getAuthAdminAction()

  if (!res.ok) {
    if (!orError) {
      return {
        authAdmin: undefined
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
