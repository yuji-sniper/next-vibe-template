import { updateNotificationAction } from "@/backend/modules/notification/internal/presentation/actions/update-notification/update-notification.action"
import { ServerError } from "@/utils/error/server-error"
import type { NotificationFormValues } from "../types/notification-form"

export type UpdateNotificationInput = {
  id: string
} & NotificationFormValues

export const updateNotificationMutation = async (
  input: UpdateNotificationInput
) => {
  const res = await updateNotificationAction({
    id: input.id,
    title: input.title,
    subject: input.subject,
    bodyText: input.bodyText,
    bodyHtml: input.bodyHtml || null,
    sendAt: input.sendAt.toISOString(),
    audienceType: input.audienceType,
    audiencePayload: input.audiencePayload
  })

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
