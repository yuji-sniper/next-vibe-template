import { findNotificationByIdAction } from "@/backend/modules/notification/internal/presentation/actions/find-notification-by-id/find-notification-by-id.action"
import { ServerError } from "@/utils/error/server-error"
import type { NotificationDetail } from "../types/notification-detail"

export type GetNotificationByIdQueryParams = {
  id: string
}

export const getNotificationByIdQuery = async (
  params: GetNotificationByIdQueryParams
): Promise<{ notification: NotificationDetail }> => {
  const res = await findNotificationByIdAction({ id: params.id })

  if (!res.ok) {
    throw new ServerError(
      res.error.code,
      res.error.status,
      res.error.message,
      res.error.details
    )
  }

  const n = res.data.notification
  const notification: NotificationDetail = {
    id: n.id,
    title: n.title,
    subject: n.subject,
    bodyText: n.bodyText,
    bodyHtml: n.bodyHtml,
    sendAt: n.sendAt.toString(),
    audienceType: n.audienceType,
    audiencePayload: n.audiencePayload,
    status: n.status,
    schedulerName: n.schedulerName,
    createdAt: n.createdAt.toString(),
    updatedAt: n.updatedAt.toString()
  }

  return { notification }
}
