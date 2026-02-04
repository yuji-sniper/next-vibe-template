import { deleteAuthUserAction } from "@/backend/modules/auth/internal/presentation/actions/delete-auth-user/delete-auth-user.action"
import { ServerError } from "@/utils/error/server-error"

export type DeleteAuthUserMutation = () => Promise<void>

export const deleteAuthUserMutation: DeleteAuthUserMutation = async () => {
  const res = await deleteAuthUserAction()

  if (!res.ok) {
    throw new ServerError(
      res.error.code,
      res.error.status,
      res.error.message,
      res.error.details
    )
  }
}
