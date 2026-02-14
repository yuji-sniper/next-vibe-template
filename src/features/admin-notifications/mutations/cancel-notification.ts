import { cancelNotificationAction } from "@/backend/modules/notification/internal/presentation/actions/cancel-notification/cancel-notification.action"
import { ServerError } from "@/utils/error/server-error"

export type CancelNotificationMutationParams = {
  id: string
}

export const cancelNotificationMutation = async ({
  id
}: CancelNotificationMutationParams): Promise<void> => {
  const res = await cancelNotificationAction({ id })

  if (!res.ok) {
    throw new ServerError(
      res.error.code,
      res.error.status,
      res.error.message,
      res.error.details
    )
  }
}
