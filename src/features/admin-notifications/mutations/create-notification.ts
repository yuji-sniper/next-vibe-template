import { createNotificationAction } from "@/backend/modules/notification/internal/presentation/actions/create-notification/create-notification.action"
import { ServerError } from "@/utils/error/server-error"
import { AudienceType } from "../types/notification"
import type { NotificationFormValues } from "../types/notification-form"

const audienceTypeMap = {
  [AudienceType.ALL]: AudienceType.ALL,
  [AudienceType.SEGMENT]: AudienceType.SEGMENT,
  [AudienceType.SINGLE]: AudienceType.SINGLE
} as const

export const createNotificationMutation = async (
  input: NotificationFormValues
) => {
  const res = await createNotificationAction({
    title: input.title,
    subject: input.subject,
    bodyText: input.bodyText,
    bodyHtml: input.bodyHtml || undefined,
    sendAt: input.sendAt.toISOString(),
    audienceType: audienceTypeMap[input.audienceType],
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
